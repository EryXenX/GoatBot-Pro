const { getPrboxx } = global.utils;

module.exports = {
	config: {
		name: "rules",
		version: "1.6",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Tạo/xem/thêm/sửa/đổi vị trí/xóa nội quy nhóm của bạn",
			en: "Create/view/add/edit/change position/delete group rules of you"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} [add | -a] <nội quy muốn thêm>: thêm nội quy cho nhóm."
				+ "\n   {pn}: xem nội quy của nhóm."
				+ "\n   {pn} [edit | -e] <n> <nội dung sau khi sửa>: chỉnh sửa lại nội quy thứ n."
				+ "\n   {pn} [move | -m] <stt1> <stt2> hoán đổi vị trí của nội quy thứ <stt1> và <stt2> với nhau."
				+ "\n   {pn} [delete | -d] <n>: xóa nội quy theo số thứ tự thứ n."
				+ "\n   {pn} [remove | -r]: xóa tất cả nội quy của nhóm."
				+ "\n"
				+ "\n   Ví dụ:"
				+ "\n    {pn} add không spam"
				+ "\n    {pn} move 1 3"
				+ "\n    {pn} -e 1 không spam tin nhắn trong nhóm"
				+ "\n    {pn} -r",
			en: "   {pn} [add | -a] <rule to add>: add rule for group."
				+ "\n   {pn}: view group rules."
				+ "\n   {pn} [edit | -e] <n> <content after edit>: edit rule number n."
				+ "\n   {pn} [move | -m] <stt1> <stt2> swap position of rule number <stt1> and <stt2>."
				+ "\n   {pn} [delete | -d] <n>: delete rule number n."
				+ "\n   {pn} [remove | -r]: delete all rules of group."
				+ "\n"
				+ "\n   Example:"
				+ "\n    {pn} add don't spam"
				+ "\n    {pn} move 1 3"
				+ "\n    {pn} -e 1 don't spam message in group"
				+ "\n    {pn} -r"
		}
	},

	langs: {
		vi: {
			yourRules: "Nội quy của nhóm bạn\n%1",
			noRules: "Hiện tại nhóm bạn chưa có bất kỳ nội quy nào, để thêm nội quy cho nhóm hãy sử dụng `%1rules add`",
			noPermissionAdd: "Chỉ quản trị viên mới có thể thêm nội quy cho nhóm",
			noContent: "Vui lòng nhập nội dung cho nội quy bạn muốn thêm",
			success: "Đã thêm nội quy mới cho nhóm thành công",
			noPermissionEdit: "Chỉ quản trị viên mới có thể chỉnh sửa nội quy nhóm",
			invalidNumber: "Vui lòng nhập số thứ tự của quy định bạn muốn chỉnh sửa",
			rulesNotExist: "Không tồn tại nội quy thứ %1",
			numberRules: "Hiện tại nhóm bạn chỉ có %1 nội quy được đặt ra",
			noContentEdit: "Vui lòng nhập nội dung bạn muốn thay đổi cho nội quy thứ %1",
			successEdit: "Đã chỉnh sửa nội quy thứ %1 thành: %2",
			noPermissionMove: "Chỉ quản trị viên mới có thể đổi vị trí nội quy của nhóm",
			invalidNumberMove: "Vui lòng nhập số thứ tự của 2 nội quy nhóm bạn muốn chuyển đổi vị trí với nhau",
			sameNumberMove: "Không thể chuyển đổi vị trí của 2 nội quy giống nhau",
			rulesNotExistMove2: "Không tồn tại nội quy thứ %1 và %2",
			successMove: "Đã chuyển đổi vị trí của 2 nội quy thứ %1 và %2 thành công",
			noPermissionDelete: "Chỉ quản trị viên mới có thể xóa nội quy của nhóm",
			invalidNumberDelete: "Vui lòng nhập số thứ tự của nội quy bạn muốn xóa",
			rulesNotExistDelete: "Không tồn tại nội quy thứ %1",
			successDelete: "Đã xóa nội quy thứ %1 của nhóm, nội dung: %2",
			noPermissionRemove: "Chỉ có quản trị viên nhóm mới có thể xoá bỏ tất cả nội quy của nhóm",
			confirmRemove: "⚠️ Thả cảm xúc bất kỳ vào tin nhắn này để xác nhận xóa toàn bộ nội quy của nhóm",
			successRemove: "Đã xóa toàn bộ nội quy của nhóm thành công",
			invalidNumberView: "Vui lòng nhập số thứ tự của nội quy bạn muốn xem"
		},
		en: {
			yourRules: "Your group rules\n%1",
			noRules: "Your group has no rules, to add rules for group use `%1rules add`",
			noPermissionAdd: "Only admins can add rules for group",
			noContent: "Please enter the content for the rule you want to add",
			success: "Added new rule for group successfully",
			noPermissionEdit: "Only admins can edit group rules",
			invalidNumber: "Please enter the number of the rule you want to edit",
			rulesNotExist: "Rule number %1 does not exist",
			numberRules: "Your group only has %1 rules",
			noContentEdit: "Please enter the content you want to change for rule number %1",
			successEdit: "Edited rule number %1 to: %2",
			noPermissionMove: "Only admins can move group rules",
			invalidNumberMove: "Please enter the number of 2 group rules you want to swap",
			sameNumberMove: "Cannot swap position of 2 same rules",
			rulesNotExistMove2: "Rule number %1 and %2 does not exist",
			successMove: "Swapped position of rule number %1 and %2 successfully",
			noPermissionDelete: "Only admins can delete group rules",
			invalidNumberDelete: "Please enter the number of the rule you want to delete",
			rulesNotExistDelete: "Rule number %1 does not exist",
			successDelete: "Deleted rule number %1 of group, content: %2",
			noPermissionRemove: "Only group admins can remove all group rules",
			confirmRemove: "⚠️ React to this message with any emoji to confirm remove all group rules",
			successRemove: "Removed all group rules successfully",
			invalidNumberView: "Please enter the number of the rule you want to view"
		},
		tl: {
			yourRules: "Mga panuntunan ng iyong grupo\n%1",
			noRules: "Walang panuntunan ang iyong grupo, para magdagdag gumamit ng `%1rules add`",
			noPermissionAdd: "Ang mga admin lamang ang maaaring magdagdag ng panuntunan sa grupo",
			noContent: "Mangyaring ilagay ang nilalaman ng panuntunan na gusto mong idagdag",
			success: "Matagumpay na naidagdag ang bagong panuntunan sa grupo",
			noPermissionEdit: "Ang mga admin lamang ang maaaring mag-edit ng mga panuntunan ng grupo",
			invalidNumber: "Mangyaring ilagay ang numero ng panuntunan na gusto mong i-edit",
			rulesNotExist: "Ang panuntunan bilang %1 ay hindi umiiral",
			numberRules: "Ang iyong grupo ay mayroon lamang %1 panuntunan",
			noContentEdit: "Mangyaring ilagay ang nilalaman na gusto mong baguhin para sa panuntunan bilang %1",
			successEdit: "Na-edit ang panuntunan bilang %1 sa: %2",
			noPermissionMove: "Ang mga admin lamang ang maaaring ilipat ang mga panuntunan ng grupo",
			invalidNumberMove: "Mangyaring ilagay ang numero ng 2 panuntunan ng grupo na gusto mong palitan ng posisyon",
			sameNumberMove: "Hindi maaaring palitan ang posisyon ng 2 parehong panuntunan",
			rulesNotExistMove2: "Ang panuntunan bilang %1 at %2 ay hindi umiiral",
			successMove: "Matagumpay na napalitan ang posisyon ng panuntunan bilang %1 at %2",
			noPermissionDelete: "Ang mga admin lamang ang maaaring magtanggal ng mga panuntunan ng grupo",
			invalidNumberDelete: "Mangyaring ilagay ang numero ng panuntunan na gusto mong tanggalin",
			rulesNotExistDelete: "Ang panuntunan bilang %1 ay hindi umiiral",
			successDelete: "Natanggal ang panuntunan bilang %1 ng grupo, nilalaman: %2",
			noPermissionRemove: "Ang mga admin ng grupo lamang ang maaaring alisin ang lahat ng panuntunan",
			confirmRemove: "⚠️ Mag-react sa mensaheng ito ng kahit anong emoji para kumpirmahin ang pag-alis ng lahat ng panuntunan ng grupo",
			successRemove: "Matagumpay na naalis ang lahat ng panuntunan ng grupo",
			invalidNumberView: "Mangyaring ilagay ang numero ng panuntunan na gusto mong tingnan"
		},
		hi: {
			yourRules: "Aapke group ke rules\n%1",
			noRules: "Aapke group mein koi rule nahi hai, rule add karne ke liye `%1rules add` use karein",
			noPermissionAdd: "Sirf admin hi group mein rules add kar sakte hain",
			noContent: "Kripya jo rule add karna hai uska content dalein",
			success: "Group mein naya rule successfully add kar diya gaya",
			noPermissionEdit: "Sirf admin hi group rules edit kar sakte hain",
			invalidNumber: "Kripya jo rule edit karna hai uska number dalein",
			rulesNotExist: "Rule number %1 exist nahi karta",
			numberRules: "Aapke group mein sirf %1 rules hain",
			noContentEdit: "Kripya rule number %1 ke liye badlna chahte hain wo content dalein",
			successEdit: "Rule number %1 edit hokar ho gaya: %2",
			noPermissionMove: "Sirf admin hi group rules ko move kar sakte hain",
			invalidNumberMove: "Kripya 2 group rules ke number dalein jo aap swap karna chahte hain",
			sameNumberMove: "2 same rules ki position swap nahi ho sakti",
			rulesNotExistMove2: "Rule number %1 aur %2 exist nahi karte",
			successMove: "Rule number %1 aur %2 ki position successfully swap ho gayi",
			noPermissionDelete: "Sirf admin hi group rules delete kar sakte hain",
			invalidNumberDelete: "Kripya jo rule delete karna hai uska number dalein",
			rulesNotExistDelete: "Rule number %1 exist nahi karta",
			successDelete: "Group ka rule number %1 delete ho gaya, content: %2",
			noPermissionRemove: "Sirf group admin hi saare group rules hata sakte hain",
			confirmRemove: "⚠️ Saare group rules hatane ki pushthi ke liye is message par koi bhi emoji se react karein",
			successRemove: "Saare group rules successfully hata diye gaye",
			invalidNumberView: "Kripya jo rule dekhna hai uska number dalein"
		},
		ar: {
			yourRules: "قواعد مجموعتك\n%1",
			noRules: "مجموعتك ليس لديها قواعد، لإضافة قواعد استخدم `%1rules add`",
			noPermissionAdd: "فقط المسؤولون يمكنهم إضافة قواعد للمجموعة",
			noContent: "الرجاء إدخال محتوى القاعدة التي تريد إضافتها",
			success: "تمت إضافة قاعدة جديدة للمجموعة بنجاح",
			noPermissionEdit: "فقط المسؤولون يمكنهم تعديل قواعد المجموعة",
			invalidNumber: "الرجاء إدخال رقم القاعدة التي تريد تعديلها",
			rulesNotExist: "القاعدة رقم %1 غير موجودة",
			numberRules: "مجموعتك لديها فقط %1 قاعدة",
			noContentEdit: "الرجاء إدخال المحتوى الذي تريد تغييره للقاعدة رقم %1",
			successEdit: "تم تعديل القاعدة رقم %1 إلى: %2",
			noPermissionMove: "فقط المسؤولون يمكنهم نقل قواعد المجموعة",
			invalidNumberMove: "الرجاء إدخال رقم القاعدتين اللتين تريد تبادل موضعيهما",
			sameNumberMove: "لا يمكن تبادل موضع نفس القاعدتين",
			rulesNotExistMove2: "القاعدة رقم %1 و%2 غير موجودة",
			successMove: "تم تبادل موضع القاعدة رقم %1 و%2 بنجاح",
			noPermissionDelete: "فقط المسؤولون يمكنهم حذف قواعد المجموعة",
			invalidNumberDelete: "الرجاء إدخال رقم القاعدة التي تريد حذفها",
			rulesNotExistDelete: "القاعدة رقم %1 غير موجودة",
			successDelete: "تم حذف القاعدة رقم %1 من المجموعة، المحتوى: %2",
			noPermissionRemove: "فقط مسؤولو المجموعة يمكنهم إزالة جميع القواعد",
			confirmRemove: "⚠️ تفاعل مع هذه الرسالة بأي إيموجي لتأكيد إزالة جميع قواعد المجموعة",
			successRemove: "تمت إزالة جميع قواعد المجموعة بنجاح",
			invalidNumberView: "الرجاء إدخال رقم القاعدة التي تريد عرضها"
		},
		bn: {
			yourRules: "আপনার group এর নিয়মাবলী\n%1",
			noRules: "আপনার group এ কোনো নিয়ম নেই, নিয়ম যোগ করতে `%1rules add` ব্যবহার করুন",
			noPermissionAdd: "শুধুমাত্র admin গ্রুপে নিয়ম যোগ করতে পারবে",
			noContent: "অনুগ্রহ করে যোগ করতে চান এমন নিয়মের বিষয়বস্তু লিখুন",
			success: "গ্রুপে নতুন নিয়ম সফলভাবে যোগ হয়েছে",
			noPermissionEdit: "শুধুমাত্র admin গ্রুপের নিয়ম সম্পাদনা করতে পারবে",
			invalidNumber: "অনুগ্রহ করে সম্পাদনা করতে চান এমন নিয়মের নম্বর দিন",
			rulesNotExist: "নিয়ম নম্বর %1 বিদ্যমান নেই",
			numberRules: "আপনার group এ মাত্র %1 টি নিয়ম আছে",
			noContentEdit: "অনুগ্রহ করে নিয়ম নম্বর %1 এর জন্য পরিবর্তন করতে চান এমন বিষয়বস্তু লিখুন",
			successEdit: "নিয়ম নম্বর %1 পরিবর্তন হয়েছে: %2",
			noPermissionMove: "শুধুমাত্র admin গ্রুপের নিয়ম সরাতে পারবে",
			invalidNumberMove: "অনুগ্রহ করে যে ২টি নিয়ম swap করতে চান তাদের নম্বর দিন",
			sameNumberMove: "একই নিয়মের অবস্থান swap করা যাবে না",
			rulesNotExistMove2: "নিয়ম নম্বর %1 এবং %2 বিদ্যমান নেই",
			successMove: "নিয়ম নম্বর %1 এবং %2 এর অবস্থান সফলভাবে swap হয়েছে",
			noPermissionDelete: "শুধুমাত্র admin গ্রুপের নিয়ম মুছতে পারবে",
			invalidNumberDelete: "অনুগ্রহ করে মুছতে চান এমন নিয়মের নম্বর দিন",
			rulesNotExistDelete: "নিয়ম নম্বর %1 বিদ্যমান নেই",
			successDelete: "গ্রুপের নিয়ম নম্বর %1 মুছা হয়েছে, বিষয়বস্তু: %2",
			noPermissionRemove: "শুধুমাত্র গ্রুপ admin সব নিয়ম সরাতে পারবে",
			confirmRemove: "⚠️ সব গ্রুপের নিয়ম সরানো নিশ্চিত করতে যেকোনো emoji দিয়ে এই message এ react করুন",
			successRemove: "সব গ্রুপের নিয়ম সফলভাবে সরানো হয়েছে",
			invalidNumberView: "অনুগ্রহ করে দেখতে চান এমন নিয়মের নম্বর দিন"
		}
	},

	onStart: async function ({ role, args, message, event, threadsData, getLang, commandName }) {
		const { threadID, senderID } = event;

		const type = args[0];
		const rulesOfThread = await threadsData.get(threadID, "data.rules", []);
		const totalRules = rulesOfThread.length;

		if (!type) {
			let i = 1;
			const msg = rulesOfThread.reduce((text, rules) => text += `${i++}. ${rules}\n`, "");
			message.reply(msg ? getLang("yourRules", msg) : getLang("noRules", getPrefix(threadID)), (err, info) => {
				global.GoatBot.onReply.set(info.messageID, {
					commandName,
					author: senderID,
					rulesOfThread,
					messageID: info.messageID
				});
			});
		}
		else if (["add", "-a"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionAdd"));
			if (!args[1])
				return message.reply(getLang("noContent"));
			rulesOfThread.push(args.slice(1).join(" "));
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(getLang("success"));
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["edit", "-e"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionEdit"));
			const stt = parseInt(args[1]);
			if (stt === NaN)
				return message.reply(getLang("invalidNumber"));
			if (!rulesOfThread[stt - 1])
				return message.reply(`${getLang("rulesNotExist", stt)}, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`);
			if (!args[2])
				return message.reply(getLang("noContentEdit", stt));
			const newContent = args.slice(2).join(" ");
			rulesOfThread[stt - 1] = newContent;
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(getLang("successEdit", stt, newContent));
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["move", "-m"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionMove"));
			const num1 = parseInt(args[1]);
			const num2 = parseInt(args[2]);
			if (isNaN(num1) || isNaN(num2))
				return message.reply(getLang("invalidNumberMove"));
			if (!rulesOfThread[num1 - 1] || !rulesOfThread[num2 - 1]) {
				let msg = !rulesOfThread[num1 - 1] ?
					!rulesOfThread[num2 - 1] ?
						message.reply(getLang("rulesNotExistMove2", num1, num2)) :
						message.reply(getLang("rulesNotExistMove", num1)) :
					message.reply(getLang("rulesNotExistMove", num2));
				msg += `, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`;
				return message.reply(msg);
			}
			if (num1 == num2)
				return message.reply(getLang("sameNumberMove"));

			// swap
			[rulesOfThread[num1 - 1], rulesOfThread[num2 - 1]] = [rulesOfThread[num2 - 1], rulesOfThread[num1 - 1]];
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(getLang("successMove", num1, num2));
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["delete", "del", "-d"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionDelete"));
			if (!args[1] || isNaN(args[1]))
				return message.reply(getLang("invalidNumberDelete"));
			const rulesDel = rulesOfThread[parseInt(args[1]) - 1];
			if (!rulesDel)
				return message.reply(`${getLang("rulesNotExistDelete", args[1])}, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`);
			rulesOfThread.splice(parseInt(args[1]) - 1, 1);
			await threadsData.set(threadID, rulesOfThread, "data.rules");
			message.reply(getLang("successDelete", args[1], rulesDel));
		}
		else if (["remove", "reset", "-r", "-rm"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionRemove"));
			message.reply(getLang("confirmRemove"), (err, info) => {
				global.GoatBot.onReaction.set(info.messageID, {
					commandName: "rules",
					messageID: info.messageID,
					author: senderID
				});
			});
		}
		else if (!isNaN(type)) {
			let msg = "";
			for (const stt of args) {
				const rules = rulesOfThread[parseInt(stt) - 1];
				if (rules)
					msg += `${stt}. ${rules}\n`;
			}
			if (msg == "")
				return message.reply(`${getLang("rulesNotExist", type)}, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`);
			message.reply(msg);
		}
		else {
			message.SyntaxError();
		}
	},

	onReply: async function ({ message, event, getLang, Reply }) {
		const { author, rulesOfThread } = Reply;
		if (author != event.senderID)
			return;
		const num = parseInt(event.body || "");
		if (isNaN(num) || num < 1)
			return message.reply(getLang("invalidNumberView"));
		const totalRules = rulesOfThread.length;
		if (num > totalRules)
			return message.reply(`${getLang("rulesNotExist", num)}, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`);
		message.reply(`${num}. ${rulesOfThread[num - 1]}`, () => message.unsend(Reply.messageID));
	},

	onReaction: async ({ threadsData, message, Reaction, event, getLang }) => {
		const { author } = Reaction;
		const { threadID, userID } = event;
		if (author != userID)
			return;
		await threadsData.set(threadID, [], "data.rules");
		message.reply(getLang("successRemove"));
	}
};
