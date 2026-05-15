const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve la dashboard

const events = [];

// L'ESP32 chiama questo endpoint
app.post('/event', (req, res) => {
  const ev = { ...req.body, received_at: Date.now() };
  events.unshift(ev);
  if (events.length > 500) events.pop(); // tieni solo gli ultimi 500
  console.log('Treno rilevato:', ev);
  res.json({ ok: true });
});

// La dashboard chiama questo per aggiornare i dati
app.get('/events', (req, res) => {
  res.json(events);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server avviato su porta ' + PORT);