const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (
  api,
  threadModel,
  userModel,
  dashBoardModel,
  globalModel,
  usersData,
  threadsData,
  dashBoardData,
  globalData
) => {
  const handlerEvents = require(
    process.env.NODE_ENV == "development"
      ? "./handlerEvents.dev.js"
      : "./handlerEvents.js"
  )(
    api,
    threadModel,
    userModel,
    dashBoardModel,
    globalModel,
    usersData,
    threadsData,
    dashBoardData,
    globalData
  );

  return async function (event) {
    // ✅ Anti-Inbox Protection (E2EE messages are never normal inbox spam)
    if (
      !event.isE2EE &&
      global.GoatBot.config.antiInbox == true &&
      (event.senderID == event.threadID ||
        event.userID == event.senderID ||
        event.isGroup == false) &&
      (event.senderID || event.userID || event.isGroup == false)
    )
      return;

    const message = createFuncMessage(api, event);
    await handlerCheckDB(usersData, threadsData, event);

    const handlerChat = await handlerEvents(event, message);
    if (!handlerChat) return;

    const {
      onAnyEvent,
      onFirstChat,
      onStart,
      onChat,
      onReply,
      onEvent,
      handlerEvent,
      onReaction,
      typ,
      presence,
      read_receipt
    } = handlerChat;

    onAnyEvent();

    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        onFirstChat();
        onChat();
        onStart();
        onReply();
        break;

      case "event":
        handlerEvent();
        onEvent();
        break;

      case "message_reaction":
        onReaction();

        // 💣 React-Unsend System
        try {
          const cfg = global.GoatBot.config.reactUnsend || {};
          const adminIDs = global.GoatBot.config.adminBot || [];
          const isAdmin = adminIDs.includes(event.userID || event.senderID);

          if (
            cfg.enable &&
            cfg.emojis?.includes(event.reaction) &&
            (!cfg.onlyAdmin || isAdmin)
          ) {
            await api.unsendMessage(event.messageID);
          }
        } catch (err) {
          console.error("❌ React-Unsend Error:", err);
        }

        break;

      case "typ":
        typ();
        break;

      case "presence":
        presence();
        break;

      case "read_receipt":
        read_receipt();
        break;

      default:
        break;
    }
  };
};
