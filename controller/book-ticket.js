const Booking = require("../model/book-ticket")
const Flight = require('../model/flight');

exports.get_bookedtickets = async(req, res) => {
    const get_bookedtickets = await Booking.find({})
    const flight_number = get_bookedtickets.map(ticket => ticket.flight.flight_number)
    const flights = await Flight.find({flight_number: {$in: flight_number}})
    
    const flightMap = {}

    flights.forEach(flight => {
    flightMap[flight.flight_number] = flight;
    });


    const tickets = get_bookedtickets.map(ticket => ({
    booking: ticket,
    flights: flightMap[ticket.flight.flight_number] || null
    }));

    // res.json({tickets})
    res.render('admin/book--ticket', { alertMsg: false, tickets })
}