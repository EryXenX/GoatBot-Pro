# Download package security note

This archive intentionally excludes Facebook account cookies, E2EE device keys,
local database files, environment files, and embedded credential values.

Before running the bot:

1. Fill in the redacted values in `config.json` using protected environment
   secrets where possible.
2. Add your own `account.txt` only on the private machine that will run the bot.
3. Let the bot create `data/e2ee-device.json` after the first successful login.
4. Do not commit or share those files.

The package requires Node.js 20.17.0 or newer.
