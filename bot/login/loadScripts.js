const { readdirSync, readFileSync, writeFileSync, existsSync } = require("fs-extra");
const path = require("path");
const exec = (cmd, options) => new Promise((resolve, reject) => {
	require("child_process").exec(cmd, options, (err, stdout) => {
		if (err) return reject(err);
		resolve(stdout);
	});
});
const { log, loading, getText, colors, removeHomeDir } = global.utils;
const { GoatBot } = global;
const { configCommands } = GoatBot;
const regExpCheckPackage = /require(\s+|)\((\s+|)[`'"]([^`'"]+)[`'"](\s+|)\)/g;
const packageAlready = [];

const hackerLog = () => {
	console.log("[+] Loading commands...");
	console.log("[+] Loading events...");
	console.log("[✓] All modules loaded successfully.");
	console.log("> System ready...");
};

module.exports = async function (api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, createLine) {

	hackerLog(); // simple hacker-style output

	const aliasesData = await globalData.get('setalias', 'data', []);
	if (aliasesData) {
		for (const data of aliasesData) {
			const { aliases, commandName } = data;
			for (const alias of aliases)
				if (GoatBot.aliases.has(alias))
					throw new Error(`Alias "${alias}" already exists in command "${commandName}"`);
				else
					GoatBot.aliases.set(alias, commandName);
		}
	}

	const folders = ["cmds", "events"];
	let text, setMap, typeEnvCommand;

	for (const folderModules of folders) {
		if (folderModules == "cmds") {
			text = "command";
			typeEnvCommand = "envCommands";
			setMap = "commands";
		}
		else {
			text = "event command";
			typeEnvCommand = "envEvents";
			setMap = "eventCommands";
		}

		const fullPathModules = path.normalize(process.cwd() + `/scripts/${folderModules}`);
		const Files = readdirSync(fullPathModules)
			.filter(file =>
				file.endsWith(".js") &&
				!file.endsWith("eg.js") &&
				(process.env.NODE_ENV == "development" ? true : !file.match(/(dev)\.js$/g)) &&
				!configCommands[folderModules == "cmds" ? "commandUnload" : "commandEventUnload"]?.includes(file)
			);

		const commandError = [];
		let commandLoadSuccess = 0;

		for (const file of Files) {
			const pathCommand = path.normalize(fullPathModules + "/" + file);

			try {
				const contentFile = readFileSync(pathCommand, "utf8");
				let allPackage = contentFile.match(regExpCheckPackage);

				if (allPackage) {
					allPackage = allPackage.map(p => p.match(/[`'"]([^`'"]+)[`'"]/)[1])
						.filter(p => p.indexOf("/") !== 0 && p.indexOf("./") !== 0 && p.indexOf("../") !== 0 && p.indexOf(__dirname) !== 0);

					for (let packageName of allPackage) {
						if (packageName.startsWith('@'))
							packageName = packageName.split('/').slice(0, 2).join('/');
						else packageName = packageName.split('/')[0];

						if (!packageAlready.includes(packageName)) {
							packageAlready.push(packageName);

							if (!existsSync(`${process.cwd()}/node_modules/${packageName}`)) {
								console.log(`[+] Installing package: ${packageName}`);
								try {
									await exec(`npm install ${packageName}`);
									console.log(`[✓] Installed: ${packageName}`);
								}
								catch {
									console.log(`[✖] Failed installing ${packageName}`);
									throw new Error(`Can't install package ${packageName}`);
								}
							}
						}
					}
				}

				global.temp.contentScripts[folderModules][file] = contentFile;

				const command = require(pathCommand);
				command.location = pathCommand;

				const configCommand = command.config;
				const commandName = configCommand.name;

				if (!configCommand)
					throw new Error(`config of ${text} undefined`);
				if (!configCommand.category)
					throw new Error(`category of ${text} undefined`);
				if (!commandName)
					throw new Error(`name of ${text} undefined`);
				if (!command.onStart)
					throw new Error(`onStart of ${text} undefined`);

				const { onFirstChat, onChat, onLoad, onEvent, onAnyEvent } = command;
				const { envGlobal, envConfig } = configCommand;
				const { aliases } = configCommand;

				const validAliases = [];
				if (aliases) {
					if (!Array.isArray(aliases))
						throw new Error("The value of \"config.aliases\" must be array!");

					for (const alias of aliases) {
						if (aliases.filter(item => item == alias).length > 1)
							throw new Error(`alias "${alias}" duplicate in ${text} "${commandName}"`);

						if (GoatBot.aliases.has(alias))
							throw new Error(`alias "${alias}" already exists in another command`);

						validAliases.push(alias);
					}

					for (const alias of validAliases)
						GoatBot.aliases.set(alias, commandName);
				}

				if (onLoad)
					await onLoad({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData });

				if (onChat) GoatBot.onChat.push(commandName);
				if (onFirstChat) GoatBot.onFirstChat.push({ commandName, threadIDsChattedFirstTime: [] });
				if (onEvent) GoatBot.onEvent.push(commandName);
				if (onAnyEvent) GoatBot.onAnyEvent.push(commandName);

				GoatBot[setMap].set(commandName.toLowerCase(), command);
				commandLoadSuccess++;

			} catch (error) {
				commandError.push({ name: file, error });
			}
		}

		if (commandError.length > 0) {
			log.err("LOADED", `Error loading some ${text}s`);
			for (const item of commandError)
				console.log(` ✖ ${item.name}: ${item.error.message}`);
		}
	}
};
