const mongoose = require('mongoose');

const aircraftScheme = new mongoose.Schema({
    model: {
        type: String,
        required: [true, 'Model AirCraft is required']
    }, 
    registration: {
        type: String,
        required: [true, 'Registration AirCraft is required']
    },
    seatingCapacity: {
        type: Number,
        required: [true, 'Seating Capacity is required']
    }
})

const AirCraft = mongoose.model('AirCraft', aircraftScheme);
module.exports = AirCraft;