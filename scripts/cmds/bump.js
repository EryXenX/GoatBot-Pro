const { randomBytes } = require("crypto");

const handled = new Set();

module.exports = {
  config: {
    name: "bump",
    version: "4.2",
    author: "EryXenX",
    countDown: 3,
    role: 0,
    description: { en: "Reply to any message with bump to bump it" },
    category: "utility",
    guide: { en: "Reply to any message with: bump" }
  },

  onStart: async function ({ api, message, event }) {
    return doBump({ api, message, event });
  },

  onChat: async function ({ api, message, event }) {
    if (!event.body || !event.messageReply) return;
    if (!/^bump(\s+\d+)?$/i.test(event.body.trim())) return;
    return doBump({ api, message, event });
  }
};

function otid() {
  const n = BigInt("0x" + randomBytes(8).toString("hex")) & 0x3fffffn;
  return String((BigInt(Date.now()) << 22n) | n);
}

function ensureModule(api) {
  if (typeof api.bumpMessage === "function") return;
  api.addExternalModule({
    bumpMessage: (defaultFuncs, _api, ctx) => (threadID, messageID) => {
      const client = ctx.mqttClient || global.mqttClient;
      if (!client) throw new Error("MQTT client not connected");

      ctx.wsReqNumber = (ctx.wsReqNumber || 0) + 1;
      ctx.wsTaskNumber = (ctx.wsTaskNumber || 0) + 1;

      const payload0 = {
        thread_id: String(threadID),
        otid: otid(),
        sync_group: 1,
        mark_thread_read: 0,
        send_type: 1,
        source: 65544,
        text: null,
        initiating_source: 1,
        reply_metadata: {
          reply_source_id: String(messageID),
          reply_source_type: 1,
          reply_type: 1
        }
      };

      const content = {
        app_id: "2220391788200892",
        payload: JSON.stringify({
          data_trace_id: null,
          epoch_id: String(BigInt(Date.now()) << 22n),
          tasks: [{
            failure_count: null,
            label: "46",
            payload: JSON.stringify(payload0),
            queue_name: String(threadID),
            task_id: ctx.wsTaskNumber
          }],
          version_id: "6903494529735864"
        }),
        request_id: ctx.wsReqNumber,
        type: 3
      };

      client.publish("/ls_req", JSON.stringify(content), { qos: 1, retain: false });
    }
  });
}

async function doBump({ api, message, event }) {
  const replied = event.messageReply;
  if (!replied) return message.reply("Reply to a message with bump.");

  if (handled.has(event.messageID)) return;
  handled.add(event.messageID);
  setTimeout(() => handled.delete(event.messageID), 60000);

  console.log("[bump] triggered, target:", replied.messageID);
  try {
    ensureModule(api);
    api.bumpMessage(event.threadID, replied.messageID);
    console.log("[bump] sent");
  } catch (e) {
    console.log("[bump] error:", e.message);
    return message.reply("Error: " + e.message);
  }
}
