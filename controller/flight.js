const { StatusCodes } = require('http-status-codes');
const customError = require('../error/');
const Flight = require('../model/flight');
const Fares = require('../model/fares');
const Aircraft = require('../model/aircraft')
const Airport = require("../model/airport");

exports.get_create_flight = async(req, res) => {
    const aircrafts = await Aircraft.find({})
    const airports = await Airport.find({ iso_country: 'NG' })
    
    res.render('admin/create-flight', { aircrafts, airports, alertMsg: false })
}

exports.createFlight = async(req, res) => { 

    const max = 1000;
    const randomInt = Math.floor(Math.random() * (1000 + 1));
    const seconds = Math.floor(Date.now() / 1000);
    const flight_number = `FL-${randomInt}` + seconds;

    const { aircraftId, departure, arrival, departureTime, arrivalTime } = req.body || ''

    if(!aircraftId || !departure || !arrival || !departureTime || !arrivalTime){ 
        return res.status(400).redirect('admin/create-flight');
    }

    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);
    const today = new Date()

    if(departureDate <= today){ 
           return res.status(400).render('admin/create-flight', { 
            alertMsg: true,
            location: '/flight/',
            icon: 'error',
            title: 'Create flight',
            msgAlert: 'Invalid Date! Departure date must be in the future. '
            });
    }
    
    if(departureDate >= arrivalDate){ 
        return res.status(400).render('admin/create-flight', { 
            alertMsg: true,
            location: '/flight/',
            icon: 'error',
            title: 'Create flight',
            msgAlert: 'Arrival time must be after the departure time. '
            });
    }

    const flight = await Flight.create({ flight_number, aircraftId, departure, arrival, departureTime, arrivalTime });

    res.status(StatusCodes.CREATED).render('admin/create-flight', { 
            // alertMsg: true,
            sucess: true,
            alertMsg: true,
            location: '/flight/',
            icon: 'success',
            title: 'Create flight',
            msgAlert: 'You are successfully create flight'
         });
}

exports.getFlights = async(req, res) => { 
    const flights = await Flight.find({}).populate({path: 'aircraftId'});
    res.status(StatusCodes.OK).render('admin/manage-flight', { flights, alertMsg: false });
}

exports.getFlight = async(req, res) => { 
    const { id: flightId } = req.params;

    if(!flightId){ 
        throw new customError.NotFound(`No flight number with number : ${flightId}`);
    }
    const flight = await Flight.findOne({ flight_number: flightId }).populate({path: 'aircraftId'}).select('-_id');

    const fares = await Fares.find({ flight_number: flightId})
    res.status(StatusCodes.OK).render('admin/view-flight', { flight, fares, alertMsg: false });
}

exports.updateFlight = async(req, res) => { 
    const { id: flightId } = req.params;
    const { aircraftId, departure, arrival, departureTime, arrivalTime } = req.body || ''

    const updateFlight = await Flight.findOneAndUpdate({ flight_number: flightId }, req.body, 
    { new: true, runValidators: true });
    if(!updateFlight){ 
        throw new customError.NotFound(`No flight with id : ${flightId}`);
    }

    res.status(StatusCodes.OK).json({ updateFlight, msg: 'Flight updated successfully' });
}

exports.deleteFlight = async(req, res) => { 
    const { id: flightId } = req.params;
    
    const flight = await Flight.findOneAndDelete({ flight_number: flightId });
    if(!flight){ 
        return res.status(404).render('admin/manage-flight', { 
            alertMsg: true,
            location: '/flight/manage-flight',
            icon: 'error',
            title: 'Delete flight',
            msgAlert: `No flight number with id ${flightId}`
        });
    }

    res.status(StatusCodes.OK).render('admin/manage-flight', {
            alertMsg: true,
            location: '/flight/manage-flight',
            icon: 'success',
            title: 'Delete flight',
            msgAlert: `You are sucessful delete this flight`
    });
}

exports.dashboard = (req, res) => {
    res.render('admin/dashboard', {alertMsg: false})
}











exports.createFare = async(req, res) => { 
    const { flight_number } = req.params;
    const { price, fareClass, seat_total } = req.body || ''

    if(!flight_number || !price || !fareClass || !seat_total){ 
        throw new customError.BadRequest('Please provide all values')
    }

    const checkclass = await Fares.findOne({ flight_number, class: fareClass });
    if(checkclass){ 
        return res.render('admin/view-flight', { 
            alertMsg: true, 
            location: `/flight/view/${flight_number}`,
            msgAlert: `${fareClass} Class has already been created`,
            icon: 'error',
            title: 'Create fares'
            });
        } 

    const fare = await Fares.create({ flight_number, price, class: fareClass, seat_total, available_seat: seat_total });

    res.status(StatusCodes.CREATED).render('admin/view-flight', { 
            alertMsg: true, 
            location: `/flight/view/${flight_number}`,
            icon: 'success',
            title: 'Create fares',
            msgAlert: 'Fare is successful create' });
}

exports.updateFare = async(req, res) => { 
    const { id } = req.params;
    const { price, fareClass, seat_total } = req.body || ''

    const fare = await Fares.findByIdAndUpdate(id , req.body, 
    { new: true, runValidators: true });
    if(!fare){ 
        throw new customError.NotFound(`No fare with id : ${id}`);
    }

    res.status(StatusCodes.OK).json({ fare, msg: 'Fare updated successfully' });
}

exports.deleteFare = async(req, res) => { 
    const { id } = req.params;
    
    const fare = await Fares.findByIdAndDelete(id);
    if(!fare){ 
        throw new customError.NotFound(`No fare with id : ${id}`);
    }

    res.status(StatusCodes.OK).json({ msg: 'Fare deleted successfully' });
}


exports.getFares = async(req, res) => {
    const {id: flight_number} = req.params;
    if(!flight_number){ 
        throw new customError.BadRequest('Please provide flight number')
    }

    const fares = await Fares.find({ flight_number });
    if(!fares){ 
        throw new customError.NotFound(`No fares found for flight number : ${flight_number}`);
    }

    const flight_numbers = fares[0].flight_number

    const flight = await Flight.findOne({ flight_number: flight_numbers });
    if(!flight){ 
        throw new customError.NotFound(`No flight with flight number : ${flight_numbers}`);
    }

    res.status(StatusCodes.OK).json({ fare_count: fares.length, flight, fares: fares });
}