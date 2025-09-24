const mongoose = require('mongoose');

const fareSchema = new mongoose.Schema({
    flight_number: {
        type: String,
        required: true,
        unique: false
    },
    price: {
        type: Number,
        required: true
    },
    class: { 
        type: String,
        required: true,
        Enumerator: ['Economy', 'Business', 'First']
    },
    seat_total: {
        type: Number,
        required: true
    },
    available_seat: {
        type: Number,
        required: true
    }   
})

const Fares = mongoose.model('fare', fareSchema);

module.exports = Fares;