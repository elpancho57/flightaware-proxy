const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/flightaware', async (req, res) => {
  const { flight, date } = req.query;
  const apiKey = process.env.FLIGHTAWARE_API_KEY;

  const url = `https://aeroapi.flightaware.com/aeroapi/flights/${flight}?date=${date}`;
  const headers = { 'x-apikey': apiKey };

  try {
    const response = await fetch(url, { headers });
    const result = await response.json();
    const tailNumber = result.flights?.[0]?.tailnumber || null;
    res.json({ tailNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tail number' });
  }
});
app.get('/lookup', async (req, res) => {
  const { flight, date } = req.query;
  const apiKey = process.env.FLIGHTAWARE_API_KEY;
  const url = `https://aeroapi.flightaware.com/aeroapi/flights/${flight}?date=${date}`;
  const headers = { 'x-apikey': apiKey };

  try {
    const response = await fetch(url, { headers });
    const result = await response.json();

    const flightData = result.flights?.[0];
    if (!flightData || !flightData.tailnumber) {
      return res.status(404).json({ message: 'Aircraft not yet assigned' });
    }

    res.json({
      tailNumber: flightData.tailnumber,
      aircraftType: flightData.aircraft_type,
      aircraftAge: flightData.aircraft_age,
      engineType: flightData.engine_type,
      engineAge: flightData.engine_age,
      totalHours: flightData.total_hours
    });
  } catch (err) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ message: 'Failed to fetch aircraft data' });
  }
});
  
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});


