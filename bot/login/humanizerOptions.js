// Maps the bot's `humanizer` config block onto @eryxenx/fca's `humanize`
// login option. The delay doubles as the typing-indicator window inside fca:
// it shows "is typing..." for exactly the time it waits before letting the
// command through, so the two can never drift apart.

function clampInt(value, min, max, fallback) {
        const n = Number(value);
        if (!Number.isFinite(n)) return fallback;
        return Math.min(max, Math.max(min, Math.round(n)));
}

function buildHumanizeOptions(config) {
        const h = (config && config.humanizer) || {};
        const enabled = h.enable !== false;
        // fca drops the middleware entirely when disabled, which is what
        // enable=false should mean: reply instantly, no delay, no typing.
        if (!enabled) return { enabled: false };
        return {
                enabled: true,
                // Single value => a fixed delay (fca's randomBetween returns it
                // unchanged); an array => a random value in [min, max].
                reactDelayMs: Array.isArray(h.delayMs)
                        ? h.delayMs.map(v => clampInt(v, 0, 60000, 0))
                        : clampInt(h.delayMs, 0, 60000, 3000),
                cooldownMs: clampInt(h.cooldownMs, 0, 600000, 5500),
                maxPerMinute: clampInt(h.maxPerMinute, 0, 1000, 20),
                perThread: h.perThread !== false
        };
}

// Applied after login so a settings change takes effect without a restart.
// The humanizer instance is created inside listenMqtt, so this is a no-op
// until the socket is listening — call it again after (re)starting the listener.
function applyHumanizerToApi(api, config) {
        try {
                const humanizer = api && typeof api.getHumanizer === "function" ? api.getHumanizer() : null;
                if (!humanizer || typeof humanizer.setOptions !== "function") return false;
                const opts = buildHumanizeOptions(config);
                if (opts.enabled === false) {
                        humanizer.setOptions({ enabled: false });
                        return true;
                }
                humanizer.setOptions(opts);
                humanizer.enabled = true;
                return true;
        } catch {
                return false;
        }
}

module.exports = { buildHumanizeOptions, applyHumanizerToApi };
