const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();
const port = process.env.PORT || 3000;
const key = "ad0c1a844ca749f2aa1211322240107";


app.set("trust proxy", true);

app.get("/api/hello", async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const visitor = req.query.visitor_name || 'Mark';
  try {
    const base_url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=location&q=current`;
    const response = await axios.get(base_url);
    // const country = response.data.location.country;
    const geoResponse = await axios.get(`https://ipapi.co/${ip}/json`);
    const geoData = geoResponse.data;
    const city = geoData.city || 'New york';
    const temp = response.data.current.temp_c;
    
    res.json({
      "client_ip": ip, // The IP address of the requester
      "location": city, // The city of the requester
      "greeting": `Hello, ${visitor}!, the temperature is ${temp} degrees Celcius in ${city}`
    })
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