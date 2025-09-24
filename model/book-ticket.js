const mongoose = require('mongoose');

const passengerScheme = new mongoose.Schema({
    fullname: [String],
    gender: [String],
    dob: [String],
    pnumber: [String],
    email: [String],
    
}) 

const flightScheme = new mongoose.Schema({
    flight_number: String,
    price: String,
    reference: String
})

const bookTicketscheme = new mongoose.Schema({
    passenger: [passengerScheme],
    adult: Number,
    child: Number,
    infact: Number,
    flight: flightScheme
})

const Booking = mongoose.model('Booking', bookTicketscheme);

module.exports = Booking;