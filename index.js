const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;

// Anti-sleep Railway + Ping auto toutes 5min
app.get('/', (req, res) => {
  res.send('GoatBot-Pro is alive - Uptime: OK');
});

http.createServer(app).listen(port, () => {
  console.log(`[UPTIME] Server running on port ${port}`);
});

// Self-ping toutes 5min pour rester actif 20+ jours
setInterval(() => {
  http.get(`http://localhost:${port}/`);
  console.log('[UPTIME] Self-ping OK');
}, 300000);
