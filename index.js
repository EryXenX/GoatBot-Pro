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

function startProject() {
	// No `shell: true`: passing an args array through a shell is deprecated
	// (DEP0190) and the arguments would not be escaped.
	const child = spawn(process.execPath, ["EryXenX.js"], {
		cwd: __dirname,
		stdio: "inherit"
	});

	child.on("close", (code) => {
		if (code == 2) {
			log.info("Restarting Project...");
			startProject();
		}
	});
}

startProject();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

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
