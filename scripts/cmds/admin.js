const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "1.6",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Thêm, xóa, sửa quyền admin",
			en: "Add, remove, edit admin role"
		},
		category: "box chat",
		guide: {
			vi: '   {pn} [add | -a] <uid | @tag>: Thêm quyền admin cho người dùng'
				+ '\n	  {pn} [remove | -r] <uid | @tag>: Xóa quyền admin của người dùng'
				+ '\n	  {pn} [list | -l]: Liệt kê danh sách admin',
			en: '   {pn} [add | -a] <uid | @tag>: Add admin role for user'
				+ '\n	  {pn} [remove | -r] <uid | @tag>: Remove admin role of user'
				+ '\n	  {pn} [list | -l]: List all admins'
		}
	},

	langs: {
		vi: {
			added: "✅ | Đã thêm quyền admin cho %1 người dùng:\n%2",
			alreadyAdmin: "\n⚠️ | %1 người dùng đã có quyền admin từ trước rồi:\n%2",
			missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền admin",
			removed: "✅ | Đã xóa quyền admin của %1 người dùng:\n%2",
			notAdmin: "⚠️ | %1 người dùng không có quyền admin:\n%2",
			missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền admin",
			listAdmin: "👑 | Danh sách admin:\n%1"
		},
		en: {
			added: "✅ | Added admin role for %1 users:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users already have admin role:\n%2",
			missingIdAdd: "⚠️ | Please enter ID or tag user to add admin role",
			removed: "✅ | Removed admin role of %1 users:\n%2",
			notAdmin: "⚠️ | %1 users don't have admin role:\n%2",
			missingIdRemove: "⚠️ | Please enter ID or tag user to remove admin role",
			listAdmin: "👑 | List of admins:\n%1"
		},
		tl: {
			added: "✅ | Naidagdag ang admin role para sa %1 user:\n%2",
			alreadyAdmin: "\n⚠️ | %1 user ay mayroon nang admin role:\n%2",
			missingIdAdd: "⚠️ | Mangyaring maglagay ng ID o mag-tag ng user para idagdag ang admin role",
			removed: "✅ | Naalis ang admin role ng %1 user:\n%2",
			notAdmin: "⚠️ | %1 user ay walang admin role:\n%2",
			missingIdRemove: "⚠️ | Mangyaring maglagay ng ID o mag-tag ng user para alisin ang admin role",
			listAdmin: "👑 | Listahan ng mga admin:\n%1"
		},
		hi: {
			added: "✅ | %1 users ko admin role de diya gaya:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users ke paas pehle se admin role hai:\n%2",
			missingIdAdd: "⚠️ | Admin role dene ke liye ID dalein ya user ko tag karein",
			removed: "✅ | %1 users ka admin role hata diya gaya:\n%2",
			notAdmin: "⚠️ | %1 users ke paas admin role nahi hai:\n%2",
			missingIdRemove: "⚠️ | Admin role hatane ke liye ID dalein ya user ko tag karein",
			listAdmin: "👑 | Admins ki list:\n%1"
		},
		ar: {
			added: "✅ | تمت إضافة دور المسؤول لـ %1 مستخدم:\n%2",
			alreadyAdmin: "\n⚠️ | %1 مستخدم لديهم بالفعل دور المسؤول:\n%2",
			missingIdAdd: "⚠️ | الرجاء إدخال ID أو وضع علامة على المستخدم لإضافة دور المسؤول",
			removed: "✅ | تمت إزالة دور المسؤول من %1 مستخدم:\n%2",
			notAdmin: "⚠️ | %1 مستخدم ليس لديهم دور المسؤول:\n%2",
			missingIdRemove: "⚠️ | الرجاء إدخال ID أو وضع علامة على المستخدم لإزالة دور المسؤول",
			listAdmin: "👑 | قائمة المسؤولين:\n%1"
		},
		bn: {
			added: "✅ | %1 জন user কে admin role দেওয়া হয়েছে:\n%2",
			alreadyAdmin: "\n⚠️ | %1 জন user এর আগে থেকেই admin role আছে:\n%2",
			missingIdAdd: "⚠️ | Admin role দিতে ID দিন বা user কে tag করুন",
			removed: "✅ | %1 জন user এর admin role সরানো হয়েছে:\n%2",
			notAdmin: "⚠️ | %1 জন user এর admin role নেই:\n%2",
			missingIdRemove: "⚠️ | Admin role সরাতে ID দিন বা user কে tag করুন",
			listAdmin: "👑 | Admin তালিকা:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			default:
				return message.SyntaxError();
		}
	}
};