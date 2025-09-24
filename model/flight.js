const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flight_number: {
        type: String,
        required: [ true, "Flight ID is required" ],
        unique: true
    },
    aircraftId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'AirCraft',
        required: [ true, "Aircraft ID is required" ]
    },
    departure: {
        type: String,
        required: [ true, "Departure location is required" ]
    },
    arrival: {
        type: String,
        required: [ true, "Arrival location is required" ]
    },
    departureTime: {        
        type: Date, 
        required: [ true, "Departure time is required" ]
    },
    arrivalTime: { 
        type: Date, 
        required: [ true, "Arrival time is required" ]
    },
    faresId: {
        type: mongoose.Schema.ObjectId,
    }

})

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;