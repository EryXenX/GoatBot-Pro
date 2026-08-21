module.exports = {
	config: {
		name: "setalias",
		version: "1.8",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Thêm tên gọi khác cho 1 lệnh bất kỳ trong nhóm của bạn",
			en: "Add an alias for any command in your group"
		},
		category: "config",
		guide: {
			vi: "  Lệnh dùng để thêm/xóa tên gọi khác cho 1 lệnh nào đó để tiện sử dụng trong nhóm chat của bạn"
				+ "\n   {pn} add <tên gọi khác> <tên lệnh>: dùng để thêm tên gọi khác cho lệnh trong nhóm chat của bạn"
				+ "\n   {pn} add <tên gọi khác> <tên lệnh> -g: dùng để thêm tên gọi khác cho lệnh trong toàn hệ thống (chỉ admin bot)"
				+ "\nVí dụ:\n    {pn} add ctrk customrankcard"
				+ "\n\n   {pn} [remove | rm] <tên gọi khác> <tên lệnh>: dùng để xóa tên gọi khác của lệnh trong nhóm chat của bạn"
				+ "\n   {pn} [remove | rm] <tên gọi khác> <tên lệnh> -g: dùng để xóa tên gọi khác của lệnh trong toàn hệ thống (chỉ admin bot)"
				+ "\nVí dụ:\n    {pn} rm ctrk customrankcard"
				+ "\n\n   {pn} list: dùng để xem danh sách tên gọi khác của các lệnh trong nhóm bạn"
				+ "\n   {pn} list -g: dùng để xem danh sách tên gọi khác của các lệnh trong nhóm bạn",
			en: "  This command is used to add/remove alias for any command in your group"
				+ "\n   {pn} add <alias> <command>: add an alias for the command in your group"
				+ "\n   {pn} add <alias> <command> -g: add an alias for the command in the whole system (only bot admin)"
				+ "\nExample:\n    {pn} add ctrk customrankcard"
				+ "\n\n   {pn} [remove | rm] <alias> <command>: remove an alias for the command in your group"
				+ "\n   {pn} [remove | rm] <alias> <command> -g: remove an alias for the command in the whole system (only bot admin)"
				+ "\nExample:\n    {pn} rm ctrk customrankcard"
				+ "\n\n   {pn} list: list all alias for commands in your group"
				+ "\n   {pn} list -g: list all alias for commands in the whole system"
		}
	},

	langs: {
		vi: {
			commandNotExist: "❌ Lệnh \"%1\" không tồn tại",
			aliasExist: "❌ Tên gọi \"%1\" đã tồn tại cho lệnh \"%2\" trong hệ thống",
			addAliasSuccess: "✅ Đã thêm tên gọi \"%1\" cho lệnh \"%2\" trong hệ thống",
			noPermissionAdd: "❌ Bạn không có quyền thêm tên gọi \"%1\" cho lệnh \"%2\" trong hệ thống",
			aliasIsCommand: "❌ Tên gọi \"%1\" trùng với tên lệnh khác trong hệ thống bot",
			aliasExistInGroup: "❌ Tên gọi \"%1\" đã tồn tại cho lệnh \"%2\" trong nhóm này",
			addAliasToGroupSuccess: "✅ Đã thêm tên gọi \"%1\" cho lệnh \"%2\" trong nhóm chat của bạn",
			aliasNotExist: "❌ Tên gọi \"%1\" không tồn tại trong lệnh \"%2\"",
			removeAliasSuccess: "✅ Đã xóa tên gọi \"%1\" cho lệnh \"%2\" trong hệ thống",
			noPermissionDelete: "❌ Bạn không có quyền xóa tên gọi \"%1\" cho lệnh \"%2\" trong hệ thống",
			noAliasInGroup: "❌ Lệnh \"%1\" không có tên gọi khác nào trong nhóm của bạn",
			removeAliasInGroupSuccess: "✅ Đã xóa tên gọi \"%1\" khỏi lệnh \"%2\" trong nhóm chat của bạn",
			aliasList: "📜 Danh sách tên gọi khác của các lệnh trong hệ thống:\n%1",
			noAliasInSystem: "⚠️ Hiện tại không có tên gọi nào trong hệ thống",
			notExistAliasInGroup: "⚠️ Nhóm bạn chưa cài đặt tên gọi khác cho lệnh nào cả",
			aliasListInGroup: "📜 Danh sách tên gọi khác của các lệnh trong nhóm chat của bạn:\n%1"
		},
		en: {
			commandNotExist: "❌ Command \"%1\" does not exist",
			aliasExist: "❌ Alias \"%1\" already exists for command \"%2\" in the system",
			addAliasSuccess: "✅ Added alias \"%1\" for command \"%2\" in the system",
			noPermissionAdd: "❌ You do not have permission to add alias \"%1\" for command \"%2\" in the system",
			aliasIsCommand: "❌ Alias \"%1\" is the same as another command in the system",
			aliasExistInGroup: "❌ Alias \"%1\" already exists for command \"%2\" in this group",
			addAliasToGroupSuccess: "✅ Added alias \"%1\" for command \"%2\" in your group chat",
			aliasNotExist: "❌ Alias \"%1\" does not exist for command \"%2\"",
			removeAliasSuccess: "✅ Removed alias \"%1\" for command \"%2\" in the system",
			noPermissionDelete: "❌ You do not have permission to remove alias \"%1\" for command \"%2\" in the system",
			noAliasInGroup: "❌ Command \"%1\" does not have any other alias in your group",
			removeAliasInGroupSuccess: "✅ Removed alias \"%1\" for command \"%2\" in your group chat",
			aliasList: "📜 List of other aliases for commands in the system:\n%1",
			noAliasInSystem: "⚠️ There are no aliases in the system",
			notExistAliasInGroup: "⚠️ Your group has not set any other aliases for commands",
			aliasListInGroup: "📜 List of other aliases for commands in your group chat:\n%1"
		},
		tl: {
			commandNotExist: "❌ Ang command na \"%1\" ay hindi umiiral",
			aliasExist: "❌ Ang alias na \"%1\" ay mayroon na para sa command na \"%2\" sa sistema",
			addAliasSuccess: "✅ Naidagdag ang alias na \"%1\" para sa command na \"%2\" sa sistema",
			noPermissionAdd: "❌ Wala kang pahintulot na magdagdag ng alias na \"%1\" para sa command na \"%2\" sa sistema",
			aliasIsCommand: "❌ Ang alias na \"%1\" ay katulad ng isa pang command sa sistema",
			aliasExistInGroup: "❌ Ang alias na \"%1\" ay mayroon na para sa command na \"%2\" sa grupong ito",
			addAliasToGroupSuccess: "✅ Naidagdag ang alias na \"%1\" para sa command na \"%2\" sa iyong group chat",
			aliasNotExist: "❌ Ang alias na \"%1\" ay hindi umiiral para sa command na \"%2\"",
			removeAliasSuccess: "✅ Naalis ang alias na \"%1\" para sa command na \"%2\" sa sistema",
			noPermissionDelete: "❌ Wala kang pahintulot na alisin ang alias na \"%1\" para sa command na \"%2\" sa sistema",
			noAliasInGroup: "❌ Ang command na \"%1\" ay walang ibang alias sa iyong grupo",
			removeAliasInGroupSuccess: "✅ Naalis ang alias na \"%1\" para sa command na \"%2\" sa iyong group chat",
			aliasList: "📜 Listahan ng iba pang aliases para sa mga command sa sistema:\n%1",
			noAliasInSystem: "⚠️ Walang aliases sa sistema",
			notExistAliasInGroup: "⚠️ Ang iyong grupo ay walang nakatakdang aliases para sa mga command",
			aliasListInGroup: "📜 Listahan ng iba pang aliases para sa mga command sa iyong group chat:\n%1"
		},
		hi: {
			commandNotExist: "❌ Command \"%1\" exist nahi karta",
			aliasExist: "❌ Alias \"%1\" command \"%2\" ke liye system mein pehle se exist karta hai",
			addAliasSuccess: "✅ System mein command \"%2\" ke liye alias \"%1\" add kar diya gaya",
			noPermissionAdd: "❌ Aapko system mein command \"%2\" ke liye alias \"%1\" add karne ki permission nahi hai",
			aliasIsCommand: "❌ Alias \"%1\" system mein kisi aur command se same hai",
			aliasExistInGroup: "❌ Is group mein command \"%2\" ke liye alias \"%1\" pehle se exist karta hai",
			addAliasToGroupSuccess: "✅ Aapke group chat mein command \"%2\" ke liye alias \"%1\" add kar diya gaya",
			aliasNotExist: "❌ Command \"%2\" ke liye alias \"%1\" exist nahi karta",
			removeAliasSuccess: "✅ System mein command \"%2\" ke liye alias \"%1\" hata diya gaya",
			noPermissionDelete: "❌ Aapko system mein command \"%2\" ke liye alias \"%1\" hatane ki permission nahi hai",
			noAliasInGroup: "❌ Aapke group mein command \"%1\" ka koi aur alias nahi hai",
			removeAliasInGroupSuccess: "✅ Aapke group chat mein command \"%2\" ke liye alias \"%1\" hata diya gaya",
			aliasList: "📜 System mein commands ke liye aliases ki list:\n%1",
			noAliasInSystem: "⚠️ System mein koi alias nahi hai",
			notExistAliasInGroup: "⚠️ Aapke group ne commands ke liye koi alias set nahi kiya hai",
			aliasListInGroup: "📜 Aapke group chat mein commands ke liye aliases ki list:\n%1"
		},
		ar: {
			commandNotExist: "❌ الأمر \"%1\" غير موجود",
			aliasExist: "❌ الاسم المستعار \"%1\" موجود بالفعل للأمر \"%2\" في النظام",
			addAliasSuccess: "✅ تمت إضافة الاسم المستعار \"%1\" للأمر \"%2\" في النظام",
			noPermissionAdd: "❌ ليس لديك إذن لإضافة الاسم المستعار \"%1\" للأمر \"%2\" في النظام",
			aliasIsCommand: "❌ الاسم المستعار \"%1\" مطابق لأمر آخر في النظام",
			aliasExistInGroup: "❌ الاسم المستعار \"%1\" موجود بالفعل للأمر \"%2\" في هذه المجموعة",
			addAliasToGroupSuccess: "✅ تمت إضافة الاسم المستعار \"%1\" للأمر \"%2\" في مجموعتك",
			aliasNotExist: "❌ الاسم المستعار \"%1\" غير موجود للأمر \"%2\"",
			removeAliasSuccess: "✅ تمت إزالة الاسم المستعار \"%1\" للأمر \"%2\" من النظام",
			noPermissionDelete: "❌ ليس لديك إذن لإزالة الاسم المستعار \"%1\" للأمر \"%2\" من النظام",
			noAliasInGroup: "❌ الأمر \"%1\" ليس له أسماء مستعارة أخرى في مجموعتك",
			removeAliasInGroupSuccess: "✅ تمت إزالة الاسم المستعار \"%1\" للأمر \"%2\" من مجموعتك",
			aliasList: "📜 قائمة الأسماء المستعارة للأوامر في النظام:\n%1",
			noAliasInSystem: "⚠️ لا توجد أسماء مستعارة في النظام",
			notExistAliasInGroup: "⚠️ مجموعتك لم تضع أسماء مستعارة للأوامر",
			aliasListInGroup: "📜 قائمة الأسماء المستعارة للأوامر في مجموعتك:\n%1"
		},
		bn: {
			commandNotExist: "❌ Command \"%1\" বিদ্যমান নেই",
			aliasExist: "❌ System এ command \"%2\" এর জন্য alias \"%1\" আগে থেকেই আছে",
			addAliasSuccess: "✅ System এ command \"%2\" এর জন্য alias \"%1\" যোগ করা হয়েছে",
			noPermissionAdd: "❌ System এ command \"%2\" এর জন্য alias \"%1\" যোগ করার permission নেই",
			aliasIsCommand: "❌ Alias \"%1\" system এর অন্য একটি command এর মতোই",
			aliasExistInGroup: "❌ এই group এ command \"%2\" এর জন্য alias \"%1\" আগে থেকেই আছে",
			addAliasToGroupSuccess: "✅ আপনার group chat এ command \"%2\" এর জন্য alias \"%1\" যোগ করা হয়েছে",
			aliasNotExist: "❌ Command \"%2\" এর জন্য alias \"%1\" বিদ্যমান নেই",
			removeAliasSuccess: "✅ System থেকে command \"%2\" এর alias \"%1\" সরানো হয়েছে",
			noPermissionDelete: "❌ System থেকে command \"%2\" এর alias \"%1\" সরানোর permission নেই",
			noAliasInGroup: "❌ আপনার group এ command \"%1\" এর কোনো অন্য alias নেই",
			removeAliasInGroupSuccess: "✅ আপনার group chat থেকে command \"%2\" এর alias \"%1\" সরানো হয়েছে",
			aliasList: "📜 System এ commands এর aliases এর তালিকা:\n%1",
			noAliasInSystem: "⚠️ System এ কোনো alias নেই",
			notExistAliasInGroup: "⚠️ আপনার group commands এর জন্য কোনো alias সেট করেনি",
			aliasListInGroup: "📜 আপনার group chat এ commands এর aliases এর তালিকা:\n%1"
		}
	},

	onStart: async function ({ message, event, args, threadsData, globalData, role, getLang }) {
		const aliasesData = await threadsData.get(event.threadID, "data.aliases", {});

		switch (args[0]) {
			case "add": {
				if (!args[2])
					return message.SyntaxError();
				const commandName = args[2].toLowerCase();
				if (!global.GoatBot.commands.has(commandName))
					return message.reply(getLang("commandNotExist", commandName));
				const alias = args[1].toLowerCase();

				if (args[3] == '-g') {
					if (role > 1) {
						const globalAliasesData = await globalData.get('setalias', 'data', []);
						const globalAliasesExist = globalAliasesData.find(item => item.aliases.includes(alias));
						if (globalAliasesExist)
							return message.reply(getLang("aliasExist", alias, globalAliasesExist.commandName));
						if (global.GoatBot.aliases.has(alias))
							return message.reply(getLang("aliasExist", alias, global.GoatBot.aliases.get(alias)));
						const globalAliasesThisCommand = globalAliasesData.find(aliasData => aliasData.commandName == commandName);
						if (globalAliasesThisCommand)
							globalAliasesThisCommand.aliases.push(alias);
						else
							globalAliasesData.push({
								commandName,
								aliases: [alias]
							});
						await globalData.set('setalias', globalAliasesData, 'data');
						global.GoatBot.aliases.set(alias, commandName);
						return message.reply(getLang("addAliasSuccess", alias, commandName));
					}
					else {
						return message.reply(getLang("noPermissionAdd", alias, commandName));
					}
				}

				if (global.GoatBot.commands.get(alias))
					return message.reply(getLang("aliasIsCommand", alias));
				if (global.GoatBot.aliases.has(alias))
					return message.reply(getLang("aliasExist", alias, global.GoatBot.aliases.get(alias)));
				for (const cmdName in aliasesData)
					if (aliasesData[cmdName].includes(alias))
						return message.reply(getLang("aliasExistInGroup", alias, cmdName));

				const oldAlias = aliasesData[commandName] || [];
				oldAlias.push(alias);
				aliasesData[commandName] = oldAlias;
				await threadsData.set(event.threadID, aliasesData, "data.aliases");
				return message.reply(getLang("addAliasToGroupSuccess", alias, commandName));
			}
			case "remove":
			case "rm": {
				if (!args[2])
					return message.SyntaxError();
				const commandName = args[2].toLowerCase();
				const alias = args[1].toLowerCase();

				if (!global.GoatBot.commands.has(commandName))
					return message.reply(getLang("commandNotExist", commandName));

				if (args[3] == '-g') {
					if (role > 1) {
						const globalAliasesData = await globalData.get('setalias', 'data', []);
						const globalAliasesThisCommand = globalAliasesData.find(aliasData => aliasData.commandName == commandName);
						if (!globalAliasesThisCommand || !globalAliasesThisCommand.aliases.includes(alias))
							return message.reply(getLang("aliasNotExist", alias, commandName));
						globalAliasesThisCommand.aliases.splice(globalAliasesThisCommand.aliases.indexOf(alias), 1);
						await globalData.set('setalias', globalAliasesData, 'data');
						global.GoatBot.aliases.delete(alias);
						return message.reply(getLang("removeAliasSuccess", alias, commandName));
					}
					else {
						return message.reply(getLang("noPermissionDelete", alias, commandName));
					}
				}

				const oldAlias = aliasesData[commandName];
				if (!oldAlias)
					return message.reply(getLang("noAliasInGroup", commandName));
				const index = oldAlias.indexOf(alias);
				if (index === -1)
					return message.reply(getLang("aliasNotExist", alias, commandName));
				oldAlias.splice(index, 1);
				await threadsData.set(event.threadID, aliasesData, "data.aliases");
				return message.reply(getLang("removeAliasInGroupSuccess", alias, commandName));
			}
			case "list": {
				if (args[1] == '-g') {
					const globalAliasesData = await globalData.get('setalias', 'data', []);
					const globalAliases = globalAliasesData.map(aliasData => ({
						commandName: aliasData.commandName,
						aliases: aliasData.aliases.join(', ')
					}));
					return message.reply(
						globalAliases.length ?
							getLang("aliasList", globalAliases.map(alias => `• ${alias.commandName}: ${alias.aliases}`).join('\n')) :
							getLang("noAliasInSystem")
					);
				}

				if (!Object.keys(aliasesData).length)
					return message.reply(getLang("notExistAliasInGroup"));
				const list = Object.keys(aliasesData).map(commandName => `\n• ${commandName}: ${aliasesData[commandName].join(", ")} `);
				return message.reply(getLang("aliasListInGroup", list.join("\n")));
			}
			default: {
				return message.SyntaxError();
			}
		}
	}
};