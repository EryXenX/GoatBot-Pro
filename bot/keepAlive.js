/**
 * Free hosts such as Render spin a web service down after ~15 minutes without
 * inbound traffic. A request that never leaves the container (for example to
 * localhost) does not reset that timer, so this module pings the service's own
 * public URL on a schedule to keep it awake.
 *
 * The public URL is taken from config.keepAlive.url, or from Render's
 * RENDER_EXTERNAL_URL / RENDER_EXTERNAL_HOSTNAME. When neither is available the
 * module stays idle, so it is safe to leave enabled on a VPS.
 */

const http = require("http");
const https = require("https");

const DEFAULT_INTERVAL_MINUTES = 10;
const PING_TIMEOUT_MS = 30000;

function resolveTargetUrl(config = {}) {
	const explicit = typeof config.url === "string" ? config.url.trim() : "";
	if (explicit)
		return explicit;
	if (process.env.RENDER_EXTERNAL_URL)
		return process.env.RENDER_EXTERNAL_URL;
	if (process.env.RENDER_EXTERNAL_HOSTNAME)
		return `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
	return "";
}

function buildUrl(base, path) {
	const trimmed = base.replace(/\/+$/, "");
	const suffix = path ? `/${String(path).replace(/^\/+/, "")}` : "";
	return `${trimmed}${suffix}`;
}

function ping(url, log) {
	return new Promise((resolve) => {
		let parsed;
		try {
			parsed = new URL(url);
		}
		catch (err) {
			log.err("KEEP ALIVE", `Invalid keep-alive URL "${url}"`, err);
			resolve(false);
			return;
		}
		const client = parsed.protocol === "http:" ? http : https;
		const request = client.get(url, { timeout: PING_TIMEOUT_MS }, (res) => {
			res.resume(); // body is irrelevant, drain it so the socket can close
			resolve(res.statusCode >= 200 && res.statusCode < 400);
		});
		request.on("timeout", () => request.destroy(new Error("timeout")));
		request.on("error", (err) => {
			log.warn("KEEP ALIVE", `Ping failed: ${err.message}`);
			resolve(false);
		});
	});
}

function start(config, log) {
	const target = resolveTargetUrl(config);
	if (!target) {
		log.info("KEEP ALIVE", "No public URL (set config.keepAlive.url or RENDER_EXTERNAL_URL) — skipping");
		return null;
	}

	const intervalMinutes = Number(config.interval) > 0 ? Number(config.interval) : DEFAULT_INTERVAL_MINUTES;
	const url = buildUrl(target, config.path || "/health");

	log.info("KEEP ALIVE", `Pinging ${url} every ${intervalMinutes} minute(s) to prevent spin-down`);

	let running = false;
	const tick = async () => {
		if (running)
			return;
		running = true;
		try {
			await ping(url, log);
		}
		finally {
			running = false;
		}
	};

	const timer = setInterval(tick, intervalMinutes * 60 * 1000);
	if (timer.unref)
		timer.unref();
	tick();
	return timer;
}

module.exports = { start, resolveTargetUrl };
