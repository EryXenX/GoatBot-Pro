module.exports = {
	onlyadminbox: {
		description: "Sirf group admin ke liye bot use on/off karein",
		guide: "   {pn} [on | off]",
		text: {
			turnedOn: "Group admin sirf mode on hua",
			turnedOff: "Group admin sirf mode off hua",
			syntaxError: "Syntax error, sirf {pn} on ya {pn} off use karein"
		}
	},
	adduser: {
		description: "User ko apne box chat mein add karein",
		guide: "   {pn} [profile link | uid]",
		text: {
			alreadyInGroup: "Pehle se group mein hai",
			successAdd: "- %1 member successfully add hue",
			failedAdd: "- %1 member add karne mein fail raha",
			approve: "- %1 member approval list mein add hue",
			invalidLink: "Kripya valid Facebook link darj karein",
			cannotGetUid: "Is user ka uid prapt nahi kiya ja saka",
			linkNotExist: "Yeh profile url exist nahi karta",
			cannotAddUser: "Bot blocked hai ya user ne strangers ko group mein add karne se roka hai"
		}
	},
	admin: {
		description: "Admin role add, remove, edit karein",
		guide: "   {pn} [add | -a] <uid>: User ko admin role dein\n\t  {pn} [remove | -r] <uid>: User ki admin role hatayein\n\t  {pn} [list | -l]: Sabhi admin ki list dekhein",
		text: {
			added: "✅ | %1 users ko admin role di gayi:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users ke paas pehle se admin role hai:\n%2",
			missingIdAdd: "⚠️ | Admin role dene ke liye ID ya tag karein",
			removed: "✅ | %1 users ki admin role hataayi gayi:\n%2",
			notAdmin: "⚠️ | %1 users ke paas admin role nahi hai:\n%2",
			missingIdRemove: "⚠️ | Admin role hatane ke liye ID ya tag karein",
			listAdmin: "👑 | Admin ki list:\n%1"
		}
	},
	adminonly: {
		description: "Sirf admin ke liye bot use on/off karein",
		guide: "{pn} [on | off]",
		text: {
			turnedOn: "Sirf admin mode on hua",
			turnedOff: "Sirf admin mode off hua",
			syntaxError: "Syntax error, sirf {pn} on ya {pn} off use karein"
		}
	},
	all: {
		description: "Group chat ke sabhi members ko tag karein",
		guide: "{pn} [content | empty]"
	},
	anime: {
		description: "Random anime image",
		guide: "{pn} <endpoint>\n   Endpoint list: neko, kitsune, hug, pat, waifu, cry, kiss, slap, smug, punch",
		text: {
			loading: "Image taiyar ho rahi hai, kripya wait karein...",
			error: "Error aayi, baad mein dobara try karein"
		}
	},
	antichangeinfobox: {
		description: "Box info badlne se rokna on/off karein",
		guide: "   {pn} avt [on | off]: avatar badlne se rokein\n   {pn} name [on | off]: naam badlne se rokein\n   {pn} theme [on | off]: theme badlne se rokein\n   {pn} emoji [on | off]: emoji badlne se rokein",
		text: {
			antiChangeAvatarOn: "Avatar badlne se rokna on hua",
			antiChangeAvatarOff: "Avatar badlne se rokna off hua",
			missingAvt: "Aapne chat box ke liye avatar set nahi kiya",
			antiChangeNameOn: "Naam badlne se rokna on hua",
			antiChangeNameOff: "Naam badlne se rokna off hua",
			antiChangeThemeOn: "Theme badlne se rokna on hua",
			antiChangeThemeOff: "Theme badlne se rokna off hua",
			antiChangeEmojiOn: "Emoji badlne se rokna on hua",
			antiChangeEmojiOff: "Emoji badlne se rokna off hua",
			antiChangeAvatarAlreadyOn: "Aapka chat box pehle se avatar badlne se roka hua hai",
			antiChangeNameAlreadyOn: "Aapka chat box pehle se naam badlne se roka hua hai",
			antiChangeThemeAlreadyOn: "Aapka chat box pehle se theme badlne se roka hua hai",
			antiChangeEmojiAlreadyOn: "Aapka chat box pehle se emoji badlne se roka hua hai"
		}
	},
	appstore: {
		description: "Appstore par app search karein",
		text: {
			missingKeyword: "Aapne koi keyword darj nahi kiya",
			noResult: "%1 keyword ke liye koi result nahi mila"
		}
	},
	autosetname: {
		description: "Naye member ka nickname automatically badlein",
		guide: "   {pn} set <nickname>: Auto nickname ke liye config set karein\n   {pn} [on | off]: Feature on/off karein\n   {pn} [view | info]: Current config dekhein",
		text: {
			missingConfig: "Kripya zaroori configuration darj karein",
			configSuccess: "Configuration successfully set hui",
			currentConfig: "Aapke group ki current autoSetName config:\n%1",
			notSetConfig: "Aapke group ne autoSetName config set nahi ki",
			syntaxError: "Syntax error, sirf \"{pn} on\" ya \"{pn} off\" use karein",
			turnOnSuccess: "AutoSetName feature on hua",
			turnOffSuccess: "AutoSetName feature off hua",
			error: "AutoSetName feature use karte waqt error aayi"
		}
	},
	badwords: {
		description: "Banned words warning on/off/add/remove karein",
		guide: "   {pn} add <words>: Banned words add karein\n   {pn} delete <words>: Banned words hatayein\n   {pn} list: List dekhein\n   {pn} on: On karein\n   {pn} off: Off karein",
		text: {
			onText: "on",
			offText: "off",
			onlyAdmin: "⚠️ | Sirf admin hi banned words add kar sakte hain",
			missingWords: "⚠️ | Aapne banned words darj nahi kiye",
			addedSuccess: "✅ | %1 banned words list mein add hue",
			alreadyExist: "❌ | %1 banned words pehle se list mein hain: %2",
			tooShort: "⚠️ | %1 banned words 2 character se chhote hain: %2",
			onlyAdmin2: "⚠️ | Sirf admin hi banned words hata sakte hain",
			missingWords2: "⚠️ | Hatane ke liye words darj nahi kiye",
			deletedSuccess: "✅ | %1 banned words list se hataye gaye",
			notExist: "❌ | %1 banned words list mein nahi hain: %2",
			emptyList: "⚠️ | Aapke group ki banned words list khali hai",
			badWordsList: "📑 | Aapke group ki banned words list: %1",
			onlyAdmin3: "⚠️ | Sirf admin hi %1 kar sakte hain",
			turnedOnOrOff: "✅ | Banned words warning %1 hui",
			onlyAdmin4: "⚠️ | Sirf admin hi banned words warning hata sakte hain",
			missingTarget: "⚠️ | User ID ya tag darj nahi kiya",
			notWarned: "⚠️ | User %1 ko banned words ke liye warning nahi di gayi",
			removedWarn: "✅ | User %1 | %2 ki 1 banned words warning hataayi gayi",
			warned: "⚠️ | Aapke message mein banned word \"%1\" mila, dobara karne par group se nikala jayega.",
			warned2: "⚠️ | Aapke message mein banned word \"%1\" mila, aap 2 baar violation kar chuke hain.",
			needAdmin: "Bot ko banned members kick karne ke liye admin privilege chahiye",
			unwarned: "✅ | User %1 | %2 ki banned words warning hataayi gayi"
		}
	},
	balance: {
		description: "Apna ya tagged person ka balance dekhein",
		guide: "   {pn}: Apna balance dekhein\n   {pn} <@tag>: Tagged person ka balance dekhein",
		text: {
			money: "Aapke paas %1$ hai",
			moneyOf: "%1 ke paas %2$ hai"
		}
	},
	ban: {
		description: "User ya thread ko ban/unban karein",
		text: {
			notFoundTarget: "⚠️ | Jise ban karna hai use tag karein ya uid/fb link darj karein",
			notFoundTargetUnban: "⚠️ | Jise unban karna hai use tag karein ya uid/fb link darj karein",
			bannedSuccess: "✅ | %1 user ko ban kiya gaya, karan: %2",
			unbannedSuccess: "✅ | %1 user ko unban kiya gaya",
			listBanned: "📋 | Ban kiye gaye users ki list:\n%1",
			noListBanned: "📋 | Koi ban kiya hua user nahi hai",
			alreadyBanned: "⚠️ | User pehle se ban hai, karan: %1",
			notBanned: "⚠️ | User ban nahi hai",
			banThread: "✅ | Thread %1 ban kiya gaya, karan: %2",
			unbanThread: "✅ | Thread %1 unban kiya gaya",
			alreadyBannedThread: "⚠️ | Thread pehle se ban hai, karan: %1",
			notBannedThread: "⚠️ | Thread ban nahi hai",
			listBannedThread: "📋 | Ban kiye gaye threads ki list:\n%1",
			noListBannedThread: "📋 | Koi ban kiya hua thread nahi hai"
		}
	},
	busy: {
		description: "Do not disturb mode on karein",
		guide: "   {pn} [empty | <karan>]: Do not disturb on karein\n   {pn} off: Off karein",
		text: {
			turnedOff: "✅ | Do not disturb mode off hua",
			turnedOn: "✅ | Do not disturb mode on hua",
			turnedOnWithReason: "✅ | Do not disturb mode karan ke saath on hua: %1",
			alreadyOn: "User %1 abhi busy hai",
			alreadyOnWithReason: "User %1 abhi busy hai, karan: %2"
		}
	},
	callad: {
		description: "Admin bot ko report/feedback/bug bhejein",
		guide: "   {pn} <message>",
		text: {
			missingMessage: "Kripya admin ko bhejna ka message darj karein",
			sendByGroup: "\n- Group se bheja: %1\n- Thread ID: %2",
			sendByUser: "\n- User se bheja",
			content: "\n\nContent:\n─────────────────\n%1\n─────────────────\nUser ko message bhejne ke liye is message par reply karein",
			success: "Aapka message admin ko successfully bheja gaya!",
			reply: "📍 Admin %1 ka reply:\n─────────────────\n%2\n─────────────────\nAdmin ko reply karne ke liye is message par reply karein",
			replySuccess: "Aapka reply admin ko successfully bheja gaya!",
			feedback: "📝 User %1 ka Feedback:\n- User ID: %2%3\n\nContent:\n─────────────────\n%4\n─────────────────\nUser ko message bhejne ke liye is message par reply karein",
			replyUserSuccess: "Aapka reply user ko successfully bheja gaya!"
		}
	},
	cmd: {
		description: "Command files manage karein",
		guide: "{pn} load <command file name>\n{pn} loadAll\n{pn} install <url> <command file name>",
		text: {
			missingFileName: "⚠️ | Reload karne ka command name darj karein",
			loaded: "✅ | Command \"%1\" successfully load hua",
			loadedError: "❌ | Command \"%1\" load karne mein fail\n%2: %3",
			loadedSuccess: "✅ | \"%1\" command successfully load hua",
			loadedFail: "❌ | \"%1\" command load karne mein fail\n%2",
			missingCommandNameUnload: "⚠️ | Unload karne ka command name darj karein",
			unloaded: "✅ | Command \"%1\" successfully unload hua",
			unloadedError: "❌ | Command \"%1\" unload karne mein fail\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Install karne ka url/code aur file name darj karein",
			missingUrlOrCode: "⚠️ | Command file ka url ya code darj karein",
			missingFileNameInstall: "⚠️ | Save karne ka file name darj karein (.js extension ke saath)",
			invalidUrlOrCode: "⚠️ | Command code prapt nahi kiya ja saka",
			alreadExist: "⚠️ | Command file pehle se exist karta hai, overwrite karna chahte hain?\nIs message par react karein",
			installed: "✅ | Command \"%1\" successfully install hua, file %2 par save hui",
			installedError: "❌ | Command \"%1\" install karne mein fail\n%2: %3",
			missingFile: "⚠️ | Command file \"%1\" nahi mili",
			invalidFileName: "⚠️ | Command file ka naam invalid hai",
			unloadedFile: "✅ | Command \"%1\" unload hua"
		}
	},
	count: {
		description: "Sabhi members ya apne messages ka count dekhein",
		guide: "   {pn}: Apne messages dekhein\n   {pn} @tag: Tagged ka count dekhein\n   {pn} all: Sabka count dekhein",
		text: {
			count: "Members ke messages ka count:",
			endMessage: "Jo list mein nahi hain unhone koi message nahi bheja.",
			page: "Page [%1/%2]",
			reply: "Zyada dekhne ke liye page number ke saath reply karein",
			result: "%1 rank %2 with %3 messages",
			yourResult: "Aap rank %1 par hain aur is group mein %2 messages bheje hain",
			invalidPage: "Invalid page number"
		}
	},
	eval: {
		description: "Code turant test karein",
		guide: "{pn} <code to test>",
		text: {
			error: "❌ Error aayi:"
		}
	},
	filteruser: {
		description: "Message count ya locked account ke anusar group members ko filter karein",
		guide: "   {pn} [<number of messages> | die]",
		text: {
			needAdmin: "⚠️ | Is command ka use karne ke liye bot ko group admin banayein",
			confirm: "⚠️ | Kya aap %1 se kam messages wale members ko hatana chahte hain?\nIs message par react karein",
			kickByBlock: "✅ | %1 locked account members successfully hataye gaye",
			kickByMsg: "✅ | %1 members jinke %2 se kam messages the, successfully hataye gaye",
			kickError: "❌ | %1 members ko kick karne mein error:\n%2",
			noBlock: "✅ | Koi locked account member nahi hai",
			noMsg: "✅ | %1 se kam messages wale koi member nahi hain"
		}
	},
	getfbstate: {
		description: "Current fbstate prapt karein",
		guide: "{pn}",
		text: {
			success: "Fbstate aapko bheja gaya, bot ka private message check karein"
		}
	},
	grouptag: {
		description: "Group tag manage karein",
		text: {
			noGroupTagName: "Group tag ka naam darj karein",
			noMention: "Group tag mein jodne ke liye koi member tag nahi kiya",
			addedSuccess: "Group tag \"%1\" mein members jode gaye:\n%2",
			addedSuccess2: "Group tag \"%1\" mein members jode gaye",
			alreadyExist: "Group tag \"%1\" pehle se exist karta hai",
			notExist: "Group tag \"%1\" exist nahi karta",
			deletedSuccess: "Group tag \"%1\" hataya gaya",
			listGroupTag: "Group tags ki list:\n%1",
			noGroupTag: "Koi group tag nahi hai",
			removedSuccess: "Group tag \"%1\" se %2 members hataye gaye",
			notInGroupTag: "Group tag \"%1\" mein ye members nahi hain:\n%2"
		}
	},
	guessnumber: {
		description: "Number guess karne ka game",
		text: {
			charts: "🏆 | Ranking:\n%1",
			pageInfo: "Page %1/%2",
			noScore: "⭕ | Kisi ne bhi score nahi kiya.",
			noPermissionReset: "⚠️ | Aapko ranking reset karne ki anumati nahi hai.",
			resetSuccess: "✅ | Ranking successfully reset hui.",
			start: "1 se %1 ke beech koi number guess karein!\nAapke paas %2 mauke hain.",
			correct: "✅ | Badhai ho! Aapne %1 mauke mein sahi number guess kiya.",
			wrong: "❌ | %1 se %2 ke beech try karein. %3 mauke baki.",
			over: "❌ | Aapke sabhi mauke khatam ho gaye. Sahi number %1 tha."
		}
	},
	help: {
		description: "Command ka use dekhein",
		guide: "{pn} [empty | <page number> | <command name>]",
		text: {
			help: "╭─────────────⭓\n%1\n├─────⭔\n│ Page [ %2/%3 ]\n│ Abhi bot mein %4 commands available hain\n│ » %5help <page> type karein command list dekhne ke liye\n│ » %5help <command> type karein command details dekhne ke liye\n├────────⭔\n│ %6\n╰─────────────⭓",
			help2: "%1├───────⭔\n│ » Abhi bot mein %2 commands available hain\n│ » %3help <command name> type karein details dekhne ke liye\n│ %4\n╰─────────────⭓",
			commandNotFound: "Command \"%1\" exist nahi karta",
			getInfoCommand: "╭── Naam ────⭓\n│ %1\n├── Jankari\n│ Vivran: %2\n│ Anya naam: %3\n│ Group mein anya naam: %4\n│ Version: %5\n│ Role: %6\n│ Cooldown: %7s\n│ Lekhak: %8\n├── Use\n%9\n├── Notes\n│ <XXXXX> ke andar content badla ja sakta hai\n│ [a|b|c] mein se ek chunein\n╰──────⭔",
			doNotHave: "Nahi hai",
			roleText0: "0 (Sabhi users)",
			roleText1: "1 (Group administrator)",
			roleText2: "2 (Bot admin)",
			roleText0setRole: "0 (set role, sabhi users)",
			roleText1setRole: "1 (set role, group administrator)",
			pageNotFound: "Page %1 exist nahi karta"
		}
	},
	ignoreonlyad: {
		description: "Admin only ignore list manage karein",
		text: {
			missingCommandNameToAdd: "⚠️ Ignore list mein jodne ka command naam darj karein",
			missingCommandNameToDelete: "⚠️ Ignore list se hatane ka command naam darj karein",
			addedSuccess: "✅ Command \"%1\" ignore list mein joda gaya",
			deletedSuccess: "✅ Command \"%1\" ignore list se hataya gaya",
			alreadyExist: "⚠️ Command \"%1\" pehle se ignore list mein hai",
			notExist: "⚠️ Command \"%1\" ignore list mein nahi hai",
			listIgnore: "📋 Ignore list:\n%1",
			emptyList: "📋 Ignore list khali hai"
		}
	},
	ignoreonlyadbox: {
		description: "Admin box only ignore list manage karein",
		text: {
			missingCommandNameToAdd: "⚠️ Ignore list mein jodne ka command naam darj karein",
			missingCommandNameToDelete: "⚠️ Ignore list se hatane ka command naam darj karein",
			addedSuccess: "✅ Command \"%1\" ignore list mein joda gaya",
			deletedSuccess: "✅ Command \"%1\" ignore list se hataya gaya",
			alreadyExist: "⚠️ Command \"%1\" pehle se ignore list mein hai",
			notExist: "⚠️ Command \"%1\" ignore list mein nahi hai",
			listIgnore: "📋 Ignore list:\n%1",
			emptyList: "📋 Ignore list khali hai"
		}
	},
	jsontomongodb: {
		description: "JSON data ko MongoDB mein transfer karein",
		text: {
			invalidDatabase: "❌ Config mein database ko mongodb par switch karein phir bot restart karein",
			missingFile: "❌ Data file %1 database/data folder mein nahi mili",
			success: "✅ Data successfully mongodb mein transfer hua"
		}
	},
	jsontosqlite: {
		description: "JSON data ko SQLite mein transfer karein",
		text: {
			invalidDatabase: "❌ Config mein database ko sqlite par switch karein phir bot restart karein",
			missingFile: "❌ Data file %1 database/data folder mein nahi mili",
			success: "✅ Data successfully sqlite mein transfer hua"
		}
	},
	kick: {
		description: "Chat box se member hatayein",
		guide: "{pn} @tags: Tagged members ko kick karein",
		text: {
			needAdmin: "Is feature ka use karne se pehle bot ko admin banayein"
		}
	},
	loadconfig: {
		description: "Config reload karein",
		text: { success: "Config successfully reload hua" }
	},
	notification: {
		description: "Admin se sabhi box ko notification bhejein",
		guide: "{pn} <message>",
		text: {
			missingMessage: "Sabhi groups ko bhejna ka message darj karein",
			notification: "Admin bot se sabhi chat groups ko notification (is message par reply na karein)",
			sendingNotification: "%1 chat groups ko notification bhejna shuru ho raha hai",
			sentNotification: "✅ %1 groups ko notification successfully bheja gaya",
			errorSendingNotification: "%1 groups ko bhejne mein error:\n %2"
		}
	},
	prefix: {
		description: "Bot ka prefix badlein",
		guide: "   {pn} <new prefix>: Chat box mein prefix badlein\n   {pn} <new prefix> -g: System bot ka prefix badlein (sirf admin)\n   {pn} reset: Default prefix par wapas jayein",
		text: {
			reset: "Aapka prefix default par reset hua: %1",
			onlyAdmin: "Sirf admin hi system bot ka prefix badal sakte hain",
			confirmGlobal: "System bot ka prefix badlne ki pusti ke liye is message par react karein",
			confirmThisThread: "Chat box ka prefix badlne ki pusti ke liye is message par react karein",
			successGlobal: "System bot ka prefix badla: %1",
			successThisThread: "Chat box ka prefix badla: %1",
			myPrefix: "🌐 System prefix: %1\n🛸 Chat box prefix: %2"
		}
	},
	rankup: {
		description: "Level up notification on/off karein",
		guide: "{pn} [on | off]",
		text: {
			syntaxError: "Syntax error, sirf {pn} on ya {pn} off use karein",
			turnedOn: "Level up notification on hui",
			turnedOff: "Level up notification off hui",
			notiMessage: "🎉🎉 Badhai ho! Aap level %1 par pahunch gaye"
		}
	},
	refresh: {
		description: "Group chat ya user ki jankari refresh karein",
		guide: "   {pn} [thread | group]: Apne group chat ki jankari refresh karein\n   {pn} user: Apne user ki jankari refresh karein",
		text: {
			refreshMyThreadSuccess: "✅ | Aapke group chat ki jankari successfully refresh hui!",
			refreshThreadTargetSuccess: "✅ | Group chat %1 ki jankari successfully refresh hui!",
			errorRefreshMyThread: "❌ | Aapke group chat ki jankari refresh karne mein error!",
			errorRefreshThreadTarget: "❌ | Group chat %1 ki jankari refresh karne mein error!"
		}
	},
	restart: {
		description: "Bot restart karein",
		text: { restartting: "🔄 | Bot restart ho raha hai..." }
	},
	rules: {
		description: "Group rules manage karein",
		text: {
			yourRules: "Aapke group ke rules\n%1",
			noRules: "Aapke group mein koi rule nahi hai, jodne ke liye `%1rules add` use karein",
			noPermissionAdd: "Sirf admin hi group rules jod sakte hain",
			noContent: "Jodne ka rule content darj karein",
			success: "Naya group rule successfully joda gaya",
			noPermissionEdit: "Sirf admin hi group rules edit kar sakte hain",
			invalidNumber: "Edit karne ka rule number darj karein",
			rulesNotExist: "Rule number %1 exist nahi karta",
			numberRules: "Aapke group mein sirf %1 rules hain",
			noContentEdit: "Rule number %1 ka naya content darj karein",
			successEdit: "Rule number %1 badla gaya: %2",
			noPermissionMove: "Sirf admin hi rules move kar sakte hain",
			invalidNumberMove: "Swap karne ke liye 2 rule number darj karein",
			sameNumberMove: "2 ek samaan rules ki position swap nahi ki ja sakti",
			rulesNotExistMove2: "Rule number %1 aur %2 exist nahi karte",
			successMove: "Rule number %1 aur %2 ki position swap hui",
			noPermissionDelete: "Sirf admin hi rules delete kar sakte hain",
			invalidNumberDelete: "Delete karne ka rule number darj karein",
			rulesNotExistDelete: "Rule number %1 exist nahi karta",
			successDelete: "Group ka rule number %1 hataya gaya, content: %2",
			noPermissionRemove: "Sirf group admin hi sabhi rules hata sakte hain",
			confirmRemove: "⚠️ Sabhi group rules hatane ki pusti ke liye react karein",
			successRemove: "Sabhi group rules successfully hataye gaye",
			invalidNumberView: "Dekhne ka rule number darj karein"
		}
	},
	sendnoti: {
		description: "Users ko notification bhejein",
		text: {
			missingMessage: "Bhejna ka message darj karein",
			success: "✅ %1 users ko notification successfully bheja gaya",
			error: "❌ %1 users ko bhejne mein error"
		}
	},
	setalias: {
		description: "Command alias set karein",
		text: {
			commandNotExist: "❌ Command \"%1\" exist nahi karta",
			aliasExist: "❌ Alias \"%1\" pehle se Command \"%2\" ke liye exist karta hai",
			addAliasSuccess: "✅ Alias \"%1\" Command \"%2\" ke liye joda gaya",
			noPermissionAdd: "❌ Alias \"%1\" jodne ki anumati nahi hai",
			deleteAliasSuccess: "✅ Alias \"%1\" hataya gaya",
			aliasNotExist: "❌ Alias \"%1\" exist nahi karta",
			noPermissionDelete: "❌ Alias hatane ki anumati nahi hai"
		}
	},
	setavt: {
		description: "Bot ka avatar badlein",
		text: {
			cannotGetImage: "❌ | Image url query karne mein error aayi",
			invalidImageFormat: "❌ | Image format invalid hai",
			changedAvatar: "✅ | Bot ka avatar successfully badla gaya"
		}
	},
	setlang: {
		description: "Current chat ya sabhi chats ke liye bot ki default language set karein",
		guide: "   {pn} <language code ISO 639-1>\n   Example:    {pn} en    {pn} hi    {pn} bn",
		text: {
			setLangForAll: "Sabhi chats ke liye default language set hui: %1",
			setLangForCurrent: "Current chat ke liye default language set hui: %1",
			noPermission: "Sirf bot admin hi is command ka use kar sakte hain",
			langNotFound: "Language nahi mili: %1"
		}
	},
	setleave: {
		description: "Leave message on/off/configure karein",
		text: {
			turnedOn: "Leave message on hua",
			turnedOff: "Leave message off hua",
			changedText: "Leave message text badla gaya: %1",
			resetText: "Leave message text default par reset hua"
		}
	},
	setname: {
		description: "Members ka nickname badlein",
		text: {
			success: "✅ Nickname successfully badla gaya",
			error: "❌ Nickname badlne mein error"
		}
	},
	setrankup: {
		description: "Rankup message ya image configure karein",
		text: {
			changedMessage: "Rankup message badla gaya: %1",
			missingAttachment: "Rankup image configure karne ke liye image attach karein",
			changedAttachment: "%1 attachment rankup mein successfully joda gaya"
		}
	},
	setrole: {
		description: "Command role set karein",
		text: {
			noEditedCommand: "✅ Aapke group mein koi edited command nahi hai",
			editedCommand: "⚠️ Aapke group mein edited commands hain:\n",
			noPermission: "❗ Sirf admin hi is command ka use kar sakte hain",
			commandNotFound: "Command \"%1\" nahi mila",
			noChangeRole: "❗ Command \"%1\" ka role nahi badla ja sakta",
			resetRole: "✅ Command \"%1\" ka role reset hua",
			changedRole: "✅ Command \"%1\" ka role %2 par set hua"
		}
	},
	setwelcome: {
		description: "Welcome message on/off/configure karein",
		text: {
			turnedOn: "Welcome message on hua",
			turnedOff: "Welcome message off hua",
			changedText: "Welcome message text badla gaya: %1",
			resetText: "Welcome message text default par reset hua"
		}
	},
	shortcut: {
		description: "Shortcut manage karein",
		text: {
			missingContent: "Message content darj karein",
			shortcutExists: "Shortcut \"%1\" pehle se exist karta hai, replace karne ke liye react karein",
			shortcutExistsByOther: "Shortcut %1 kisi aur ne joda hai, koi aur keyword try karein",
			added: "Shortcut joda gaya",
			replaced: "Shortcut replace hua",
			deleted: "Shortcut hataya gaya",
			notFound: "Shortcut nahi mila",
			listShortcut: "Shortcuts ki list:\n%1",
			emptyList: "Koi shortcut nahi hai"
		}
	},
	sorthelp: {
		description: "Help list sort karein",
		text: {
			savedName: "Help list naam ke anusar sort hui",
			savedCategory: "Help list category ke anusar sort hui"
		}
	},
	texttoimage: {
		description: "Text se image generate karein",
		text: {
			syntaxError: "⚠️ Prompt darj karein",
			error: "❗ Error aayi, baad mein dobara try karein:\n%1",
			serverError: "❗ Server overloaded hai, baad mein dobara try karein",
			missingGoatApiKey: "❗ GoatBot ke liye apikey set nahi hai"
		}
	},
	thread: {
		description: "Thread manage karein",
		text: {
			noPermission: "Aapko is feature ka use karne ki anumati nahi hai",
			found: "🔎 \"%2\" keyword se %1 group mile bot data mein:\n%3",
			notFound: "❌ Bot data mein \"%1\" keyword se koi group nahi mila",
			hasBanned: "ID [%1 | %2] wala group pehle ban hua:\n» Karan: %3",
			banned: "✅ Thread %1 ban kiya gaya, karan: %2",
			unbanned: "✅ Thread %1 unban kiya gaya",
			notBanned: "⚠️ Thread %1 ban nahi hai",
			alreadyBanned: "⚠️ Thread %1 pehle se ban hai"
		}
	},
	translate: {
		description: "Text translate karein",
		text: {
			translateTo: "🌐 %1 se %2 mein translate kiya gaya",
			invalidArgument: "❌ Invalid argument, on ya off chunein",
			turnOnTransWhenReaction: "✅ Reaction par translate on, kisi bhi message par react karein"
		}
	},
	unsend: {
		description: "Bot ka message unsend karein",
		guide: "Jis message ko unsend karna hai us par reply karein aur {pn} kahein",
		text: {
			syntaxError: "Kripya jis message ko unsend karna hai us par reply karein"
		}
	},
	update: {
		description: "Bot update karein",
		text: {
			noUpdates: "✅ | Aap GoatBot V2 (v%1) ka latest version use kar rahe hain.",
			updatePrompt: "💫 | Aap version %1 use kar rahe hain. Naya version %2 available hai. Update karna chahte hain?\n\n⬆️ | Ye files update hongi:\n%3%4"
		}
	},
	user: {
		description: "User manage karein",
		text: {
			noUserFound: "❌ Bot data mein \"%1\" keyword se koi user nahi mila",
			userFound: "🔎 Bot data mein \"%2\" keyword se %1 user mile:\n%3",
			uidRequired: "Ban karne ke liye uid darj karein",
			bannedSuccess: "✅ User %1 ban kiya gaya, karan: %2",
			unbannedSuccess: "✅ User %1 unban kiya gaya",
			notBanned: "⚠️ User %1 ban nahi hai",
			alreadyBanned: "⚠️ User %1 pehle se ban hai"
		}
	},
	warn: {
		description: "Group member ko warn karein, 3 warns par ban hoga",
		guide: "   {pn} @tag <karan>: Warn karein\n   {pn} list: Warned members ki list\n   {pn} unban <uid>: Unban karein",
		text: {
			list: "Warning pane wale members ki list:\n%1",
			listBan: "3 warning ke baad ban hue members ki list:\n%1",
			listEmpty: "Aapke group mein koi warned member nahi hai",
			listBanEmpty: "Aapke group mein koi banned member nahi hai",
			noPermission: "❌ Sirf group administrator hi ban hata sakte hain",
			unbanSuccess: "✅ Member [%1 | %2] unban hue",
			noPermission2: "❌ Sirf group administrator hi warnings hata sakte hain",
			noPermission3: "❌ Sirf group administrator hi warning data reset kar sakte hain",
			resetWarnSuccess: "✅ Warning data reset hua",
			noPermission4: "❌ Sirf group administrator hi warn kar sakte hain",
			warnSuccess: "⚠️ Member ko %1 baar warn kiya gaya %2\n- Uid: %3\n- Karan: %4\n- Date: %5\nIs member ko 3 baar warn kiya gaya aur ban ho gaye",
			warnSuccess2: "⚠️ Member ko %1 baar warn kiya gaya %2\n- Uid: %3\n- Karan: %4\n- Date: %5\n%6 aur violation par ban hoga"
		}
	},
	weather: {
		description: "Mausam ki jankari dekhein",
		guide: "{pn} <location>",
		text: {
			syntaxError: "Kripya location darj karein",
			notFound: "Location nahi mila: %1",
			error: "Error aayi: %1",
			today: "Aaj ka mausam: %1\n%2\n🌡 Temperature %3°C - %4°C\n🌡 Feels like %5°C - %6°C\n🌅 Sunrise %7\n🌄 Sunset %8\n🌃 Moonrise %9\n🏙️ Moonset %10\n🌞 Din: %11\n🌙 Raat: %12"
		}
	},
	wl: {
		description: "Whitelist manage karein",
		text: {
			toggledOn: "✅ | Whitelist mode on hua.",
			toggledOff: "❌ | Whitelist mode off hua.",
			currentStatus: "🔄 | Whitelist ki current status: %1",
			added: "✅ | %1 users ko whitelist role di gayi:\n%2",
			alreadyAdmin: "\n⚠ | %1 users ke paas pehle se role hai:\n%2",
			missingIdAdd: "⚠ | Role dene ke liye ID ya tag karein",
			removed: "✅ | %1 users ki role hataayi gayi:\n%2",
			notAdmin: "⚠ | %1 users ke paas role nahi hai:\n%2",
			missingIdRemove: "⚠ | Role hatane ke liye ID ya tag karein",
			listAdmin: "👑 | WhiteList ki list:\n%1"
		}
	}
};
