const axios = require("axios");

module.exports = {
	config: {
		name: "pinterest",
		aliases: ["pin"],
		version: "1.0.3",
		author: "EryXenX",
		countDown: 10,
		role: 0,
		category: "image",
		description: {
			en: "Search Pinterest pins and browse the results page by page"
		},
		guide: {
			en: "   {pn} <query> — search and show the first page"
				+ "\n   {pn} <query> -n<number> — pics per page (1-10, default 10)"
				+ "\n   Then react to the result for the next page, or reply \"n\" / a page number."
		}
	},

	onStart: async function ({ event, args, message, commandName }) {
		const { query, limit } = parseArgs(args);

		if (!query)
			return message.reply("Usage: pinterest <query> [-n<count>]\nExample: pinterest cat -n10");

		await message.reaction("⏳", event.messageID);

		try {
			await sendPage({
				message,
				commandName,
				author: event.senderID,
				query,
				limit,
				page: 1,
				bookmarks: [null]
			});
			await message.reaction("✅", event.messageID);
		}
		catch (err) {
			console.error("[pinterest] search failed:", errMsg(err));
			await message.reaction("❌", event.messageID);
			message.reply(`Search failed: ${errMsg(err)}`);
		}
	},

	onReply: async function ({ event, message, Reply, commandName }) {
		if (event.senderID !== Reply.author)
			return;

		const body = String(event.body || "").trim().toLowerCase();
		let page;

		if (body === "n" || body === "next") {
			if (!Reply.hasMore)
				return message.reply("That is the last page.");
			page = Reply.page + 1;
		}
		else {
			const match = body.match(/^(?:page|p)?\s*(\d+)$/);
			const parsed = match ? parseInt(match[1], 10) : NaN;
			if (!Number.isFinite(parsed) || parsed < 1)
				return message.reply('Reply with a page number, or "n" for the next page.');
			page = parsed;
		}

		if (Reply.bookmarks[page - 1] === undefined)
			return message.reply(`Page ${page} is not reachable yet. Highest available page is ${Reply.bookmarks.length}.`);

		await goToPage({
			message,
			commandName,
			state: Reply,
			page,
			reactTarget: event.messageID
		});
	},

	onReaction: async function ({ event, message, Reaction, commandName }) {
		if (event.userID !== Reaction.author)
			return;
		if (!event.reaction)
			return;
		if (!Reaction.hasMore)
			return message.reply("That is the last page.");

		await goToPage({
			message,
			commandName,
			state: Reaction,
			page: Reaction.page + 1,
			reactTarget: Reaction.messageID
		});
	}
};

const API_BASE = "https://eryxenx.agi.bd/api";
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 10;
const FETCH_SIZE = 25;
const TIMEOUT = 30000;
const IMAGE_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const api = axios.create({ baseURL: API_BASE, timeout: TIMEOUT });

function errMsg(err) {
	const data = err && err.response && err.response.data;
	return (data && (data.message || data.error || data.detail)) || (err && err.message) || "Unknown error";
}

function parseArgs(args) {
	let limit = DEFAULT_LIMIT;
	const words = [];

	for (let i = 0; i < args.length; i++) {
		const arg = String(args[i]);

		if (arg === "-n" || arg === "--limit") {
			const parsed = parseInt(args[++i], 10);
			if (Number.isFinite(parsed))
				limit = parsed;
		}
		else if (/^-n\d+$/.test(arg)) {
			limit = parseInt(arg.slice(2), 10);
		}
		else {
			words.push(arg);
		}
	}

	return {
		query: words.join(" ").trim(),
		limit: Math.max(1, Math.min(MAX_LIMIT, limit || DEFAULT_LIMIT))
	};
}

async function fetchPins(query, bookmark) {
	const params = { q: query, limit: FETCH_SIZE };
	if (bookmark)
		params.bookmark = bookmark;
	const { data } = await api.get("/pinterest", { params });
	return data;
}

async function toStream(url) {
	const res = await axios.get(url, {
		responseType: "stream",
		timeout: TIMEOUT,
		headers: { "User-Agent": IMAGE_UA }
	});
	return res.data;
}

function pickImage(item) {
	return item.image || item.thumbnail;
}

async function buildAttachments(results) {
	const settled = await Promise.allSettled(
		results.map(item => toStream(pickImage(item)))
	);
	return settled
		.filter(entry => entry.status === "fulfilled" && entry.value)
		.map(entry => entry.value);
}

function buildBody(results, hasMore, withImageLinks) {
	const footer = hasMore
		? 'Reply "n" for the next page, or a page number to jump.'
		: "That is the last page.";

	if (!withImageLinks)
		return footer;

	const links = results.map(pickImage).join("\n");
	return `${links}\n\n${footer}`;
}

function remember(messageID, data) {
	global.GoatBot.onReply.set(messageID, data);
	global.GoatBot.onReaction.set(messageID, data);
}

async function sendPage({ message, commandName, author, query, limit, page, bookmarks, previous }) {
	const data = await fetchPins(query, bookmarks[page - 1]);
	const pins = (data.results || []).filter(item => pickImage(item)).slice(0, limit);

	if (!pins.length) {
		return message.reply(page === 1
			? `No results for "${query}".`
			: `Page ${page} has no results.`);
	}

	const nextBookmarks = bookmarks.slice();
	const hasMore = Boolean(data.has_more && data.bookmark);
	if (hasMore)
		nextBookmarks[page] = data.bookmark;

	const attachments = await buildAttachments(pins);
	const form = { body: buildBody(pins, hasMore, !attachments.length) };
	if (attachments.length)
		form.attachment = attachments;

	await message.reply(form, (err, info) => {
		if (err)
			return message.err(err);
		if (previous && previous.messageID && previous.messageID !== info.messageID)
			message.unsend(previous.messageID);
		remember(info.messageID, {
			commandName,
			messageID: info.messageID,
			author,
			query,
			limit,
			page,
			bookmarks: nextBookmarks,
			hasMore
		});
	});
}

async function goToPage({ message, commandName, state, page, reactTarget }) {
	await message.reaction("⏳", reactTarget);

	try {
		await sendPage({
			message,
			commandName,
			author: state.author,
			query: state.query,
			limit: state.limit,
			page,
			bookmarks: state.bookmarks,
			previous: state
		});
		await message.reaction("✅", reactTarget);
	}
	catch (err) {
		console.error("[pinterest] page failed:", errMsg(err));
		await message.reaction("❌", reactTarget);
		message.reply(`Search failed: ${errMsg(err)}`);
	}
}
