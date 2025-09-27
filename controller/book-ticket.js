const Booking = require("../model/book-ticket")
const Flight = require('../model/flight');
const Fares = require('../model/fares');

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


exports.get_bookedticket = async(req, res) => {
    const {ticket_id } = req.params
    const get_bookedticket = await Booking.findOne({"flight.reference": ticket_id })

    const flight_number = get_bookedticket.flight.flight_number
    const price_book = get_bookedticket.flight.price

    const flight = await Flight.findOne({flight_number: flight_number })

    // res.json({get_bookedticket, flight})
    res.render('admin/view-ticket', { alertMsg: false, get_bookedticket, flight })
}