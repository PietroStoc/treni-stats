const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://trenistatsiot.netlify.app'
}));
app.use(express.json());
app.use(express.static('public'));

const events = [];


// L'ESP32 manda i dati qui
app.post('/event', (req, res) => {
  const ev = { ...req.body, received_at: Date.now() };
  events.unshift(ev);
  if (events.length > 500) events.pop();
  console.log('Treno rilevato:', ev);
  res.json({ ok: true });
});

// La dashboard legge i dati da qui
app.get('/events', (req, res) => {
  res.json(events);
});

// Health check per Railway
app.get('/', (req, res) => {
  res.json({ status: 'ok', eventi: events.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server avviato su porta ' + PORT);
});