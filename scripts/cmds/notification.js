const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.8",
		author: "NTKhang Fixed By EryXenX",
		countDown: 5,
		role: 2,
		description: {
			vi: "Gửi thông báo từ admin đến all box",
			en: "Send notification from admin to all box"
		},
		category: "owner",
		guide: {
			en: "{pn} <tin nhắn>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		vi: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm",
			sendingNotification: "📡 Đang gửi thông báo đến %1 nhóm...\n⏳ Vui lòng chờ...",
			sentNotification: "📊 Kết quả thông báo\n─────────────────────\n✅ Thành công : %1 nhóm",
			errorSendingNotification: "❌ Thất bại   : %1 nhóm\n%2"
		},
		en: {
			missingMessage: "Please enter the message you want to send to all groups",
			sendingNotification: "📡 Sending notification to %1 groups...\n⏳ Please wait...",
			sentNotification: "📊 Notification Report\n─────────────────────\n✅ Success : %1 groups",
			errorSendingNotification: "❌ Failed  : %1 groups\n%2"
		},
		bn: {
			missingMessage: "অনুগ্রহ করে সব গ্রুপে পাঠাতে চান এমন message লিখুন",
			sendingNotification: "📡 %1 টি গ্রুপে নোটিফিকেশন পাঠানো হচ্ছে...\n⏳ অপেক্ষা করুন...",
			sentNotification: "📊 নোটিফিকেশন রিপোর্ট\n─────────────────────\n✅ সফল : %1 টি গ্রুপ",
			errorSendingNotification: "❌ ব্যর্থ : %1 টি গ্রুপ\n%2"
		},
		tl: {
			missingMessage: "Mangyaring ilagay ang mensaheng gusto mong ipadala sa lahat ng grupo",
			sendingNotification: "📡 Nagpapadala ng notification sa %1 grupo...\n⏳ Mangyaring maghintay...",
			sentNotification: "📊 Ulat ng Notification\n─────────────────────\n✅ Tagumpay : %1 grupo",
			errorSendingNotification: "❌ Nabigo  : %1 grupo\n%2"
		},
		hi: {
			missingMessage: "Kripya wo message dalein jo aap sabhi groups mein bhejna chahte hain",
			sendingNotification: "📡 %1 groups mein notification bheja ja raha hai...\n⏳ Kripya prateeksha karein...",
			sentNotification: "📊 Notification Report\n─────────────────────\n✅ Safal : %1 groups",
			errorSendingNotification: "❌ Asafal : %1 groups\n%2"
		},
		ar: {
			missingMessage: "الرجاء إدخال الرسالة التي تريد إرسالها لجميع المجموعات",
			sendingNotification: "📡 جاري إرسال الإشعار إلى %1 مجموعة...\n⏳ يرجى الانتظار...",
			sentNotification: "📊 تقرير الإشعار\n─────────────────────\n✅ نجاح : %1 مجموعة",
			errorSendingNotification: "❌ فشل : %1 مجموعة\n%2"
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, usersData, getLang }) {
		const { delayPerGroup } = envCommands[commandName];
		if (!args[0])
			return message.reply(getLang("missingMessage"));

		const senderID = event.senderID;
		const senderName = await usersData.get(senderID, "name") || "Admin";

		const attachmentStreams = await getStreamsFromAttachment(
			[
				...event.attachments,
				...(event.messageReply?.attachments || [])
			].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
		);

		const msgText = args.join(" ");
		const body = `📢 ADMIN NOTIFICATION\n─────────────────────\n  ${msgText}\n─────────────────────\n👤 ${senderName}`;

		const formSend = {
			body,
			mentions: [
				{
					tag: senderName,
					id: senderID
				}
			]
		};
		if (attachmentStreams && attachmentStreams.length > 0)
			formSend.attachment = attachmentStreams;

		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
		message.reply(getLang("sendingNotification", allThreadID.length));

		let sendSucces = 0;
		const sendError = [];
		const wattingSend = [];

		for (const thread of allThreadID) {
			const tid = thread.threadID;
			try {
				wattingSend.push({
					threadID: tid,
					pending: api.sendMessage(formSend, tid)
				});
				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
			}
			catch (e) {
				sendError.push({ threadIDs: [tid], errorDescription: e?.error || e?.message || String(e) });
			}
		}

		for (const sended of wattingSend) {
			try {
				await sended.pending;
				sendSucces++;
			}
			catch (e) {
				const errorDescription = e?.error || e?.message || String(e);
				if (!sendError.some(item => item.errorDescription == errorDescription))
					sendError.push({
						threadIDs: [sended.threadID],
						errorDescription
					});
				else
					sendError.find(item => item.errorDescription == errorDescription).threadIDs.push(sended.threadID);
			}
		}

		let msg = "";
		if (sendSucces > 0)
			msg += getLang("sentNotification", sendSucces) + "\n";
		if (sendError.length > 0)
			msg += getLang("errorSendingNotification", sendError.reduce((a, b) => a + b.threadIDs.length, 0), sendError.reduce((a, b) => a + `\n • ${b.errorDescription}\n   └ ${b.threadIDs.join(", ")}`, ""));
		message.reply(msg);
	}
};