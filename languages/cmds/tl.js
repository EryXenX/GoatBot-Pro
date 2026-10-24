module.exports = {
	onlyadminbox: {
		description: "I-on/off ang mode na admin lang ng grupo ang makakagamit ng bot",
		guide: "   {pn} [on | off]",
		text: {
			turnedOn: "Naka-on na ang mode na admin lang ng grupo ang makakagamit ng bot",
			turnedOff: "Naka-off na ang mode na admin lang ng grupo ang makakagamit ng bot",
			syntaxError: "Mali ang syntax, gamitin lamang ang {pn} on o {pn} off"
		}
	},
	adduser: {
		description: "Magdagdag ng user sa iyong box chat",
		guide: "   {pn} [link profile | uid]",
		text: {
			alreadyInGroup: "Nasa grupo na",
			successAdd: "- Matagumpay na naidagdag ang %1 miyembro sa grupo",
			failedAdd: "- Nabigo sa pagdaragdag ng %1 miyembro sa grupo",
			approve: "- Naidagdag ang %1 miyembro sa listahan ng pag-apruba",
			invalidLink: "Mangyaring maglagay ng valid na Facebook link",
			cannotGetUid: "Hindi makuha ang uid ng user na ito",
			linkNotExist: "Hindi umiiral ang profile url na ito",
			cannotAddUser: "Na-block ang bot o naka-block ng user na ito ang mga estranyo mula sa pagdaragdag sa grupo"
		}
	},
	admin: {
		description: "Magdagdag, mag-alis, mag-edit ng admin role",
		guide: "   {pn} [add | -a] <uid>: Magbigay ng admin role sa user\n\t  {pn} [remove | -r] <uid>: Mag-alis ng admin role ng user\n\t  {pn} [list | -l]: Tingnan ang lahat ng admin",
		text: {
			added: "✅ | Nabigyan ng admin role ang %1 mga user:\n%2",
			alreadyAdmin: "\n⚠️ | Mayroon nang admin role ang %1 mga user:\n%2",
			missingIdAdd: "⚠️ | Mangyaring maglagay ng ID o mag-tag ng user para magbigay ng admin role",
			removed: "✅ | Naalis ang admin role ng %1 mga user:\n%2",
			notAdmin: "⚠️ | Walang admin role ang %1 mga user:\n%2",
			missingIdRemove: "⚠️ | Mangyaring maglagay ng ID o mag-tag ng user para alisin ang admin role",
			listAdmin: "👑 | Listahan ng mga admin:\n%1"
		}
	},
	adminonly: {
		description: "I-on/off ang mode na admin lang ang makakagamit ng bot",
		guide: "{pn} [on | off]",
		text: {
			turnedOn: "Naka-on na ang mode na admin lang ang makakagamit ng bot",
			turnedOff: "Naka-off na ang mode na admin lang ang makakagamit ng bot",
			syntaxError: "Mali ang syntax, gamitin lamang ang {pn} on o {pn} off"
		}
	},
	all: {
		description: "I-tag ang lahat ng miyembro sa iyong group chat",
		guide: "{pn} [content | empty]"
	},
	anime: {
		description: "Random na anime image",
		guide: "{pn} <endpoint>\n   Listahan ng endpoint: neko, kitsune, hug, pat, waifu, cry, kiss, slap, smug, punch",
		text: {
			loading: "Inihahanda ang image, mangyaring maghintay...",
			error: "May naganap na error, subukan muli mamaya"
		}
	},
	antichangeinfobox: {
		description: "I-on/off ang anti change info ng box",
		guide: "   {pn} avt [on | off]: anti change avatar\n   {pn} name [on | off]: anti change pangalan\n   {pn} theme [on | off]: anti change tema\n   {pn} emoji [on | off]: anti change emoji",
		text: {
			antiChangeAvatarOn: "Naka-on na ang anti change avatar ng box chat",
			antiChangeAvatarOff: "Naka-off na ang anti change avatar ng box chat",
			missingAvt: "Hindi pa naka-set ang avatar para sa box chat",
			antiChangeNameOn: "Naka-on na ang anti change pangalan ng box chat",
			antiChangeNameOff: "Naka-off na ang anti change pangalan ng box chat",
			antiChangeThemeOn: "Naka-on na ang anti change tema ng box chat",
			antiChangeThemeOff: "Naka-off na ang anti change tema ng box chat",
			antiChangeEmojiOn: "Naka-on na ang anti change emoji ng box chat",
			antiChangeEmojiOff: "Naka-off na ang anti change emoji ng box chat",
			antiChangeAvatarAlreadyOn: "Kasalukuyang naka-on ang anti change avatar sa iyong box chat",
			antiChangeNameAlreadyOn: "Kasalukuyang naka-on ang anti change pangalan sa iyong box chat",
			antiChangeThemeAlreadyOn: "Kasalukuyang naka-on ang anti change tema sa iyong box chat",
			antiChangeEmojiAlreadyOn: "Kasalukuyang naka-on ang anti change emoji sa iyong box chat"
		}
	},
	appstore: {
		description: "Maghanap ng app sa Appstore",
		text: {
			missingKeyword: "Hindi ka naglagay ng keyword",
			noResult: "Walang nahanap na resulta para sa keyword na %1"
		}
	},
	autosetname: {
		description: "Auto-baguhin ang nickname ng bagong miyembro",
		guide: "   {pn} set <nickname>: I-set ang config para sa auto nickname\n   {pn} [on | off]: I-on/off ang feature\n   {pn} [view | info]: Tingnan ang kasalukuyang config",
		text: {
			missingConfig: "Mangyaring maglagay ng kinakailangang configuration",
			configSuccess: "Matagumpay na na-set ang configuration",
			currentConfig: "Ang kasalukuyang autoSetName configuration sa iyong group:\n%1",
			notSetConfig: "Hindi pa naka-set ang autoSetName configuration ng iyong grupo",
			syntaxError: "Mali ang syntax, gamitin lamang ang \"{pn} on\" o \"{pn} off\"",
			turnOnSuccess: "Naka-on na ang autoSetName feature",
			turnOffSuccess: "Naka-off na ang autoSetName feature",
			error: "May naganap na error habang ginagamit ang autoSetName feature"
		}
	},
	avatar: {
		description: "Gumawa ng anime avatar na may pirma",
		guide: "{p}{n} <character id o pangalan> | <background text> | <pirma> | <kulay>",
		text: {
			initImage: "Inihahanda ang image, mangyaring maghintay...",
			invalidCharacter: "Kasalukuyang mayroon lamang %1 characters sa sistema",
			notFoundCharacter: "Walang nahanap na character na may pangalang %1",
			errorGetCharacter: "May naganap na error habang kinukuha ang character data:\n%1: %2",
			success: "✅ Ang iyong avatar\nCharacter: %1\nID: %2\nBackground text: %3\nPirma: %4\nKulay: %5",
			defaultColor: "default",
			error: "May naganap na error\n%1: %2"
		}
	},
	badwords: {
		description: "I-on/off/add/remove ang bawal na salita",
		guide: "   {pn} add <words>: Magdagdag ng bawal na salita\n   {pn} delete <words>: Mag-alis ng bawal na salita\n   {pn} list: Tingnan ang listahan\n   {pn} on: I-on\n   {pn} off: I-off",
		text: {
			onText: "on",
			offText: "off",
			onlyAdmin: "⚠️ | Admin lang ang makakapagdagdag ng bawal na salita",
			missingWords: "⚠️ | Hindi ka naglagay ng bawal na salita",
			addedSuccess: "✅ | Naidagdag ang %1 bawal na salita sa listahan",
			alreadyExist: "❌ | Mayroon na ang %1 bawal na salita sa listahan: %2",
			tooShort: "⚠️ | %1 bawal na salita ay mas maikli sa 2 character: %2",
			onlyAdmin2: "⚠️ | Admin lang ang makakapag-alis ng bawal na salita",
			missingWords2: "⚠️ | Hindi ka naglagay ng salitang aalisin",
			deletedSuccess: "✅ | Naalis ang %1 bawal na salita sa listahan",
			notExist: "❌ | %1 bawal na salita ay wala sa listahan: %2",
			emptyList: "⚠️ | Ang listahan ng bawal na salita sa iyong grupo ay walang laman",
			badWordsList: "📑 | Listahan ng bawal na salita sa iyong grupo: %1",
			onlyAdmin3: "⚠️ | Admin lang ang makakapag-%1 ng feature na ito",
			turnedOnOrOff: "✅ | Ang babala sa bawal na salita ay %1 na",
			onlyAdmin4: "⚠️ | Admin lang ang makakapag-alis ng babala sa bawal na salita",
			missingTarget: "⚠️ | Hindi ka naglagay ng user ID o nag-tag ng user",
			notWarned: "⚠️ | Hindi pa nababalaan ang user %1 para sa bawal na salita",
			removedWarn: "✅ | Naalis ang 1 babala sa bawal na salita ng user %1 | %2",
			warned: "⚠️ | Natuklasan ang bawal na salitang \"%1\" sa iyong mensahe, kung magpapatuloy ka ay matatanggal sa grupo.",
			warned2: "⚠️ | Natuklasan ang bawal na salitang \"%1\" sa iyong mensahe, 2 beses ka nang lumabag at matatanggal sa grupo.",
			needAdmin: "Kailangan ng bot ng admin na pribilehiyo para i-kick ang mga na-ban na miyembro",
			unwarned: "✅ | Naalis ang babala sa bawal na salita ng user %1 | %2"
		}
	},
	balance: {
		description: "Tingnan ang iyong pera o pera ng na-tag na tao",
		guide: "   {pn}: Tingnan ang iyong pera\n   {pn} <@tag>: Tingnan ang pera ng na-tag",
		text: {
			money: "Mayroon kang %1$",
			moneyOf: "Ang %1 ay mayroon %2$"
		}
	},
	batslap: {
		description: "Batslap image",
		text: {
			noTag: "Kailangan mong i-tag ang taong gusto mong sampalin"
		}
	},
	busy: {
		description: "I-on ang do not disturb mode",
		guide: "   {pn} [empty | <dahilan>]: I-on ang do not disturb\n   {pn} off: I-off",
		text: {
			turnedOff: "✅ | Naka-off na ang do not disturb mode",
			turnedOn: "✅ | Naka-on na ang do not disturb mode",
			turnedOnWithReason: "✅ | Naka-on na ang do not disturb mode na may dahilan: %1",
			alreadyOn: "Abala na si user %1",
			alreadyOnWithReason: "Abala na si user %1 dahil sa: %2"
		}
	},
	callad: {
		description: "Magpadala ng ulat/feedback/bug sa admin bot",
		guide: "   {pn} <mensahe>",
		text: {
			missingMessage: "Mangyaring maglagay ng mensaheng ipapadala sa admin",
			sendByGroup: "\n- Ipinadala mula sa grupo: %1\n- Thread ID: %2",
			sendByUser: "\n- Ipinadala mula sa user",
			content: "\n\nNilalaman:\n─────────────────\n%1\n─────────────────\nI-reply ang mensaheng ito para magpadala ng mensahe sa user",
			success: "Matagumpay na naipadala ang iyong mensahe sa admin!",
			reply: "📍 Reply mula sa admin %1:\n─────────────────\n%2\n─────────────────\nI-reply ang mensaheng ito para magpadala muli sa admin",
			replySuccess: "Matagumpay na naipadala ang iyong reply sa admin!",
			feedback: "📝 Feedback mula sa user %1:\n- User ID: %2%3\n\nNilalaman:\n─────────────────\n%4\n─────────────────\nI-reply ang mensaheng ito para magpadala ng mensahe sa user",
			replyUserSuccess: "Matagumpay na naipadala ang iyong reply sa user!"
		}
	},
	cmd: {
		description: "Pamahalaan ang iyong command files",
		guide: "{pn} load <command file name>\n{pn} loadAll\n{pn} install <url> <command file name>",
		text: {
			missingFileName: "⚠️ | Mangyaring maglagay ng command name na i-reload",
			loaded: "✅ | Matagumpay na na-load ang command na \"%1\"",
			loadedError: "❌ | Nabigo sa pag-load ng command na \"%1\"\n%2: %3",
			loadedSuccess: "✅ | Matagumpay na na-load ang \"%1\" command",
			loadedFail: "❌ | Nabigo sa pag-load ng \"%1\" command\n%2",
			missingCommandNameUnload: "⚠️ | Mangyaring maglagay ng command name na i-unload",
			unloaded: "✅ | Matagumpay na na-unload ang command na \"%1\"",
			unloadedError: "❌ | Nabigo sa pag-unload ng command na \"%1\"\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Mangyaring maglagay ng url/code at file name na ii-install",
			missingUrlOrCode: "⚠️ | Mangyaring maglagay ng url o code ng command file",
			missingFileNameInstall: "⚠️ | Mangyaring maglagay ng file name para i-save (.js extension)",
			invalidUrlOrCode: "⚠️ | Hindi makuha ang command code",
			alreadExist: "⚠️ | Mayroon na ang command file, gusto mo bang palitan?\nI-react ang mensaheng ito para magpatuloy",
			installed: "✅ | Matagumpay na na-install ang command na \"%1\", na-save sa %2",
			installedError: "❌ | Nabigo sa pag-install ng command na \"%1\"\n%2: %3",
			missingFile: "⚠️ | Hindi nahanap ang command file na \"%1\"",
			invalidFileName: "⚠️ | Mali ang command file name",
			unloadedFile: "✅ | Na-unload ang command na \"%1\""
		}
	},
	count: {
		description: "Tingnan ang bilang ng mensahe ng lahat ng miyembro o iyong sarili",
		guide: "   {pn}: Tingnan ang iyong mensahe\n   {pn} @tag: Tingnan ang mensahe ng na-tag\n   {pn} all: Tingnan ang mensahe ng lahat",
		text: {
			count: "Bilang ng mensahe ng mga miyembro:",
			endMessage: "Ang mga wala sa listahan ay hindi pa nagpadala ng mensahe.",
			page: "Pahina [%1/%2]",
			reply: "I-reply ang mensaheng ito na may bilang ng pahina para makita ang higit pa",
			result: "%1 rank %2 na may %3 mensahe",
			yourResult: "Ikaw ay nasa rank %1 at nagpadala ng %2 mensahe sa grupong ito",
			invalidPage: "Mali ang bilang ng pahina"
		}
	},
	eval: {
		description: "Subukan ang code nang mabilis",
		guide: "{pn} <code na susubukan>",
		text: {
			error: "❌ May naganap na error:"
		}
	},
	filteruser: {
		description: "I-filter ang mga miyembro ng grupo ayon sa bilang ng mensahe o naka-lock na account",
		guide: "   {pn} [<bilang ng mensahe> | die]",
		text: {
			needAdmin: "⚠️ | Mangyaring idagdag ang bot bilang admin ng grupo para gamitin ang command na ito",
			confirm: "⚠️ | Sigurado ka bang gusto mong tanggalin ang mga miyembro na may wala pang %1 mensahe?\nI-react ang mensaheng ito para kumpirmahin",
			kickByBlock: "✅ | Matagumpay na natanggal ang %1 miyembro na may naka-lock na account",
			kickByMsg: "✅ | Matagumpay na natanggal ang %1 miyembro na may wala pang %2 mensahe",
			kickError: "❌ | May naganap na error at hindi matatanggal ang %1 miyembro:\n%2",
			noBlock: "✅ | Walang miyembro na may naka-lock na account",
			noMsg: "✅ | Walang miyembro na may wala pang %1 mensahe"
		}
	},
	getfbstate: {
		description: "Kunin ang kasalukuyang fbstate",
		guide: "{pn}",
		text: {
			success: "Naipadala ang fbstate sa iyo, tingnan ang private message ng bot"
		}
	},
	help: {
		description: "Tingnan ang paggamit ng command",
		guide: "{pn} [empty | <bilang ng pahina> | <pangalan ng command>]",
		text: {
			help: "╭─────────────⭓\n%1\n├─────⭔\n│ Pahina [ %2/%3 ]\n│ Kasalukuyang, ang bot ay may %4 commands na magagamit\n│ » I-type ang %5help <pahina> para sa listahan\n│ » I-type ang %5help <command> para sa detalye\n├────────⭔\n│ %6\n╰─────────────⭓",
			help2: "%1├───────⭔\n│ » Kasalukuyang, ang bot ay may %2 commands na magagamit\n│ » I-type ang %3help <command name> para sa detalye\n│ %4\n╰─────────────⭓",
			commandNotFound: "Hindi umiiral ang command na \"%1\"",
			getInfoCommand: "╭── PANGALAN ────⭓\n│ %1\n├── IMPORMASYON\n│ Paglalarawan: %2\n│ Ibang pangalan: %3\n│ Ibang pangalan sa inyong grupo: %4\n│ Bersyon: %5\n│ Role: %6\n│ Oras bawat command: %7s\n│ May-akda: %8\n├── PAGGAMIT\n%9\n├── MGA TALA\n│ Ang nilalaman sa loob ng <XXXXX> ay maaaring baguhin\n│ Ang nilalaman sa loob ng [a|b|c] ay a o b o c\n╰──────⭔",
			doNotHave: "Wala",
			roleText0: "0 (Lahat ng user)",
			roleText1: "1 (Mga admin ng grupo)",
			roleText2: "2 (Admin ng bot)",
			roleText0setRole: "0 (set role, lahat ng user)",
			roleText1setRole: "1 (set role, mga admin ng grupo)",
			pageNotFound: "Hindi umiiral ang pahina %1"
		}
	},
	kick: {
		description: "Alisin ang miyembro sa chat box",
		guide: "{pn} @tags: alisin ang mga na-tag na miyembro"
	},
	moon: {
		description: "Tingnan ang moon image sa petsang pinili mo",
		guide: "  {pn} <araw/buwan/taon>\n   {pn} <araw/buwan/taon> <caption>",
		text: {
			invalidDateFormat: "Mangyaring maglagay ng valid na petsa sa DD/MM/YYYY format",
			error: "May naganap na error habang kinukuha ang moon image ng %1",
			invalidDate: "%1 ay hindi valid na petsa",
			caption: "- Moon image noong %1"
		}
	},
	notification: {
		description: "Magpadala ng notification mula sa admin papunta sa lahat ng box",
		guide: "{pn} <mensahe>",
		text: {
			missingMessage: "Mangyaring maglagay ng mensaheng ipapadala sa lahat ng grupo",
			notification: "Notification mula sa admin bot sa lahat ng chat group (huwag i-reply ang mensaheng ito)",
			sendingNotification: "Nagsisimulang magpadala ng notification sa %1 chat group",
			sentNotification: "✅ Matagumpay na naipadala ang notification sa %1 grupo",
			errorSendingNotification: "May naganap na error habang nagpapadala sa %1 grupo:\n %2"
		}
	},
	prefix: {
		description: "Baguhin ang prefix ng bot",
		guide: "   {pn} <bagong prefix>: baguhin ang prefix sa iyong box chat\n   {pn} <bagong prefix> -g: baguhin ang prefix ng system bot (admin lamang)\n   {pn} reset: ibalik sa default na prefix",
		text: {
			reset: "Ang iyong prefix ay na-reset sa default: %1",
			onlyAdmin: "Admin lang ang makakapagbago ng prefix ng system bot",
			confirmGlobal: "Mangyaring i-react ang mensaheng ito para kumpirmahin ang pagbabago ng prefix ng system bot",
			confirmThisThread: "Mangyaring i-react ang mensaheng ito para kumpirmahin ang pagbabago ng prefix sa iyong box chat",
			successGlobal: "Nabago ang prefix ng system bot sa: %1",
			successThisThread: "Nabago ang prefix sa iyong box chat sa: %1",
			myPrefix: "🌐 System prefix: %1\n🛸 Prefix ng iyong box chat: %2"
		}
	},
	rank: {
		description: "Tingnan ang iyong level o level ng na-tag na tao"
	},
	rankup: {
		description: "I-on/off ang level up notification",
		guide: "{pn} [on | off]",
		text: {
			syntaxError: "Mali ang syntax, gamitin lamang ang {pn} on o {pn} off",
			turnedOn: "Naka-on na ang level up notification",
			turnedOff: "Naka-off na ang level up notification",
			notiMessage: "🎉🎉 Binabati kita sa pag-abot ng level %1"
		}
	},
	refresh: {
		description: "I-refresh ang impormasyon ng group chat o user",
		guide: "   {pn} [thread | group]: i-refresh ang impormasyon ng iyong group chat\n   {pn} user: i-refresh ang impormasyon ng iyong user",
		text: {
			refreshMyThreadSuccess: "✅ | Matagumpay na na-refresh ang impormasyon ng iyong group chat!",
			refreshThreadTargetSuccess: "✅ | Matagumpay na na-refresh ang impormasyon ng group chat %1!"
		}
	},
	setavt: {
		description: "Baguhin ang avatar ng bot",
		text: {
			cannotGetImage: "❌ | May naganap na error habang kinu-query ang image url",
			invalidImageFormat: "❌ | Mali ang format ng image",
			changedAvatar: "✅ | Matagumpay na nabago ang avatar ng bot"
		}
	},
	setlang: {
		description: "I-set ang default na wika ng bot para sa kasalukuyang chat o lahat ng chat",
		guide: "   {pn} <language code ISO 639-1>\n   Halimbawa:    {pn} en    {pn} tl    {pn} bn",
		text: {
			setLangForAll: "Na-set ang default na wika para sa lahat ng chat: %1",
			setLangForCurrent: "Na-set ang default na wika para sa kasalukuyang chat: %1",
			noPermission: "Admin lang ng bot ang makakapagamit ng command na ito",
			langNotFound: "Hindi mahanap ang wika: %1"
		}
	},
	simsimi: {
		description: "Makipag-chat kay Simsimi",
		guide: "   {pn} [on | off]: i-on/off ang simsimi\n   {pn} <salita>: makipag-chat kay simsimi",
		text: {
			turnedOn: "Matagumpay na naka-on ang simsimi!",
			turnedOff: "Matagumpay na naka-off ang simsimi!",
			chatting: "Nakikipag-chat kay simsimi...",
			error: "Abala si simsimi, subukan muli mamaya"
		}
	},
	tid: {
		description: "Tingnan ang threadID ng iyong group chat",
		guide: "{pn}"
	},
	tik: {
		description: "Mag-download ng video/audio mula sa TikTok link",
		guide: "   {pn} [video|-v] <url>: mag-download ng video\n   {pn} [audio|-a] <url>: mag-download ng audio",
		text: {
			invalidUrl: "Mangyaring maglagay ng valid na TikTok url",
			downloadingVideo: "Dina-download ang video: %1...",
			downloadedSlide: "Na-download ang slide: %1\n%2",
			downloadedVideo: "Na-download ang video: %1\nDownload Url: %2",
			downloadingAudio: "Dina-download ang audio: %1...",
			downloadedAudio: "Na-download ang audio: %1"
		}
	},
	uid: {
		description: "Tingnan ang Facebook user id ng user",
		guide: "   {pn}: tingnan ang iyong Facebook user id\n   {pn} @tag: tingnan ang uid ng na-tag\n   {pn} <profile link>: tingnan ang uid ng profile link",
		text: {
			syntaxError: "Mangyaring i-tag ang taong gusto mong tingnan ang uid o iwanang blangko para sa iyong sarili"
		}
	},
	unsend: {
		description: "I-unsend ang mensahe ng bot",
		guide: "i-reply ang mensaheng gusto mong i-unsend at tawagin ang command na {pn}",
		text: {
			syntaxError: "Mangyaring i-reply ang mensaheng gusto mong i-unsend"
		}
	},
	videofb: {
		description: "Mag-download ng video/story mula sa Facebook (pampubliko)",
		guide: "   {pn} <url ng video/story>",
		text: {
			missingUrl: "Mangyaring maglagay ng Facebook video/story (pampubliko) url",
			error: "May naganap na error habang dina-download ang video",
			downloading: "Dina-download ang video para sa iyo",
			tooLarge: "Paumanhin, hindi ma-download ang video dahil mas malaki ito sa 83MB"
		}
	},
	warn: {
		description: "Babalaan ang miyembro ng grupo, kapag 3 na babala ay maba-ban siya",
		guide: "   {pn} @tag <dahilan>: magbabala\n   {pn} list: listahan ng binabalaang miyembro\n   {pn} unban <uid>: i-unban ang miyembro",
		text: {
			list: "Listahan ng mga miyembro na nakatanggap ng babala:\n%1",
			listBan: "Listahan ng mga miyembro na nakatanggap ng 3 babala at na-ban:\n%1",
			listEmpty: "Walang miyembro sa iyong grupo na nakatanggap ng babala",
			listBanEmpty: "Walang miyembro sa iyong grupo na na-ban",
			noPermission: "❌ Admin lang ng grupo ang makakapag-unban ng na-ban na miyembro",
			unbanSuccess: "✅ Matagumpay na na-unban ang miyembro [%1 | %2]",
			noPermission2: "❌ Admin lang ng grupo ang makakapag-alis ng babala",
			noPermission3: "❌ Admin lang ng grupo ang makakapag-reset ng data ng babala",
			resetWarnSuccess: "✅ Matagumpay na na-reset ang data ng babala",
			noPermission4: "❌ Admin lang ng grupo ang makakapagbabala sa mga miyembro",
			warnSuccess: "⚠️ Binabala ang miyembro nang %1 beses %2\n- Uid: %3\n- Dahilan: %4\n- Petsa: %5\nNakatanggap ng 3 babala ang miyembro at na-ban na",
			warnSuccess2: "⚠️ Binabala ang miyembro nang %1 beses %2\n- Uid: %3\n- Dahilan: %4\n- Petsa: %5\nKapag lumabag pa nang %6 beses ay maba-ban siya"
		}
	},
	weather: {
		description: "Tingnan ang kasalukuyan at susunod na 5 araw na panahon",
		guide: "{pn} <lokasyon>",
		text: {
			syntaxError: "Mangyaring maglagay ng lokasyon",
			notFound: "Hindi nahanap ang lokasyon: %1",
			error: "May naganap na error: %1",
			today: "Panahon ngayon:\n%1\n🌡 Mababang - mataas na temperatura %2°C - %3°C\n🌡 Pakiramdam na %4°C - %5°C\n🌅 Sunrise %6\n🌄 Sunset %7\n🌃 Moonrise %8\n🏙️ Moonset %9\n🌞 Araw: %10\n🌙 Gabi: %11"
		}
	},
	ytb: {
		description: "Mag-download ng video/audio o tingnan ang impormasyon ng YouTube",
		guide: "   {pn} [video|-v] [<pangalan>|<link>]: mag-download ng video\n   {pn} [audio|-a] [<pangalan>|<link>]: mag-download ng audio\n   {pn} [info|-i] [<pangalan>|<link>]: tingnan ang impormasyon ng video",
		text: {
			error: "May naganap na error: %1",
			noResult: "Walang nahanap na resulta para sa keyword na %1",
			choose: "%1I-reply ang mensaheng ito na may numero para pumili o anumang nilalaman para kanselahin",
			downloading: "Dina-download ang video %1",
			noVideo: "Paumanhin, walang nahanap na video na mas maliit sa 83MB",
			downloadingAudio: "Dina-download ang audio %1",
			noAudio: "Paumanhin, walang nahanap na audio na mas maliit sa 26MB",
			info: "💠 Pamagat: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Oras ng video: %4\n👀 View: %5\n👍 Like: %6\n🆙 Petsa ng pag-upload: %7\n🔠 ID: %8\n🔗 Link: %9",
			listChapter: "\n📖 Listahan ng chapter: %1\n"
		}
	}
};
