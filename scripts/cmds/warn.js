const { getTime } = global.utils;

module.exports = {
	config: {
		name: "warn",
		version: "1.8",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "cảnh cáo thành viên trong nhóm, đủ 3 lần ban khỏi box",
			en: "warn member in group, if they have 3 warns, they will be banned"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} @tag <lý do>: dùng cảnh cáo thành viên"
				+ "\n   {pn} list: xem danh sách những thành viên đã bị cảnh cáo"
				+ "\n   {pn} listban: xem danh sách những thành viên đã bị cảnh cáo đủ 3 lần và bị ban khỏi box"
				+ "\n   {pn} info [@tag | <uid> | reply | để trống]: xem thông tin cảnh cáo của người được tag hoặc uid hoặc bản thân"
				+ "\n   {pn} unban [@tag | <uid> | reply | để trống]: gỡ ban thành viên, đồng thời gỡ tất cả cảnh cáo của thành viên đó"
				+ "\n   {pn} unwarn [@tag | <uid> | reply | để trống] [<số thứ tự> | để trống]: gỡ cảnh cáo thành viên bằng uid và số thứ tự cảnh cáo, nếu để trống sẽ gỡ cảnh cáo cuối cùng"
				+ "\n   {pn} reset: reset tất cả dữ liệu cảnh cáo"
				+ "\n⚠️ Cần set quản trị viên cho bot để bot tự kick thành viên bị ban",
			en: "   {pn} @tag <reason>: warn member"
				+ "\n   {pn} list: view list of warned members"
				+ "\n   {pn} listban: view list of banned members"
				+ "\n   {pn} info [@tag | <uid> | reply | leave blank]: view warning information of tagged person or uid or yourself"
				+ "\n   {pn} unban [@tag | <uid> | reply | leave blank]: unban member, at the same time remove all warnings of that member"
				+ "\n   {pn} unwarn [@tag | <uid> | reply | leave blank] [<number> | leave blank]: remove warning of member by uid and number of warning, if leave blank will remove the last warning"
				+ "\n   {pn} reset: reset all warn data"
				+ "\n⚠️ You need to set admin for bot to auto kick banned members"
		}
	},

	langs: {
		vi: {
			list: "Danh sách những thành viên bị cảnh cáo:\n%1\n\nĐể xem chi tiết những lần cảnh cáo hãy dùng lệnh \"%2warn info  [@tag | <uid> | để trống]\": để xem thông tin cảnh cáo của người được tag hoặc uid hoặc bản thân",
			listBan: "Danh sách những thành viên bị cảnh cáo đủ 3 lần và ban khỏi box:\n%1",
			listEmpty: "Nhóm bạn chưa có thành viên nào bị cảnh cáo",
			listBanEmpty: "Nhóm bạn chưa có thành viên nào bị ban khỏi box",
			invalidUid: "Vui lòng nhập uid hợp lệ của người bạn muốn xem thông tin",
			noData: "Không có dữ liệu nào",
			noPermission: "❌ Chỉ quản trị viên nhóm mới có thể unban thành viên bị ban khỏi box",
			invalidUid2: "⚠️ Vui lòng nhập uid hợp lệ của người muốn gỡ ban",
			notBanned: "⚠️ Người dùng mang id %1 chưa bị ban khỏi box của bạn",
			unbanSuccess: "✅ Đã gỡ ban thành viên [%1 | %2], hiện tại người này có thể tham gia box chat của bạn",
			noPermission2: "❌ Chỉ quản trị viên nhóm mới có thể gỡ cảnh cáo của thành viên trong nhóm",
			invalidUid3: "⚠️ Vui lòng nhập uid hoặc tag người muốn gỡ cảnh cáo",
			noData2: "⚠️ Người dùng mang id %1 chưa có dữ liệu cảnh cáo",
			notEnoughWarn: "❌ Người dùng %1 chỉ có %2 lần cảnh cáo",
			unwarnSuccess: "✅ Đã gỡ lần cảnh cáo thứ %1 của thành viên [%2 | %3] thành công",
			noPermission3: "❌ Chỉ quản trị viên nhóm mới có thể reset dữ liệu cảnh cáo",
			resetWarnSuccess: "✅ Đã reset dữ liệu cảnh cáo thành công",
			noPermission4: "❌ Chỉ quản trị viên nhóm mới có thể cảnh cáo thành viên trong nhóm",
			invalidUid4: "⚠️ Bạn cần phải tag hoặc phản hồi tin nhắn của người muốn cảnh cáo",
			warnSuccess: "⚠️ Đã cảnh cáo thành viên %1 lần %2\n- Uid: %3\n- Lý do: %4\n- Date Time: %5\nThành viên này đã bị cảnh cáo đủ 3 lần và bị ban khỏi box, để gỡ ban hãy sử dụng lệnh \"%6warn unban <uid>\" (với uid là uid của người muốn gỡ ban)",
			noPermission5: "⚠️ Bot cần quyền quản trị viên để kick thành viên bị ban",
			warnSuccess2: "⚠️ Đã cảnh cáo thành viên %1 lần %2\n- Uid: %3\n- Lý do: %4\n- Date Time: %5\nNếu vi phạm %6 lần nữa người này sẽ bị ban khỏi box",
			hasBanned: "⚠️ Thành viên sau đã bị cảnh cáo đủ 3 lần trước đó và bị ban khỏi box:\n%1",
			failedKick: "⚠️ Đã xảy ra lỗi khi kick những thành viên sau:\n%1",
			userNotInGroup: "⚠️ Người dùng \"%1\" hiện tại không có trong nhóm của bạn"
		},
		en: {
			list: "List of members who have been warned:\n%1\n\nTo view the details of the warnings, use the \"%2warn info [@tag | <uid> | leave blank]\" command: to view the warning information of the tagged person or uid or yourself",
			listBan: "List of members who have been warned 3 times and banned from the box:\n%1",
			listEmpty: "Your group has no members who have been warned",
			listBanEmpty: "Your group has no members banned from the box",
			invalidUid: "Please enter a valid uid of the person you want to view information",
			noData: "No data",
			noPermission: "❌ Only group administrators can unban members banned from the box",
			invalidUid2: "⚠️ Please enter a valid uid of the person you want to unban",
			notBanned: "⚠️ The user with id %1 has not been banned from your box",
			unbanSuccess: "✅ Successfully unbanned member [%1 | %2], currently this person can join your chat box",
			noPermission2: "❌ Only group administrators can remove warnings from members in the group",
			invalidUid3: "⚠️ Please enter a uid or tag the person you want to remove the warning",
			noData2: "⚠️ The user with id %1 has no warning data",
			notEnoughWarn: "❌ The user %1 only has %2 warnings",
			unwarnSuccess: "✅ Successfully removed the %1 warning of member [%2 | %3]",
			noPermission3: "❌ Only group administrators can reset warning data",
			resetWarnSuccess: "✅ Successfully reset warning data",
			noPermission4: "❌ Only group administrators can warn members in the group",
			invalidUid4: "⚠️ You need to tag or reply to the message of the person you want to warn",
			warnSuccess: "⚠️ Warned member %1 times %2\n- Uid: %3\n- Reason: %4\n- Date Time: %5\nThis member has been warned 3 times and banned from the box, to unban use the command \"%6warn unban <uid>\" (with uid is the uid of the person you want to unban)",
			noPermission5: "⚠️ Bot needs administrator permissions to kick banned members",
			warnSuccess2: "⚠️ Warned member %1 %2 times\n- Uid: %3\n- Reason: %4\n- Date Time: %5\nIf this person violates %6 more times, they will be banned from the box",
			hasBanned: "⚠️ The following members have been warned 3 times before and banned from the box:\n%1",
			failedKick: "⚠️ An error occurred when kicking the following members:\n%1",
			userNotInGroup: "⚠️ The user \"%1\" is currently not in your group"
		},
		tl: {
			list: "Listahan ng mga miyembrong nakatanggap ng babala:\n%1\n\nPara makita ang detalye ng mga babala, gamitin ang \"%2warn info [@tag | <uid> | iwanang blangko]\"",
			listBan: "Listahan ng mga miyembrong 3 beses na naabisuhan at na-ban mula sa box:\n%1",
			listEmpty: "Walang miyembro sa iyong grupo na nakatanggap ng babala",
			listBanEmpty: "Walang miyembro sa iyong grupo na na-ban mula sa box",
			invalidUid: "Mangyaring maglagay ng wastong uid ng taong gusto mong makita ang impormasyon",
			noData: "Walang data",
			noPermission: "❌ Mga administrator lamang ng grupo ang maaaring mag-unban ng mga miyembro",
			invalidUid2: "⚠️ Mangyaring maglagay ng wastong uid ng taong gusto mong i-unban",
			notBanned: "⚠️ Ang user na may id %1 ay hindi na-ban mula sa iyong box",
			unbanSuccess: "✅ Matagumpay na na-unban ang miyembro [%1 | %2]",
			noPermission2: "❌ Mga administrator lamang ng grupo ang maaaring mag-alis ng babala sa mga miyembro",
			invalidUid3: "⚠️ Mangyaring maglagay ng uid o mag-tag ng taong gusto mong alisin ang babala",
			noData2: "⚠️ Ang user na may id %1 ay walang data ng babala",
			notEnoughWarn: "❌ Ang user na %1 ay %2 babala lamang",
			unwarnSuccess: "✅ Matagumpay na naalis ang %1 babala ng miyembro [%2 | %3]",
			noPermission3: "❌ Mga administrator lamang ng grupo ang maaaring mag-reset ng data ng babala",
			resetWarnSuccess: "✅ Matagumpay na na-reset ang data ng babala",
			noPermission4: "❌ Mga administrator lamang ng grupo ang maaaring magbabala sa mga miyembro",
			invalidUid4: "⚠️ Kailangan mong mag-tag o sumagot sa mensahe ng taong gusto mong babalaan",
			warnSuccess: "⚠️ Binalaan ang miyembro %1 beses %2\n- Uid: %3\n- Dahilan: %4\n- Petsa Oras: %5\nAng miyembrong ito ay 3 beses na binalaan at na-ban mula sa box, para i-unban gamitin ang \"%6warn unban <uid>\"",
			noPermission5: "⚠️ Kailangan ng bot ng pahintulot ng administrator para i-kick ang mga na-ban",
			warnSuccess2: "⚠️ Binalaan ang miyembro %1 %2 beses\n- Uid: %3\n- Dahilan: %4\n- Petsa Oras: %5\nKung ang taong ito ay %6 beses pang lalabag, siya ay iba-ban mula sa box",
			hasBanned: "⚠️ Ang mga sumusunod na miyembro ay 3 beses na binalaan at na-ban mula sa box:\n%1",
			failedKick: "⚠️ Nagkaroon ng error habang kini-kick ang mga sumusunod na miyembro:\n%1",
			userNotInGroup: "⚠️ Ang user na \"%1\" ay kasalukuyang wala sa iyong grupo"
		},
		hi: {
			list: "Warned members ki list:\n%1\n\nWarnings ki details dekhne ke liye \"%2warn info [@tag | <uid> | khali chhoden]\" command use karein",
			listBan: "3 baar warn hoke box se ban hue members ki list:\n%1",
			listEmpty: "Aapke group mein koi warned member nahi hai",
			listBanEmpty: "Aapke group mein box se ban koi member nahi hai",
			invalidUid: "Kripya valid uid dalein jis insaan ki jankari chahiye",
			noData: "Koi data nahi",
			noPermission: "❌ Sirf group administrator hi box se ban members ko unban kar sakte hain",
			invalidUid2: "⚠️ Kripya valid uid dalein jise unban karna hai",
			notBanned: "⚠️ Id %1 wala user aapke box se banned nahi hai",
			unbanSuccess: "✅ Member [%1 | %2] ko successfully unban kar diya gaya",
			noPermission2: "❌ Sirf group administrator hi members ki warnings hata sakte hain",
			invalidUid3: "⚠️ Kripya uid dalein ya us insaan ko tag karein jisski warning hatani hai",
			noData2: "⚠️ Id %1 wale user ka koi warning data nahi hai",
			notEnoughWarn: "❌ User %1 ke paas sirf %2 warnings hain",
			unwarnSuccess: "✅ Member [%2 | %3] ki %1 warning successfully hata di gayi",
			noPermission3: "❌ Sirf group administrator hi warning data reset kar sakte hain",
			resetWarnSuccess: "✅ Warning data successfully reset ho gaya",
			noPermission4: "❌ Sirf group administrator hi group ke members ko warn kar sakte hain",
			invalidUid4: "⚠️ Aapko us insaan ko tag karna hai ya unka message reply karna hai jise warn karna hai",
			warnSuccess: "⚠️ Member ko %1 baar %2 warn kiya gaya\n- Uid: %3\n- Wajah: %4\n- Date Time: %5\nIs member ko 3 baar warn hoke box se ban kiya gaya, unban ke liye \"%6warn unban <uid>\" command use karein",
			noPermission5: "⚠️ Bot ko banned members ko kick karne ke liye administrator permission chahiye",
			warnSuccess2: "⚠️ Member %1 ko %2 baar warn kiya gaya\n- Uid: %3\n- Wajah: %4\n- Date Time: %5\nAgar ye insaan %6 baar aur rules toda to box se ban ho jayega",
			hasBanned: "⚠️ Niche diye gaye members ko pehle 3 baar warn hoke box se ban kiya gaya:\n%1",
			failedKick: "⚠️ Niche diye gaye members ko kick karte waqt error aaya:\n%1",
			userNotInGroup: "⚠️ User \"%1\" abhi aapke group mein nahi hai"
		},
		ar: {
			list: "قائمة الأعضاء الذين تم تحذيرهم:\n%1\n\nلعرض تفاصيل التحذيرات، استخدم \"%2warn info [@tag | <uid> | اتركه فارغاً]\"",
			listBan: "قائمة الأعضاء الذين تم تحذيرهم 3 مرات وحظرهم:\n%1",
			listEmpty: "لا يوجد أعضاء في مجموعتك تم تحذيرهم",
			listBanEmpty: "لا يوجد أعضاء في مجموعتك تم حظرهم",
			invalidUid: "الرجاء إدخال uid صحيح للشخص الذي تريد عرض معلوماته",
			noData: "لا توجد بيانات",
			noPermission: "❌ فقط مسؤولو المجموعة يمكنهم رفع الحظر عن الأعضاء",
			invalidUid2: "⚠️ الرجاء إدخال uid صحيح للشخص الذي تريد رفع حظره",
			notBanned: "⚠️ المستخدم ذو id %1 لم يتم حظره من مجموعتك",
			unbanSuccess: "✅ تم رفع الحظر بنجاح عن العضو [%1 | %2]",
			noPermission2: "❌ فقط مسؤولو المجموعة يمكنهم إزالة التحذيرات",
			invalidUid3: "⚠️ الرجاء إدخال uid أو وضع علامة على الشخص الذي تريد إزالة تحذيره",
			noData2: "⚠️ لا توجد بيانات تحذير للمستخدم ذو id %1",
			notEnoughWarn: "❌ المستخدم %1 لديه فقط %2 تحذيرات",
			unwarnSuccess: "✅ تمت إزالة التحذير %1 بنجاح من العضو [%2 | %3]",
			noPermission3: "❌ فقط مسؤولو المجموعة يمكنهم إعادة تعيين بيانات التحذير",
			resetWarnSuccess: "✅ تمت إعادة تعيين بيانات التحذير بنجاح",
			noPermission4: "❌ فقط مسؤولو المجموعة يمكنهم تحذير الأعضاء",
			invalidUid4: "⚠️ تحتاج إلى وضع علامة على الشخص أو الرد على رسالته الذي تريد تحذيره",
			warnSuccess: "⚠️ تم تحذير العضو %1 مرة %2\n- Uid: %3\n- السبب: %4\n- التاريخ والوقت: %5\nتم تحذير هذا العضو 3 مرات وحظره، لرفع الحظر استخدم \"%6warn unban <uid>\"",
			noPermission5: "⚠️ يحتاج البوت إلى إذن المسؤول لطرد الأعضاء المحظورين",
			warnSuccess2: "⚠️ تم تحذير العضو %1 عدد %2 مرات\n- Uid: %3\n- السبب: %4\n- التاريخ والوقت: %5\nإذا انتهك هذا الشخص %6 مرات أخرى، سيتم حظره",
			hasBanned: "⚠️ الأعضاء التاليون تم تحذيرهم 3 مرات وحظرهم:\n%1",
			failedKick: "⚠️ حدث خطأ أثناء طرد الأعضاء التاليين:\n%1",
			userNotInGroup: "⚠️ المستخدم \"%1\" غير موجود حالياً في مجموعتك"
		},
		bn: {
			list: "সতর্ক করা সদস্যদের তালিকা:\n%1\n\nসতর্কতার বিস্তারিত দেখতে \"%2warn info [@tag | <uid> | খালি রাখুন]\" কমান্ড ব্যবহার করুন",
			listBan: "৩ বার সতর্ক হয়ে box থেকে ban হওয়া সদস্যদের তালিকা:\n%1",
			listEmpty: "আপনার গ্রুপে কোনো সতর্ক করা সদস্য নেই",
			listBanEmpty: "আপনার গ্রুপে box থেকে ban করা কোনো সদস্য নেই",
			invalidUid: "অনুগ্রহ করে যার তথ্য দেখতে চান তার সঠিক uid দিন",
			noData: "কোনো তথ্য নেই",
			noPermission: "❌ শুধুমাত্র গ্রুপ অ্যাডমিনরাই ban করা সদস্যদের unban করতে পারবে",
			invalidUid2: "⚠️ অনুগ্রহ করে যাকে unban করতে চান তার সঠিক uid দিন",
			notBanned: "⚠️ id %1 সহ ব্যবহারকারী আপনার box থেকে ban হয়নি",
			unbanSuccess: "✅ সদস্য [%1 | %2] কে সফলভাবে unban করা হয়েছে",
			noPermission2: "❌ শুধুমাত্র গ্রুপ অ্যাডমিনরাই সদস্যদের সতর্কতা সরাতে পারবে",
			invalidUid3: "⚠️ অনুগ্রহ করে uid দিন বা যার সতর্কতা সরাতে চান তাকে tag করুন",
			noData2: "⚠️ id %1 সহ ব্যবহারকারীর কোনো সতর্কতার তথ্য নেই",
			notEnoughWarn: "❌ ব্যবহারকারী %1 এর মাত্র %2টি সতর্কতা আছে",
			unwarnSuccess: "✅ সদস্য [%2 | %3] এর %1 নম্বর সতর্কতা সফলভাবে সরানো হয়েছে",
			noPermission3: "❌ শুধুমাত্র গ্রুপ অ্যাডমিনরাই সতর্কতার তথ্য রিসেট করতে পারবে",
			resetWarnSuccess: "✅ সতর্কতার তথ্য সফলভাবে রিসেট হয়েছে",
			noPermission4: "❌ শুধুমাত্র গ্রুপ অ্যাডমিনরাই সদস্যদের সতর্ক করতে পারবে",
			invalidUid4: "⚠️ যাকে সতর্ক করতে চান তাকে tag করুন বা তার মেসেজে reply করুন",
			warnSuccess: "⚠️ সদস্যকে %1 বার %2 সতর্ক করা হয়েছে\n- Uid: %3\n- কারণ: %4\n- তারিখ সময়: %5\nএই সদস্যকে ৩ বার সতর্ক করে box থেকে ban করা হয়েছে, unban করতে \"%6warn unban <uid>\" ব্যবহার করুন",
			noPermission5: "⚠️ ban করা সদস্যদের kick করতে bot এর administrator permission দরকার",
			warnSuccess2: "⚠️ সদস্য %1 কে %2 বার সতর্ক করা হয়েছে\n- Uid: %3\n- কারণ: %4\n- তারিখ সময়: %5\nএই ব্যক্তি আরও %6 বার নিয়ম ভাঙলে box থেকে ban হবে",
			hasBanned: "⚠️ নিচের সদস্যরা আগে ৩ বার সতর্ক হয়ে box থেকে ban হয়েছে:\n%1",
			failedKick: "⚠️ নিচের সদস্যদের kick করতে গিয়ে error হয়েছে:\n%1",
			userNotInGroup: "⚠️ ব্যবহারকারী \"%1\" বর্তমানে আপনার গ্রুপে নেই"
		}
	},

	onStart: async function ({ message, api, event, args, threadsData, usersData, prefix, role, getLang }) {
		if (!args[0])
			return message.SyntaxError();
		const { threadID, senderID } = event;
		const warnList = await threadsData.get(threadID, "data.warn", []);

		switch (args[0]) {
			case "list": {
				const msg = await Promise.all(warnList.map(async user => {
					const { uid, list } = user;
					const name = await usersData.getName(uid);
					return `${name} (${uid}): ${list.length}`;
				}));
				message.reply(msg.length ? getLang("list", msg.join("\n"), prefix) : getLang("listEmpty"));
				break;
			}
			case "listban": {
				const result = (await Promise.all(warnList.map(async user => {
					const { uid, list } = user;
					if (list.length >= 3) {
						const name = await usersData.getName(uid);
						return `${name} (${uid})`;
					}
				}))).filter(item => item);
				message.reply(result.length ? getLang("listBan", result.join("\n")) : getLang("listBanEmpty"));
				break;
			}
			case "check":
			case "info": {
				let uids, msg = "";
				if (Object.keys(event.mentions).length)
					uids = Object.keys(event.mentions);
				else if (event.messageReply?.senderID)
					uids = [event.messageReply.senderID];
				else if (args.slice(1).length)
					uids = args.slice(1);
				else
					uids = [senderID];

				if (!uids)
					return message.reply(getLang("invalidUid"));
				msg += (await Promise.all(uids.map(async uid => {
					if (isNaN(uid))
						return null;
					const dataWarnOfUser = warnList.find(user => user.uid == uid);
					let msg = `Uid: ${uid}`;
					const userName = await usersData.getName(uid);

					if (!dataWarnOfUser || dataWarnOfUser.list.length == 0)
						msg += `\n  Name: ${userName}\n  ${getLang("noData")}`;
					else {
						msg += `\nName: ${userName}`
							+ `\nWarn list:` + dataWarnOfUser.list.reduce((acc, warn) => {
								const { dateTime, reason } = warn;
								return acc + `\n  - Reason: ${reason}\n    Time: ${dateTime}`;
							}, "");
					}
					return msg;
				}))).filter(msg => msg).join("\n\n");
				message.reply(msg);
				break;
			}
			case "unban": {
				if (role < 1)
					return message.reply(getLang("noPermission"));
				let uidUnban;
				if (Object.keys(event.mentions).length)
					uidUnban = Object.keys(event.mentions)[0];
				else if (event.messageReply?.senderID)
					uidUnban = event.messageReply.senderID;
				else if (args.slice(1).length)
					uidUnban = args.slice(1);
				else
					uidUnban = senderID;

				if (!uidUnban || isNaN(uidUnban))
					return message.reply(getLang("invalidUid2"));

				const index = warnList.findIndex(user => user.uid == uidUnban && user.list.length >= 3);
				if (index === -1)
					return message.reply(getLang("notBanned", uidUnban));

				warnList.splice(index, 1);
				await threadsData.set(threadID, warnList, "data.warn");
				const userName = await usersData.getName(uidUnban);
				message.reply(getLang("unbanSuccess", uidUnban, userName));
				break;
			}
			case "unwarn": {
				if (role < 1)
					return message.reply(getLang("noPermission2"));
				let uid, num;
				if (Object.keys(event.mentions)[0]) {
					uid = Object.keys(event.mentions)[0];
					num = args[args.length - 1];
				}
				else if (event.messageReply?.senderID) {
					uid = event.messageReply.senderID;
					num = args[1];
				}
				else {
					uid = args[1];
					num = parseInt(args[2]) - 1;
				}

				if (isNaN(uid))
					return message.reply(getLang("invalidUid3"));

				const dataWarnOfUser = warnList.find(u => u.uid == uid);
				if (!dataWarnOfUser?.list.length)
					return message.reply(getLang("noData2", uid));

				if (isNaN(num))
					num = dataWarnOfUser.list.length - 1;

				const userName = await usersData.getName(uid);
				if (num > dataWarnOfUser.list.length)
					return message.reply(getLang("notEnoughWarn", userName, dataWarnOfUser.list.length));

				dataWarnOfUser.list.splice(parseInt(num), 1);
				if (!dataWarnOfUser.list.length)
					warnList.splice(warnList.findIndex(u => u.uid == uid), 1);
				await threadsData.set(threadID, warnList, "data.warn");
				message.reply(getLang("unwarnSuccess", num + 1, uid, userName));
				break;
			}
			case "reset": {
				if (role < 1)
					return message.reply(getLang("noPermission3"));
				await threadsData.set(threadID, [], "data.warn");
				message.reply(getLang("resetWarnSuccess"));
				break;
			}
			default: {
				if (role < 1)
					return message.reply(getLang("noPermission4"));
				let reason, uid;
				if (event.messageReply) {
					uid = event.messageReply.senderID;
					reason = args.join(" ").trim();
				}
				else if (Object.keys(event.mentions)[0]) {
					uid = Object.keys(event.mentions)[0];
					reason = args.join(" ").replace(event.mentions[uid], "").trim();
				}
				else {
					return message.reply(getLang("invalidUid4"));
				}
				if (!reason)
					reason = "No reason";
				const dataWarnOfUser = warnList.find(item => item.uid == uid);
				const dateTime = getTime("DD/MM/YYYY hh:mm:ss");
				if (!dataWarnOfUser)
					warnList.push({
						uid,
						list: [{ reason, dateTime, warnBy: senderID }]
					});
				else
					dataWarnOfUser.list.push({ reason, dateTime, warnBy: senderID });

				await threadsData.set(threadID, warnList, "data.warn");

				const times = dataWarnOfUser?.list.length ?? 1;

				const userName = await usersData.getName(uid);
				if (times >= 3) {
					message.reply(getLang("warnSuccess", userName, times, uid, reason, dateTime, prefix), () => {
						api.removeUserFromGroup(uid, threadID, async (err) => {
							if (err) {
								const members = await threadsData.get(event.threadID, "members");
								if (members.find(item => item.userID == uid)?.inGroup) // check if user is still in group
									return message.reply(getLang("userNotInGroup", userName));
								else
									return message.reply(getLang("noPermission5"), (e, info) => {
										const { onEvent } = global.GoatBot;
										onEvent.push({
											messageID: info.messageID,
											onStart: async ({ event }) => {
												if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
													const { TARGET_ID } = event.logMessageData;
													if (TARGET_ID == api.getCurrentUserID()) {
														const warnList = await threadsData.get(event.threadID, "data.warn", []);
														if ((warnList.find(user => user.uid == uid)?.list.length ?? 0) <= 3)
															global.GoatBot.onEvent = onEvent.filter(item => item.messageID != info.messageID);
														else
															api.removeUserFromGroup(uid, event.threadID, () => global.GoatBot.onEvent = onEvent.filter(item => item.messageID != info.messageID));
													}
												}
											}
										});
									});
							}
						});
					});
				}
				else
					message.reply(getLang("warnSuccess2", userName, times, uid, reason, dateTime, 3 - (times)));
			}
		}
	},

	onEvent: async ({ event, threadsData, usersData, message, api, getLang }) => {
		const { logMessageType, logMessageData } = event;
		if (logMessageType === "log:subscribe") {
			return async () => {
				const { data, adminIDs } = await threadsData.get(event.threadID);
				const warnList = data.warn || [];
				if (!warnList.length)
					return;
				const { addedParticipants } = logMessageData;
				const hasBanned = [];

				for (const user of addedParticipants) {
					const { userFbId: uid } = user;
					const dataWarnOfUser = warnList.find(item => item.uid == uid);
					if (!dataWarnOfUser)
						continue;
					const { list } = dataWarnOfUser;
					if (list.length >= 3) {
						const userName = await usersData.getName(uid);
						hasBanned.push({
							uid,
							name: userName
						});
					}
				}

				if (hasBanned.length) {
					await message.send(getLang("hasBanned", hasBanned.map(item => `  - ${item.name} (uid: ${item.uid})`).join("\n")));
					if (!adminIDs.includes(api.getCurrentUserID()))
						message.reply(getLang("noPermission5"), (e, info) => {
							const { onEvent } = global.GoatBot;
							onEvent.push({
								messageID: info.messageID,
								onStart: async ({ event }) => {
									if (
										event.logMessageType === "log:thread-admins"
										&& event.logMessageData.ADMIN_EVENT == "add_admin"
										&& event.logMessageData.TARGET_ID == api.getCurrentUserID()
									) {
										const threadData = await threadsData.get(event.threadID);
										const warnList = threadData.data.warn;
										const members = threadData.members;
										removeUsers(hasBanned, warnList, api, event, message, getLang, members);
										global.GoatBot.onEvent = onEvent.filter(item => item.messageID != info.messageID);
									}
								}
							});
						});
					else {
						const members = await threadsData.get(event.threadID, "members");
						removeUsers(hasBanned, warnList, api, event, message, getLang, members);
					}
				}
			};
		}
	}
};

async function removeUsers(hasBanned, warnList, api, event, message, getLang, members) {
	const failed = [];
	for (const user of hasBanned) {
		if (members.find(item => item.userID == user.uid)?.inGroup) { // check if user is still in group
			try {
				if (warnList.find(item => item.uid == user.uid)?.list.length ?? 0 >= 3)
					await api.removeUserFromGroup(user.uid, event.threadID);
			}
			catch (e) {
				failed.push({
					uid: user.uid,
					name: user.name
				});
			}
		}
	}
	if (failed.length)
		message.reply(getLang("failedKick", failed.map(item => `  - ${item.name} (uid: ${item.uid})`).join("\n")));
}