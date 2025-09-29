import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import pino from 'pino';

dotenv.config();
const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const needKey = !!process.env.API_KEY;
  if (!needKey) return next();
  const token = req.headers['x-api-key'];
  if (token !== process.env.API_KEY) return res.status(403).json({ ok: false, error: 'Forbidden' });
  next();
});

const BOOKSY_URL =
  process.env.BOOKSY_URL ||
  "https://booksy.com/en-us/1072462_xclusive-kuttz_barber-shop_24092_osseo?%24web_only=true&_branch_match_id=1237652344913513240&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXT07J0UvKz88urtRLzs%2FVT9WvCKssCysrdylySQIAmdZ5YyQAAAA%3D";

const SHOP_EMAIL = process.env.SHOP_EMAIL || "";

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'velare-booksy-xclusive-kuttz', link: BOOKSY_URL });
});

app.post('/check_availability', async (req, res) => {
  return res.json({
    mode: 'deeplink',
    link: BOOKSY_URL,
    message: 'I can text you our booking link to pick an exact time. Would you like me to send it now?',
    alternatives: []
  });
});

app.post('/book_appointment', async (req, res) => {
  return res.json({
    mode: 'deeplink',
    link: BOOKSY_URL,
    confirmation: null,
    message: 'I’ll text you our booking link so you can pick your preferred time and barber in one tap.'
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`velare-booksy-xclusive-kuttz running on port ${PORT}`);
});
