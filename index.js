/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 * ! If you do not download the source code from the above address, you are using an unknown version and at risk of having your account hacked
 *
 * English:
 * ! Please do not change the below code, it is very important for the project.
 * It is my motivation to maintain and develop the project for free.
 * ! If you change it, you will be banned forever
 * Thank you for using
 *
 * Vietnamese:
 * ! Vui lòng không thay đổi mã bên dưới, nó rất quan trọng đối với dự án.
 * Nó là động lực để tôi duy trì và phát triển dự án miễn phí.
 * ! Nếu thay đổi nó, bạn sẽ bị cấm vĩnh viễn
 * Cảm ơn bạn đã sử dụng
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");

// Exit code 2 means "restart me" (listen error / session problem). Blindly
// restarting on every such exit is what turns a temporary Facebook block into a
// suspension: each restart re-authenticates from the same IP, and the
// failed-auth burst raises the account risk score. Back off exponentially and
// stop restarting after too many attempts in a short window so the operator can
// fix the appstate by hand.
const RESTART_WINDOW_MS = 10 * 60 * 1000;
const MAX_RESTARTS_PER_WINDOW = 5;
const BASE_BACKOFF_MS = 5000;
const MAX_BACKOFF_MS = 5 * 60 * 1000;
let restartTimes = [];

function startProject() {
	// No `shell: true`: passing an args array through a shell is deprecated
	// (DEP0190) and the arguments would not be escaped.
	const child = spawn(process.execPath, ["EryXenX.js"], {
		cwd: __dirname,
		stdio: "inherit"
	});

	child.on("close", (code) => {
		if (code != 2) return;

		const now = Date.now();
		restartTimes = restartTimes.filter(t => now - t < RESTART_WINDOW_MS);

		if (restartTimes.length >= MAX_RESTARTS_PER_WINDOW) {
			log.err(
				"RESTART",
				`Refusing to restart: ${restartTimes.length} restarts in the last ` +
				`${RESTART_WINDOW_MS / 60000} min. Facebook is likely blocking this ` +
				`session — update account.txt with fresh cookies, then start the bot again.`
			);
			return;
		}

		const backoff = Math.min(BASE_BACKOFF_MS * Math.pow(2, restartTimes.length), MAX_BACKOFF_MS);
		restartTimes.push(now);
		log.info("RESTART", `Restarting Project... (attempt ${restartTimes.length}, waiting ${Math.round(backoff / 1000)}s)`);
		setTimeout(startProject, backoff);
	});
}

startProject();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

// Lightweight liveness endpoint. Keep-alive pings and uptime monitors should
// hit this instead of '/' so they stay cheap and never touch the bot state.
const healthPayload = (req, res) => res.status(200).json({
  status: "ok",
  uptime: process.uptime(),
  timestamp: Date.now()
});
app.get('/health', healthPayload);
app.get('/uptime', healthPayload);

const PORT = process.env.PORT || 3000;
const uptimeServer = app.listen(PORT, '0.0.0.0', () => {
  log.info("UPTIME", `Uptime server running on port ${PORT}`);
});
// A busy port is not fatal: the bot itself does not need this keep-alive
// endpoint, so report it once instead of crashing the process.
uptimeServer.on("error", (err) => {
  if (err.code === "EADDRINUSE")
    log.warn("UPTIME", `Port ${PORT} is already in use — uptime server disabled`);
  else
    log.err("UPTIME", "Uptime server error", err);
});

// Built-in keep-alive: prevents free hosts (Render) from spinning the service
// down. Runs in this parent process so it survives child restarts.
try {
  const configDir = ["production", "development"].includes(process.env.NODE_ENV)
    ? "./config.dev.json"
    : "./config.json";
  const keepAlive = require("./bot/keepAlive.js");
  const keepAliveConfig = { ...require(configDir).keepAlive };
  if (keepAliveConfig.enable !== false) {
    // Wait for the HTTP server to accept connections before the first ping.
    uptimeServer.on("listening", () => keepAlive.start(keepAliveConfig, log));
  }
}
catch (err) {
  log.err("KEEP ALIVE", "Could not start keep-alive", err);
}
