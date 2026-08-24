module.exports = {
	config: {
		name: "refresh",
		version: "1.2",
		author: "NTKhang",
		countDown: 60,
		role: 0,
		description: {
			vi: "làm mới thông tin nhóm chat hoặc người dùng",
			en: "refresh information of group chat or user"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} [thread | group]: làm mới thông tin nhóm chat của bạn"
				+ "\n   {pn} group <threadID>: làm mới thông tin nhóm chat theo ID"
				+ "\n\n   {pn} user: làm mới thông tin người dùng của bạn"
				+ "\n   {pn} user [<userID> | @tag]: làm mới thông tin người dùng theo ID",
			en: "   {pn} [thread | group]: refresh information of your group chat"
				+ "\n   {pn} group <threadID>: refresh information of group chat by ID"
				+ "\n\n   {pn} user: refresh information of your user"
				+ "\n   {pn} user [<userID> | @tag]: refresh information of user by ID"
		}
	},

	langs: {
		vi: {
			refreshMyThreadSuccess: "✅ | Đã làm mới thông tin nhóm chat của bạn thành công!",
			refreshThreadTargetSuccess: "✅ | Đã làm mới thông tin nhóm chat %1 thành công!",
			errorRefreshMyThread: "❌ | Đã xảy ra lỗi không thể làm mới thông tin nhóm chat của bạn",
			errorRefreshThreadTarget: "❌ | Đã xảy ra lỗi không thể làm mới thông tin nhóm chat %1",
			refreshMyUserSuccess: "✅ | Đã làm mới thông tin người dùng của bạn thành công!",
			refreshUserTargetSuccess: "✅ | Đã làm mới thông tin người dùng %1 thành công!",
			errorRefreshMyUser: "❌ | Đã xảy ra lỗi không thể làm mới thông tin người dùng của bạn",
			errorRefreshUserTarget: "❌ | Đã xảy ra lỗi không thể làm mới thông tin người dùng %1"
		},
		en: {
			refreshMyThreadSuccess: "✅ | Refresh information of your group chat successfully!",
			refreshThreadTargetSuccess: "✅ | Refresh information of group chat %1 successfully!",
			errorRefreshMyThread: "❌ | Error when refresh information of your group chat",
			errorRefreshThreadTarget: "❌ | Error when refresh information of group chat %1",
			refreshMyUserSuccess: "✅ | Refresh information of your user successfully!",
			refreshUserTargetSuccess: "✅ | Refresh information of user %1 successfully!",
			errorRefreshMyUser: "❌ | Error when refresh information of your user",
			errorRefreshUserTarget: "❌ | Error when refresh information of user %1"
		},
		tl: {
			refreshMyThreadSuccess: "✅ | Matagumpay na na-refresh ang impormasyon ng iyong group chat!",
			refreshThreadTargetSuccess: "✅ | Matagumpay na na-refresh ang impormasyon ng group chat %1!",
			errorRefreshMyThread: "❌ | Error habang nire-refresh ang impormasyon ng iyong group chat",
			errorRefreshThreadTarget: "❌ | Error habang nire-refresh ang impormasyon ng group chat %1",
			refreshMyUserSuccess: "✅ | Matagumpay na na-refresh ang iyong impormasyon ng user!",
			refreshUserTargetSuccess: "✅ | Matagumpay na na-refresh ang impormasyon ng user %1!",
			errorRefreshMyUser: "❌ | Error habang nire-refresh ang iyong impormasyon ng user",
			errorRefreshUserTarget: "❌ | Error habang nire-refresh ang impormasyon ng user %1"
		},
		hi: {
			refreshMyThreadSuccess: "✅ | Aapke group chat ki jankari successfully refresh ho gayi!",
			refreshThreadTargetSuccess: "✅ | Group chat %1 ki jankari successfully refresh ho gayi!",
			errorRefreshMyThread: "❌ | Aapke group chat ki jankari refresh karne mein error aaya",
			errorRefreshThreadTarget: "❌ | Group chat %1 ki jankari refresh karne mein error aaya",
			refreshMyUserSuccess: "✅ | Aapki user jankari successfully refresh ho gayi!",
			refreshUserTargetSuccess: "✅ | User %1 ki jankari successfully refresh ho gayi!",
			errorRefreshMyUser: "❌ | Aapki user jankari refresh karne mein error aaya",
			errorRefreshUserTarget: "❌ | User %1 ki jankari refresh karne mein error aaya"
		},
		ar: {
			refreshMyThreadSuccess: "✅ | تم تحديث معلومات مجموعتك بنجاح!",
			refreshThreadTargetSuccess: "✅ | تم تحديث معلومات المجموعة %1 بنجاح!",
			errorRefreshMyThread: "❌ | خطأ أثناء تحديث معلومات مجموعتك",
			errorRefreshThreadTarget: "❌ | خطأ أثناء تحديث معلومات المجموعة %1",
			refreshMyUserSuccess: "✅ | تم تحديث معلومات مستخدمك بنجاح!",
			refreshUserTargetSuccess: "✅ | تم تحديث معلومات المستخدم %1 بنجاح!",
			errorRefreshMyUser: "❌ | خطأ أثناء تحديث معلومات مستخدمك",
			errorRefreshUserTarget: "❌ | خطأ أثناء تحديث معلومات المستخدم %1"
		},
		bn: {
			refreshMyThreadSuccess: "✅ | আপনার group chat এর তথ্য সফলভাবে refresh হয়েছে!",
			refreshThreadTargetSuccess: "✅ | Group chat %1 এর তথ্য সফলভাবে refresh হয়েছে!",
			errorRefreshMyThread: "❌ | আপনার group chat এর তথ্য refresh করতে error হয়েছে",
			errorRefreshThreadTarget: "❌ | Group chat %1 এর তথ্য refresh করতে error হয়েছে",
			refreshMyUserSuccess: "✅ | আপনার user তথ্য সফলভাবে refresh হয়েছে!",
			refreshUserTargetSuccess: "✅ | User %1 এর তথ্য সফলভাবে refresh হয়েছে!",
			errorRefreshMyUser: "❌ | আপনার user তথ্য refresh করতে error হয়েছে",
			errorRefreshUserTarget: "❌ | User %1 এর তথ্য refresh করতে error হয়েছে"
		}
	},

	onStart: async function ({ args, threadsData, message, event, usersData, getLang }) {
		if (args[0] == "group" || args[0] == "thread") {
			const targetID = args[1] || event.threadID;
			try {
				await threadsData.refreshInfo(targetID);
				return message.reply(targetID == event.threadID ? getLang("refreshMyThreadSuccess") : getLang("refreshThreadTargetSuccess", targetID));
			}
			catch (error) {
				return message.reply(targetID == event.threadID ? getLang("errorRefreshMyThread") : getLang("errorRefreshThreadTarget", targetID));
			}
		}
		else if (args[0] == "user") {
			let targetID = event.senderID;
			if (args[1]) {
				if (Object.keys(event.mentions).length)
					targetID = Object.keys(event.mentions)[0];
				else
					targetID = args[1];
			}
			try {
				await usersData.refreshInfo(targetID);
				return message.reply(targetID == event.senderID ? getLang("refreshMyUserSuccess") : getLang("refreshUserTargetSuccess", targetID));
			}
			catch (error) {
				return message.reply(targetID == event.senderID ? getLang("errorRefreshMyUser") : getLang("errorRefreshUserTarget", targetID));
			}
		}
		else
			message.SyntaxError();
	}
};