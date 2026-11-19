const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "1.5",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		description: {
			vi: "bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
			en: "turn on/off only admin can use bot"
		},
		category: "owner",
		guide: {
			vi: "   {pn} [on | off]: bật/tắt chế độ chỉ admin mới có thể sử dụng bot"
				+ "\n   {pn} noti [on | off]: bật/tắt thông báo khi người dùng không phải là admin sử dụng bot",
			en: "   {pn} [on | off]: turn on/off the mode only admin can use bot"
				+ "\n   {pn} noti [on | off]: turn on/off the notification when user is not admin use bot"
		}
	},

	langs: {
		vi: {
			turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot",
			turnedOnNoti: "Đã bật thông báo khi người dùng không phải là admin sử dụng bot",
			turnedOffNoti: "Đã tắt thông báo khi người dùng không phải là admin sử dụng bot"
		},
		en: {
			turnedOn: "Turned on the mode only admin can use bot",
			turnedOff: "Turned off the mode only admin can use bot",
			turnedOnNoti: "Turned on the notification when user is not admin use bot",
			turnedOffNoti: "Turned off the notification when user is not admin use bot"
		},
		tl: {
			turnedOn: "Na-on ang mode na admin lamang ang makakagamit ng bot",
			turnedOff: "Na-off ang mode na admin lamang ang makakagamit ng bot",
			turnedOnNoti: "Na-on ang abiso kapag ang user ay hindi admin at gumagamit ng bot",
			turnedOffNoti: "Na-off ang abiso kapag ang user ay hindi admin at gumagamit ng bot"
		},
		hi: {
			turnedOn: "Sirf admin bot use kar sakta hai wala mode on ho gaya",
			turnedOff: "Sirf admin bot use kar sakta hai wala mode off ho gaya",
			turnedOnNoti: "Non-admin user ke bot use karne par notification on ho gaya",
			turnedOffNoti: "Non-admin user ke bot use karne par notification off ho gaya"
		},
		ar: {
			turnedOn: "تم تفعيل وضع الاستخدام للمسؤولين فقط",
			turnedOff: "تم إيقاف وضع الاستخدام للمسؤولين فقط",
			turnedOnNoti: "تم تفعيل الإشعار عند استخدام غير المسؤولين للبوت",
			turnedOffNoti: "تم إيقاف الإشعار عند استخدام غير المسؤولين للبوت"
		},
		bn: {
			turnedOn: "শুধুমাত্র admin bot ব্যবহার করতে পারবে এই মোড চালু হয়েছে",
			turnedOff: "শুধুমাত্র admin bot ব্যবহার করতে পারবে এই মোড বন্ধ হয়েছে",
			turnedOnNoti: "Non-admin user bot ব্যবহার করলে notification চালু হয়েছে",
			turnedOffNoti: "Non-admin user bot ব্যবহার করলে notification বন্ধ হয়েছে"
		}
	},

	onStart: function ({ args, message, getLang }) {
		let isSetNoti = false;
		let value;
		let indexGetVal = 0;

		if (args[0] == "noti") {
			isSetNoti = true;
			indexGetVal = 1;
		}

		if (args[indexGetVal] == "on")
			value = true;
		else if (args[indexGetVal] == "off")
			value = false;
		else
			return message.SyntaxError();

		if (isSetNoti) {
			config.hideNotiMessage.adminOnly = !value;
			message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
		}
		else {
			config.adminOnly.enable = value;
			message.reply(getLang(value ? "turnedOn" : "turnedOff"));
		}

		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
	}
};
