const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();
const port = process.env.PORT || 3000;
const key = process.env.API_KEY;

app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/hello", async (req, res) => {
  try {
    const key = process.env.API_KEY;
    const visitor = req.query.visitor_name || 'visitor';
    const base_url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=location&q=current`;
    const response = await axios.get(base_url);
    const country = response.data.location.country;
    const temp = response.data.current.temp_c;
    const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
    res.json({
      client_ip: ip,
      location: country,
      greeting: `Hello, ${visitor}!, the temperature is ${temp} Celcius in ${country}`,
    });
  } catch (error) {
    console.error("Error making GET request:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Base URL: http://api.weatherapi.com/v1
// /ip.json or /ip.xml

module.exports = app;