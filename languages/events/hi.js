module.exports = {
	autoUpdateThreadInfo: {},
	checkwarn: {
		text: {
			warn: "Member %1 ko pehle 3 baar warn kiya ja chuka hai aur chat box se ban kiya gaya\n- Naam: %1\n- Uid: %2\n- Unban ke liye: \"%3warn unban <uid>\" command use karein",
			needPermission: "Bot ko banned members ko kick karne ke liye admin privilege chahiye"
		}
	},
	leave: {
		text: {
			session1: "subah",
			session2: "dopahar",
			session3: "shaam",
			session4: "raat",
			leaveType1: "group chhod diya",
			leaveType2: "group se nikala gaya"
		}
	},
	logsbot: {
		text: {
			title: "====== Bot logs ======",
			added: "\n✅\nEvent: Bot ek naye group mein joda gaya\n- Joda: %1",
			kicked: "\n❌\nEvent: Bot ko nikala gaya\n- Nikala: %1",
			footer: "\n- User ID: %1\n- Group: %2\n- Group ID: %3\n- Samay: %4"
		}
	},
	onEvent: {},
	welcome: {
		text: {
			session1: "subah",
			session2: "dopahar",
			session3: "shaam",
			session4: "raat",
			welcomeMessage: "Mujhe group mein jodne ke liye shukriya!\nBot prefix: %1\nCommands dekhne ke liye: %1help",
			multiple1: "aap",
			multiple2: "aap sabhi"
		}
	}
};
