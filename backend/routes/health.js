const express = require('express');
const router = express.Router();
const axios = require('axios');
const UrlStatus = require('../models/UrlStatus');

router.post('/check', async (req, res) => {
  const { urls } = req.body;
  const results = [];

  for (let url of urls) {
    const start = Date.now();
    try {
      await axios.get(url, { timeout: 5000 });
      const responseTime = Date.now() - start;
      const status = 'UP';

      await UrlStatus.create({ url, status, responseTime });
      results.push({ url, status, responseTime });
    } catch {
      const responseTime = Date.now() - start;
      const status = 'DOWN';

      await UrlStatus.create({ url, status, responseTime });
      results.push({ url, status, responseTime });
    }
  }

  res.json(results);
});
router.get('/history', async (req, res) => {
  try {
    const all = await UrlStatus.find().sort({ timestamp: -1 }).limit(100);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
