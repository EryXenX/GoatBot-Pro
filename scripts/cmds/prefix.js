const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
		category: "config",
		guide: {
			vi: "   {pn} <new prefix>: thay đổi prefix mới trong box chat của bạn"
				+ "\n   Ví dụ:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: thay đổi prefix mới trong hệ thống bot (chỉ admin bot)"
				+ "\n   Ví dụ:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: thay đổi prefix trong box chat của bạn về mặc định",
			en: "   {pn} <new prefix>: change new prefix in your box chat"
				+ "\n   Example:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
				+ "\n   Example:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: change prefix in your box chat to default"
		}
	},

	langs: {
		vi: {
			reset: "Đã reset prefix của bạn về mặc định: %1",
			onlyAdmin: "Chỉ admin mới có thể thay đổi prefix hệ thống bot",
			confirmGlobal: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
			confirmThisThread: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
			successGlobal: "Đã thay đổi prefix hệ thống bot thành: %1",
			successThisThread: "Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
			myPrefix: "🌐 Prefix của hệ thống: %1\n🛸 Prefix của nhóm bạn: %2"
		},
		en: {
			reset: "Your prefix has been reset to default: %1",
			onlyAdmin: "Only admin can change prefix of system bot",
			confirmGlobal: "Please react to this message to confirm change prefix of system bot",
			confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
			successGlobal: "Changed prefix of system bot to: %1",
			successThisThread: "Changed prefix in your box chat to: %1",
			myPrefix: "Hey senpai! ~_~\n🌐 Global prefix: %1\n🛸 Your group chat prefix: %2"
		},
		tl: {
			reset: "Ang iyong prefix ay na-reset sa default: %1",
			onlyAdmin: "Ang admin lamang ang maaaring magbago ng prefix ng system bot",
			confirmGlobal: "Mangyaring mag-react sa mensaheng ito para kumpirmahin ang pagbabago ng prefix ng system bot",
			confirmThisThread: "Mangyaring mag-react sa mensaheng ito para kumpirmahin ang pagbabago ng prefix sa iyong box chat",
			successGlobal: "Binago ang prefix ng system bot sa: %1",
			successThisThread: "Binago ang prefix sa iyong box chat sa: %1",
			myPrefix: "Hey senpai! ~_~\n🌐 Global prefix: %1\n🛸 Prefix ng iyong group chat: %2"
		},
		hi: {
			reset: "Aapka prefix default par reset kar diya gaya: %1",
			onlyAdmin: "Sirf admin hi system bot ka prefix badal sakta hai",
			confirmGlobal: "System bot ka prefix badlne ki pushthi ke liye is message par react karein",
			confirmThisThread: "Aapke box chat mein prefix badlne ki pushthi ke liye is message par react karein",
			successGlobal: "System bot ka prefix badal diya gaya: %1",
			successThisThread: "Aapke box chat ka prefix badal diya gaya: %1",
			myPrefix: "Hey senpai! ~_~\n🌐 Global prefix: %1\n🛸 Aapke group chat ka prefix: %2"
		},
		ar: {
			reset: "تمت إعادة تعيين بادئتك إلى الافتراضي: %1",
			onlyAdmin: "فقط المسؤول يمكنه تغيير بادئة بوت النظام",
			confirmGlobal: "الرجاء التفاعل مع هذه الرسالة لتأكيد تغيير بادئة بوت النظام",
			confirmThisThread: "الرجاء التفاعل مع هذه الرسالة لتأكيد تغيير البادئة في محادثتك",
			successGlobal: "تم تغيير بادئة بوت النظام إلى: %1",
			successThisThread: "تم تغيير البادئة في محادثتك إلى: %1",
			myPrefix: "Hey senpai! ~_~\n🌐 البادئة العامة: %1\n🛸 بادئة مجموعتك: %2"
		},
		bn: {
			reset: "আপনার prefix default এ রিসেট করা হয়েছে: %1",
			onlyAdmin: "শুধুমাত্র admin system bot এর prefix পরিবর্তন করতে পারবে",
			confirmGlobal: "System bot এর prefix পরিবর্তন নিশ্চিত করতে এই message এ react করুন",
			confirmThisThread: "আপনার box chat এ prefix পরিবর্তন নিশ্চিত করতে এই message এ react করুন",
			successGlobal: "System bot এর prefix পরিবর্তন হয়েছে: %1",
			successThisThread: "আপনার box chat এর prefix পরিবর্তন হয়েছে: %1",
			myPrefix: "Hey senpai! ~_~\n🌐 Global prefix: %1\n🛸 আপনার group chat prefix: %2"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g")
			if (role < 2)
				return message.reply(getLang("onlyAdmin"));
			else
				formSet.setGlobal = true;
		else
			formSet.setGlobal = false;

		return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author)
			return;
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix")
			return () => {
				return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
			};
	}
};
