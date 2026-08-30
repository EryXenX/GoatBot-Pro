<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=700&size=18&duration=3000&pause=800&color=00FFD1&center=true&vCenter=true&width=700&lines=GoatBot-Pro;Facebook+Messenger+Bot+Framework;Built+on+Goat+Bot+V2+%E2%80%94+Modified+by+EryXenX;Fast+%E2%80%A2+Smart+%E2%80%A2+Reliable+%E2%80%A2+Powerful" />

<br/>

![Version](https://img.shields.io/badge/Version-2.0.0-00FFD1?style=for-the-badge&logo=github&logoColor=black)
![Node](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Base](https://img.shields.io/badge/Based_on-Goat_Bot_V2-FF6B6B?style=for-the-badge&logo=github&logoColor=white)
![Fork](https://img.shields.io/badge/Fork_by-EryXenX-9B59B6?style=for-the-badge&logo=github&logoColor=white)
![FCA](https://img.shields.io/badge/FCA-fca--eryxenx-00FFD1?style=for-the-badge&logoColor=black)

</div>

---

## ◈ About

Assalamu Alaikum! **GoatBot-Pro** is an enhanced fork of [Goat Bot V2](https://github.com/ntkhang03/Goat-Bot-V2) by **ntkhang03**, rebuilt and maintained by **EryXenX (Mohammad Akash)** with new features, multi-language support, and custom commands.

| Feature | Description |
|---|---|
| 🔌 **Custom FCA** | Uses `@eryxenx/fca` — patched fork with bug fixes and stability improvements |
| ⚙️ **Handler Improvements** | No-prefix system for bot admins, smart command suggestion |
| 🌐 **Multi-Language** | Supports EN, BN, HI, TL, AR, VI |
| 🎨 **UI Overhaul** | Redesigned message templates with clean formatting |
| 🛡️ **React Unsend** | Auto-unsend messages on specific emoji reactions |
| 🔧 **Setting Command** | Full bot config control via chat — no need to edit files manually |

> ⚠️ For educational purposes only. Any misuse or illegal activity is solely the user's responsibility.

---

## ◈ Support

<div align="center">

[![Messenger Group](https://img.shields.io/badge/Join%20Support%20Group-0084FF?style=for-the-badge&logo=messenger&logoColor=white)](https://m.me/j/AbayU2oh5OPVLvZm/?send_source=gc%3Acopy_invite_link_c)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com/EryXenX)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/EryXenX)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@EryXenX)
[![Telegram](https://img.shields.io/badge/Telegram-0088CC?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/EryXenX_Official)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/EryXenX)

</div>

---

## ◈ Credits

| Role | Person | Link |
|---|---|---|
| 🏆 **Original Creator** | NTKhang | [Goat Bot V2](https://github.com/ntkhang03/Goat-Bot-V2) |
| 🔧 **This Fork** | EryXenX | [GoatBot-Pro](https://github.com/EryXenX/GoatBot-Pro) |

> All core copyright belongs to **NTKhang (ntkhang03)**. This fork does not override the original license.

---

## ◈ Setup Tutorial

<div align="center">

### 📹 Watch Before You Start

<a href="https://youtu.be/gPf_BFhQz_w?si=-iknmkmFd_NcRahY">
  <img src="https://img.youtube.com/vi/gPf_BFhQz_w/maxresdefault.jpg" alt="GoatBot-Pro Setup Tutorial" width="680" />
</a>

<br/>

[![Watch Tutorial](https://img.shields.io/badge/▶%20Watch%20Full%20Setup%20Tutorial-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/gPf_BFhQz_w?si=-iknmkmFd_NcRahY)

</div>

---

## ◈ Setup

```bash
git clone https://github.com/EryXenX/GoatBot-Pro.git
cd GoatBot-Pro
npm install
node index.js
```

Add your Facebook cookies to `account.txt` (JSON array format from EditThisCookie), then configure `config.json`.

---

## ◈ Running the Bot

### 1. Add your admin UID

In `config.json`, add your Facebook UID to `adminBot` — this is the ID
that can control the bot from chat (admin-only commands, `{prefix}setting`,
no-prefix commands if enabled, etc.):

```json
"adminBot": [
  "your_facebook_uid_here",
  " ",
  " "
]
```

### 2. Add your session cookies

Export your Facebook cookies (JSON array format, e.g. via the
EditThisCookie browser extension) and paste them into `account.txt` at
the project root. This is the login session the bot uses — without a
valid `account.txt`, the bot can't log in.

### 3. Deploy

**Railway or a VPS** — both work fine:

```bash
npm install
node index.js
```

On Railway, just connect the repo and it builds/runs the same way. On a
VPS, run it directly or under a process manager (`pm2 start index.js`,
`screen`, `tmux`, etc.) so it stays alive after you disconnect.

**Render — does not work.** Render's platform is not compatible with how
this bot runs (persistent MQTT/WebSocket connection + filesystem writes
for session/appstate). Don't deploy this on Render — use Railway or a VPS
instead.

---

## ◈ Command Structure

Commands go in `scripts/cmds/yourcommand.js`.

```js
module.exports = {
  config: {
    name: "commandname",
    version: "1.0.0",
    author: "YourName",
    countDown: 5,
    role: 0,
    shortDescription: "...",
    longDescription: "...",
    category: "fun",
    guide: "{prefix}commandname [args]"
  },

  onStart: async function ({ api, event, args, message, getLang }) {
    message.reply("Hello!");
  },

  onReply: async function ({ api, event, Reply, message }) {
    if (event.senderID !== Reply.author) return;
    message.reply(`You replied: ${event.body}`);
  },

  onReaction: async function ({ api, event, Reaction, message }) {
    message.reply(`You reacted with: ${event.reaction}`);
  },

  onChat: async function ({ api, event, message }) {
    if (event.body === "hello") message.reply("hi!");
  },

  onEvent: async function ({ api, event, message }) {
    if (event.logMessageType === "log:subscribe") {
      message.reply("Welcome!");
    }
  }
};
```

---

## ◈ Permission Roles

| Value | Who can use |
|---|---|
| `0` | Everyone |
| `1` | Group admins only |
| `2` | Bot admins only (set in `config.json`) |

---

## ◈ API Reference

```js
message.reply("text")
api.sendMessage("text", threadID)
api.sendMessage({ body: "text", attachment }, tid)
api.setMessageReaction("✅", event.messageID, () => {}, true)
api.unsendMessage(messageID)
api.getCurrentUserID()
await api.getThreadInfo(threadID)
await api.getUserInfo(userID)
```

---

## ◈ onReply Pattern

```js
const sent = await message.reply("What's your name?");
global.GoatBot.onReply.set(sent.messageID, {
  commandName: "mycommand",
  messageID: sent.messageID,
  author: event.senderID,
  step: 1
});

onReply: async function ({ api, event, Reply, message }) {
  if (event.senderID !== Reply.author) return;
  message.reply(`Hello, ${event.body}!`);
}
```

---

## ◈ Event Types

```js
switch (event.logMessageType) {
  case "log:subscribe":
  case "log:unsubscribe":
  case "log:thread-name":
  case "log:thread-image":
  case "log:thread-admins":
}
```

---

## ◈ config.json Key Options

```json
{
  "prefix": "-",
  "adminBot": ["your_facebook_id"],
  "noPrefix": { "enable": false },
  "e2ee": { "enable": true },
  "reactUnsend": {
    "enable": true,
    "onlyAdmin": true,
    "emojis": ["😡"]
  },
  "optionsFca": {
    "listenEvents": true,
    "autoMarkDelivery": false,
    "updatePresence": false,
    "selfListen": false,
    "autoReconnect": true
  }
}
```

### E2EE (Encrypted Messaging)

`config.e2ee.enable` controls whether the bot connects Facebook's E2EE
(Signal Protocol encrypted threads) layer on startup.

- `true` — E2EE connects on login. Needed if you want the bot to send/receive
  in end-to-end encrypted threads. This runs a second, independent login to
  Facebook using the same session, which carries extra account-flagging risk
  (see below).
- `false` — E2EE is skipped entirely, bot runs on the regular MQTT session
  only. Safer against account flags/logouts; encrypted threads just won't
  work with the bot.

**Toggle it from chat** — `{prefix}setting` → **Connection (FCA / MQTT)**
→ **E2EE**. This flips `config.e2ee.enable` and saves `config.json`
automatically, but **needs a bot restart** to actually take effect (E2EE
only connects once, at login).

**Or edit `config.json` directly** and restart the bot:

```json
"e2ee": { "enable": false }
```

---

<div align="center">
  <sub>Built on the shoulders of giants · Respect Open Source · Credit your sources</sub>
  <br/>
  <sub><b>Original Work © NTKhang (ntkhang03) &nbsp;|&nbsp; Fork by EryXenX (Mohammad Akash)</b></sub>
</div>
