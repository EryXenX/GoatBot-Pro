const moment = require("moment-timezone");

const TZ = (() => {
	try { return require("../config.json").timeZone || "Asia/Dhaka"; }
	catch { return "Asia/Dhaka"; }
})();

const esc = (code, s) => `\x1b[${code}m${s}\x1b[0m`;
const dim = s => esc("90", s);
const bold = s => esc("1", s);
const TAG_WIDTH = 16;

// white text on a colored background, fixed width so every line lines up
const badge = (label, bg) => `\x1b[1;97;${bg}m ${label.padEnd(5)} \x1b[0m`;
const BADGES = {
	info: badge("INFO", 44),
	success: badge("OK", 42),
	warn: badge("WARN", 43),
	error: badge("ERROR", 41),
	master: badge("BOT", 45)
};

const time = () => dim(moment().tz(TZ).format("HH:mm:ss"));

function print(kind, tagColor, prefix, message, extra = []) {
	const tag = esc(tagColor, bold(String(prefix).padEnd(TAG_WIDTH)));
	const head = `${time()} ${BADGES[kind]} ${tag}${dim("│")}`;
	console.log(head, message);
	for (let item of extra) {
		if (typeof item == "object" && item && !item.stack)
			item = JSON.stringify(item, null, 2);
		console.log(head, item);
	}
}

function make(kind, color, defaultPrefix) {
	return function (prefix, message, ...extra) {
		if (message === undefined) {
			message = prefix;
			prefix = defaultPrefix;
		}
		print(kind, color, prefix, message, extra);
	};
}

const info = make("info", "96", "INFO");
const warn = make("warn", "93", "WARN");
const error = make("error", "91", "ERROR");
const success = make("success", "92", "SUCCESS");
const master = make("master", "95", "MASTER");

module.exports = {
	err: error,
	error,
	warn,
	info,
	success,
	succes: success,
	master,
	dev: (...args) => {
		if (["development", "production"].includes(process.env.NODE_ENV) == false)
			return;
		try {
			throw new Error();
		}
		catch (err) {
			const at = err.stack.split('\n')[2];
			let position = at.slice(at.indexOf(process.cwd()) + process.cwd().length + 1);
			position.endsWith(')') ? position = position.slice(0, -1) : null;
			console.log(`\x1b[36m${position} =>\x1b[0m`, ...args);
		}
	}
};
