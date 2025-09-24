const mongoose = require('mongoose');

const AirportSchema = new mongoose.Schema({
  id: String,
  ident: String,
  type: String,
  name: String,
  latitude_deg: Number,
  longitude_deg: Number,
  elevation_ft: Number,
  continent: String,
  iso_country: String,
  iso_region: String,
  municipality: String,
  scheduled_service: String,
  icao_code: String,
  iata_code: String,
  gps_code: String,
  local_code: String,
  home_link: String,
  wikipedia_link: String,
  keyword: String,
});

const Airport = mongoose.model('Airport', AirportSchema);

module.exports = Airport;
