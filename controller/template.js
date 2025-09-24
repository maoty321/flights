const AirCraft = require("../model/aircraft")
const Airport = require("../model/airport");
const Fares = require("../model/fares");
const Flight = require('../model/flight');

exports.getIndex = async (req, res) => {
    const flights = await Flight.find({}).populate('aircraftId')
    const  flight_numbers = flights.map(flight => flight.flight_number)
    const fares = await Fares.find({ flight_number: {$in: flight_numbers}})
    const airports = await Airport.find({ iso_country: 'NG' })

    const mergedFlights = flights.map(flight => {
    const matchingFares = fares.filter(fare => fare.flight_number === flight.flight_number);
    return {
        ...flight.toObject(), // convert Mongoose document to plain object
        fares: matchingFares
    };
    });
    
    const today = new Date()


    const tickets = mergedFlights.filter(flight => flight.fares && flight.fares.length > 0 && new Date(flight.departureTime) >= today)
    res.render('flight/index', { tickets, airports, alertMsg: false })
};

exports.searchflight = async(req, res) => {
    const {departure, arrival, depatureDate, adult, child, infact} = req.body

    const today = new Date()
    const departureDate = new Date(depatureDate)
    today.setHours(0, 0, 0, 0);
    departureDate.setHours(0, 0, 0, 0);

    if(departureDate < today) {
         return res.render('flight/index', { 
            alertMsg: true, 
            location: '/siwesflight/',
            icon: 'error',
            title: 'Ticket',
            msgAlert: 'Enter valid Date !'
         })
    }
    const flights = await Flight.find({ departure,  arrival, departureTime: {$gte: new Date(departureDate)} })

    const flight_numbers = flights.map(flight => flight.flight_number)
    const fares = await Fares.find({ flight_number: {$in: flight_numbers}})

    const mergedFlights = flights.map(flight => {
    const matchingFares = fares.filter(fare => fare.flight_number === flight.flight_number);
    return {
        ...flight.toObject(), 
        fares: matchingFares
    };
    });
    
    const tickets = mergedFlights.filter(flight => flight.fares && flight.fares.length > 0);
    req.session.adult = adult
    req.session.child = child
    req.session.infact = infact
    
    if(!tickets || tickets.length == 0) {
        return res.render('flight/index', { 
            alertMsg: true, 
            location: '/siwesflight/',
            icon: 'error',
            title: 'Ticket',
            msgAlert: 'No ticket Found😎'
         })
    }

    res.render('flight/search', { tickets, alertMsg: false, arrival, departure, depatureDate, infact, child, adult })
}

exports.book_ticket = async(req, res) => {
    const {flight_number, price} = req.params
    
    const adult = req.session.adult  
    const child = req.session.child  
    const infact = req.session.infact 
    if(!adult) {
        return res.redirect('/siwesflight')
    }
    
 
    req.session.flight_number = flight_number
    req.session.price = price

    res.render('flight/passenger', {alertMsg: false, adult, child, infact})
}

exports.post_book_ticket = async(req, res) => {
    const {fullname, email, gender, dob, pnumber } = req.body

    const adult = req.session.adult  
    const child = req.session.child  
    const infact = req.session.infact 

    const passenger = req.body
    const flight_number = req.session.flight_number

    price = req.session.price 
    req.session.passenger = passenger

    const adultPrice = price 
    const childPrice = (price * 15) / 100
    const infactPrice = (price * 75) / 100

    const total_price = price * adult + childPrice * child + infactPrice * infact
    req.session.total_price = total_price
    const fligth_detail = await Flight.findOne({flight_number})

    // res.json({total_price})
    res.render('flight/checkout', {alertMsg: false,passenger, fligth_detail, total_price })
}