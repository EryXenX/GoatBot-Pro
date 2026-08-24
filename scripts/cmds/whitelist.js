const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "whitelist",
    aliases: ["wl"],
    version: "1.6",
    author: "NTKhang X EryXenX",
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: "Bật/tắt, thêm, xóa quyền whiteListIds",
      en: "Toggle, add, remove whiteListIds role"
    },
    longDescription: {
      vi: "Bật/tắt, thêm, xóa quyền whiteListIds",
      en: "Toggle, add, remove whiteListIds role"
    },
    category: "owner",
    guide: {
      vi: "{pn} on/off: Bật hoặc tắt chế độ whitelist\n{pn} [add|-a] <uid|@tag>: Thêm quyền\n{pn} [remove|-r] <uid|@tag>: Xóa quyền\n{pn} [list|-l]: Xem danh sách",
      en: "{pn} on/off: Toggle whitelist mode\n{pn} [add|-a] <uid|@tag>: Add role\n{pn} [remove|-r] <uid|@tag>: Remove role\n{pn} [list|-l]: List all"
    },
  },

  langs: {
    vi: {
      toggledOn: "✅ | Đã bật chế độ whitelist.",
      toggledOff: "❌ | Đã tắt chế độ whitelist.",
      currentStatus: "🔄 | Trạng thái hiện tại: %1",
      added: "✅ | Đã thêm quyền whiteListIds cho %1 người dùng:\n%2",
      alreadyAdmin: "\n⚠ | %1 người dùng đã có quyền:\n%2",
      missingIdAdd: "⚠ | Vui lòng nhập ID hoặc tag người dùng để thêm quyền",
      removed: "✅ | Đã xóa quyền của %1 người dùng:\n%2",
      notAdmin: "⚠ | %1 người dùng không có quyền:\n%2",
      missingIdRemove: "⚠ | Vui lòng nhập ID hoặc tag người dùng để xóa quyền",
      listAdmin: "👑 | Danh sách whiteListIds:\n%1",
    },
    en: {
      toggledOn: "✅ | Whitelist mode has been turned ON.",
      toggledOff: "❌ | Whitelist mode has been turned OFF.",
      currentStatus: "🔄 | Current whitelist status: %1",
      added: "✅ | Added role for %1 users:\n%2",
      alreadyAdmin: "\n⚠ | %1 users already have role:\n%2",
      missingIdAdd: "⚠ | Please enter ID or tag to add role",
      removed: "✅ | Removed role of %1 users:\n%2",
      notAdmin: "⚠ | %1 users don't have role:\n%2",
      missingIdRemove: "⚠ | Please enter ID or tag to remove role",
      listAdmin: "👑 | List of whiteListIds:\n%1",
    },
    bn: {
      toggledOn: "✅ | হোয়াইটলিস্ট মোড চালু করা হয়েছে।",
      toggledOff: "❌ | হোয়াইটলিস্ট মোড বন্ধ করা হয়েছে।",
      currentStatus: "🔄 | বর্তমান স্ট্যাটাস: %1",
      added: "✅ | %1 জন ইউজারকে whiteListIds পারমিশন দেওয়া হয়েছে:\n%2",
      alreadyAdmin: "\n⚠ | %1 জন ইউজারের আগে থেকেই পারমিশন আছে:\n%2",
      missingIdAdd: "⚠ | পারমিশন দেওয়ার জন্য ID অথবা ট্যাগ দিন",
      removed: "✅ | %1 জন ইউজারের পারমিশন সরানো হয়েছে:\n%2",
      notAdmin: "⚠ | %1 জন ইউজারের পারমিশন নেই:\n%2",
      missingIdRemove: "⚠ | পারমিশন সরানোর জন্য ID অথবা ট্যাগ দিন",
      listAdmin: "👑 | whiteListIds লিস্ট:\n%1",
    },
    tl: {
      toggledOn: "✅ | Na-on na ang whitelist mode.",
      toggledOff: "❌ | Na-off na ang whitelist mode.",
      currentStatus: "🔄 | Kasalukuyang status: %1",
      added: "✅ | Nabigyan ng whiteListIds role ang %1 user(s):\n%2",
      alreadyAdmin: "\n⚠ | May role na ang %1 user(s):\n%2",
      missingIdAdd: "⚠ | Pakilagay ang ID o i-tag ang user para magdagdag ng role",
      removed: "✅ | Naalis ang role ng %1 user(s):\n%2",
      notAdmin: "⚠ | Walang role ang %1 user(s):\n%2",
      missingIdRemove: "⚠ | Pakilagay ang ID o i-tag ang user para tanggalin ang role",
      listAdmin: "👑 | Listahan ng whiteListIds:\n%1",
    },
    hi: {
      toggledOn: "✅ | Whitelist mode ON kar diya gaya hai.",
      toggledOff: "❌ | Whitelist mode OFF kar diya gaya hai.",
      currentStatus: "🔄 | Current status: %1",
      added: "✅ | %1 user(s) ko whiteListIds role de diya gaya:\n%2",
      alreadyAdmin: "\n⚠ | %1 user(s) ke paas pehle se role hai:\n%2",
      missingIdAdd: "⚠ | Role add karne ke liye ID ya tag dein",
      removed: "✅ | %1 user(s) ka role hata diya gaya:\n%2",
      notAdmin: "⚠ | %1 user(s) ke paas role nahi hai:\n%2",
      missingIdRemove: "⚠ | Role remove karne ke liye ID ya tag dein",
      listAdmin: "👑 | whiteListIds ki list:\n%1",
    },
    ar: {
      toggledOn: "✅ | تم تفعيل وضع القائمة البيضاء.",
      toggledOff: "❌ | تم إيقاف وضع القائمة البيضاء.",
      currentStatus: "🔄 | الحالة الحالية: %1",
      added: "✅ | تم منح صلاحية whiteListIds لعدد %1 مستخدم:\n%2",
      alreadyAdmin: "\n⚠ | يمتلك %1 مستخدم الصلاحية بالفعل:\n%2",
      missingIdAdd: "⚠ | يرجى إدخال المعرف أو الإشارة إلى المستخدم لإضافة الصلاحية",
      removed: "✅ | تمت إزالة صلاحية %1 مستخدم:\n%2",
      notAdmin: "⚠ | لا يمتلك %1 مستخدم الصلاحية:\n%2",
      missingIdRemove: "⚠ | يرجى إدخال المعرف أو الإشارة إلى المستخدم لإزالة الصلاحية",
      listAdmin: "👑 | قائمة whiteListIds:\n%1",
    },
  },

  onStart: async function ({ message, args, usersData, event, getLang, api }) {
    switch (args[0]) {
      case "on": {
        config.whiteListMode.status = true;
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(getLang("toggledOn"));
      }

      case "off": {
        config.whiteListMode.status = false;
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(getLang("toggledOff"));
      }

      case "add": case "-a": case "+": {
        if (!args[1]) return message.reply(getLang("missingIdAdd"));
        let uids = Object.keys(event.mentions).length ? Object.keys(event.mentions) : event.messageReply ? [event.messageReply.senderID] : args.filter(arg => !isNaN(arg));
        const notAdminIds = [], authorIds = [];
        for (const uid of uids) (config.whiteListMode.whiteListIds.includes(uid) ? authorIds : notAdminIds).push(uid);
        config.whiteListMode.whiteListIds.push(...notAdminIds);
        const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (notAdminIds.length ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "") +
          (authorIds.length ? getLang("alreadyAdmin", authorIds.length, authorIds.map(uid => `• ${uid}`).join("\n")) : "")
        );
      }

      case "remove": case "-r": case "-": {
        if (!args[1]) return message.reply(getLang("missingIdRemove"));
        let uids = Object.keys(event.mentions).length ? Object.keys(event.mentions) : args.filter(arg => !isNaN(arg));
        const notAdminIds = [], authorIds = [];
        for (const uid of uids) (config.whiteListMode.whiteListIds.includes(uid) ? authorIds : notAdminIds).push(uid);
        for (const uid of authorIds) config.whiteListMode.whiteListIds.splice(config.whiteListMode.whiteListIds.indexOf(uid), 1);
        const getNames = await Promise.all(authorIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (authorIds.length ? getLang("removed", authorIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "") +
          (notAdminIds.length ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
        );
      }

      case "list": case "-l": {
        const getNames = await Promise.all(config.whiteListMode.whiteListIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
      }

      default: {
        const status = config.whiteListMode.status ? "ON ✅" : "OFF ❌";
        return message.reply(getLang("currentStatus", status));
      }
    }
  }
};