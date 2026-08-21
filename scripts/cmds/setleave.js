const { drive, getStreamFromURL, getExtFromUrl, getTime } = global.utils;

module.exports = {
	config: {
		name: "setleave",
		aliases: ["setl"],
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Chỉnh sửa nội dung/bật/tắt tin nhắn tạm biệt thành viên rời khỏi nhóm chat của bạn",
			en: "Edit content/turn on/off leave message when member leave your group chat"
		},
		category: "custom",
		guide: {
			vi: {
				body: "   {pn} on: Bật tin nhắn tạm biệt"
					+ "\n   {pn} off: Tắt tin nhắn tạm biệt"
					+ "\n   {pn} text [<nội dung> | reset]: chỉnh sửa nội dung văn bản hoặc reset về mặc định, những shortcut có sẵn:"
					+ "\n  + {userName}: tên của thành viên rời khỏi nhóm"
					+ "\n  + {userNameTag}: tên của thành viên rời khỏi nhóm (tag)"
					+ "\n  + {boxName}:  tên của nhóm chat"
					+ "\n  + {type}: tự rời/bị qtv xóa khỏi nhóm"
					+ "\n  + {session}:  buổi trong ngày"
					+ "\n\n   Ví dụ:"
					+ "\n    {pn} text {userName} đã {type} khỏi nhóm, see you again 🤧"
					+ "\n"
					+ "\n   Reply (phản hồi) hoặc gửi kèm một tin nhắn có file với nội dung {pn} file: để thêm tệp đính kèm vào tin nhắn rời khỏi nhóm (ảnh, video, audio)"
					+ "\n\nVí dụ:"
					+ "\n   {pn} file reset: xóa gửi file",
				attachment: {
					[`${__dirname}/assets/guide/setleave/setleave_vi_1.png`]: "https://i.ibb.co/2FKJHJr/guide1.png"
				}
			},
			en: {
				body: "   {pn} on: Turn on leave message"
					+ "\n   {pn} off: Turn off leave message"
					+ "\n   {pn} text [<content> | reset]: edit text content or reset to default, available shortcuts:"
					+ "\n  + {userName}: name of member who leave group"
					+ "\n  + {userNameTag}: name of member who leave group (tag)"
					+ "\n  + {boxName}: name of group chat"
					+ "\n  + {type}: leave/kicked by admin"
					+ "\n  + {session}: session in day"
					+ "\n\n   Example:"
					+ "\n    {pn} text {userName} has {type} group, see you again 🤧"
					+ "\n"
					+ "\n   Reply or send a message with file with content {pn} file: to add attachment file to leave message (image, video, audio)"
					+ "\n\nExample:"
					+ "\n   {pn} file reset: reset file",
				attachment: {
					[`${__dirname}/assets/guide/setleave/setleave_en_1.png`]: "https://i.ibb.co/2FKJHJr/guide1.png"
				}
			}
		}
	},

	langs: {
		vi: {
			turnedOn: "Bật tin nhắn tạm biệt thành công",
			turnedOff: "Tắt tin nhắn tạm biệt thành công",
			missingContent: "Vui lùng nhập nội dung tin nhắn",
			edited: "Đã chỉnh sửa nội dung tin nhắn tạm biệt của nhóm bạn thành:\n%1",
			reseted: "Đã reset nội dung tin nhắn tạm biệt",
			noFile: "Không có tệp đính kèm tin nhắn tạm biệt nào để xóa",
			resetedFile: "Đã reset tệp đính kèm thành công",
			missingFile: "Hãy phản hồi tin nhắn này kèm file ảnh/video/audio",
			addedFile: "Đã thêm %1 tệp đính kèm vào tin nhắn tạm biệt của nhóm bạn"
		},
		en: {
			turnedOn: "Turned on leave message successfully",
			turnedOff: "Turned off leave message successfully",
			missingContent: "Please enter content",
			edited: "Edited leave message content of your group to:\n%1",
			reseted: "Reseted leave message content",
			noFile: "No leave message attachment file to reset",
			resetedFile: "Reseted leave message attachment file successfully",
			missingFile: "Please reply this message with image/video/audio file",
			addedFile: "Added %1 attachment file to your leave message"
		},
		tl: {
			turnedOn: "Matagumpay na na-on ang leave message",
			turnedOff: "Matagumpay na na-off ang leave message",
			missingContent: "Mangyaring ilagay ang nilalaman",
			edited: "Na-edit ang nilalaman ng leave message ng iyong grupo sa:\n%1",
			reseted: "Na-reset ang nilalaman ng leave message",
			noFile: "Walang attachment file ng leave message na ire-reset",
			resetedFile: "Matagumpay na na-reset ang attachment file ng leave message",
			missingFile: "Mangyaring sumagot sa mensaheng ito na may image/video/audio file",
			addedFile: "Naidagdag ang %1 attachment file sa iyong leave message"
		},
		hi: {
			turnedOn: "Leave message successfully on ho gaya",
			turnedOff: "Leave message successfully off ho gaya",
			missingContent: "Kripya content dalein",
			edited: "Aapke group ka leave message content badal diya gaya:\n%1",
			reseted: "Leave message content reset ho gaya",
			noFile: "Reset karne ke liye koi leave message attachment file nahi hai",
			resetedFile: "Leave message attachment file successfully reset ho gayi",
			missingFile: "Kripya is message ka reply image/video/audio file ke saath karein",
			addedFile: "Aapke leave message mein %1 attachment file add kar di gayi"
		},
		ar: {
			turnedOn: "تم تفعيل رسالة المغادرة بنجاح",
			turnedOff: "تم إيقاف رسالة المغادرة بنجاح",
			missingContent: "الرجاء إدخال المحتوى",
			edited: "تم تعديل محتوى رسالة المغادرة لمجموعتك إلى:\n%1",
			reseted: "تمت إعادة تعيين محتوى رسالة المغادرة",
			noFile: "لا يوجد ملف مرفق لرسالة المغادرة لإعادة التعيين",
			resetedFile: "تمت إعادة تعيين ملف مرفق رسالة المغادرة بنجاح",
			missingFile: "الرجاء الرد على هذه الرسالة بملف صورة/فيديو/صوت",
			addedFile: "تمت إضافة %1 ملف مرفق إلى رسالة المغادرة"
		},
		bn: {
			turnedOn: "Leave message সফলভাবে চালু হয়েছে",
			turnedOff: "Leave message সফলভাবে বন্ধ হয়েছে",
			missingContent: "অনুগ্রহ করে বিষয়বস্তু লিখুন",
			edited: "আপনার group এর leave message পরিবর্তন হয়েছে:\n%1",
			reseted: "Leave message রিসেট হয়েছে",
			noFile: "রিসেট করার জন্য কোনো leave message attachment file নেই",
			resetedFile: "Leave message attachment file সফলভাবে রিসেট হয়েছে",
			missingFile: "অনুগ্রহ করে এই message এ image/video/audio file সহ reply করুন",
			addedFile: "আপনার leave message এ %1 টি attachment file যোগ করা হয়েছে"
		}
	},

	onStart: async function ({ args, threadsData, message, event, commandName, getLang }) {
		const { threadID, senderID, body } = event;
		const { data, settings } = await threadsData.get(threadID);

		switch (args[0]) {
			case "text": {
				if (!args[1])
					return message.reply(getLang("missingContent"));
				else if (args[1] == "reset")
					delete data.leaveMessage;
				else
					data.leaveMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
				await threadsData.set(threadID, {
					data
				});
				message.reply(data.leaveMessage ? getLang("edited", data.leaveMessage) : getLang("reseted"));
				break;
			}
			case "file": {
				if (args[1] == "reset") {
					const { leaveAttachment } = data;
					if (!leaveAttachment)
						return message.reply(getLang("noFile"));
					try {
						await Promise.all(data.leaveAttachment.map(fileId => drive.deleteFile(fileId)));
						delete data.leaveAttachment;
					}
					catch (e) { }

					await threadsData.set(threadID, {
						data
					});
					message.reply(getLang("resetedFile"));
				}
				else if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0)) {
					return message.reply(getLang("missingFile"), (err, info) => {
						global.GoatBot.onReply.set(info.messageID, {
							messageID: info.messageID,
							author: senderID,
							commandName
						});
					});
				}
				else {
					saveChanges(message, event, threadID, senderID, threadsData, getLang);
				}
				break;
			}
			case "on":
			case "off": {
				settings.sendLeaveMessage = args[0] == "on";
				await threadsData.set(threadID, { settings });
				message.reply(getLang(args[0] == "on" ? "turnedOn" : "turnedOff"));
				break;
			}
			default:
				message.SyntaxError();
				break;
		}
	},

	onReply: async function ({ event, Reply, message, threadsData, getLang }) {
		const { threadID, senderID } = event;
		if (senderID != Reply.author)
			return;

		if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0))
			return message.reply(getLang("missingFile"));
		saveChanges(message, event, threadID, senderID, threadsData, getLang);
	}
};

async function saveChanges(message, event, threadID, senderID, threadsData, getLang) {
	const { data } = await threadsData.get(threadID);
	const attachments = [...event.attachments, ...(event.messageReply?.attachments || [])].filter(item => ["photo", 'png', "animated_image", "video", "audio"].includes(item.type));
	if (!data.leaveAttachment)
		data.leaveAttachment = [];

	await Promise.all(attachments.map(async attachment => {
		const { url } = attachment;
		const ext = getExtFromUrl(url);
		const fileName = `${getTime()}.${ext}`;
		const infoFile = await drive.uploadFile(`setleave_${threadID}_${senderID}_${fileName}`, await getStreamFromURL(url));
		data.leaveAttachment.push(infoFile.id);
	}));

	await threadsData.set(threadID, {
		data
	});
	message.reply(getLang("addedFile", attachments.length));
}
