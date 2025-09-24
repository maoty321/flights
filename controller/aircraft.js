const { StatusCodes } = require('http-status-codes')
const customError = require('../error/')
const Aircraft = require('../model/aircraft')

exports.get_create_aircraft = (req, res) => {
    res.render('admin/create-aircraft', {alertMsg: false})
}

exports.create_aircraft = async(req, res) => { 
    const { model, registration, seatingCapacity } = req.body || ''
    if(!model || !registration || !seatingCapacity) { 
        throw new customError.BadRequest('Please provide all values')
    }

    const valAirCraft = await Aircraft.findOne({ registration })
    if(valAirCraft) { 
        return res.status(StatusCodes.NOT_FOUND).render('admin/create-aircraft', 
        {   sucess: false,
            alertMsg: true,
            location: '/aircraft/',
            icon: 'error',
            title: 'Register Aircraft',
            msgAlert: 'Registration number Already exist 😎'
        })
    }

    const aircraft = await Aircraft.create(req.body)
    res.status(StatusCodes.OK).render('admin/create-aircraft', 
        {   sucess: true,
            aircraft,
            alertMsg: true,
            location: '/aircraft/',
            icon: 'success',
            title: 'Aircraft Create',
            msgAlert: 'Successful create Aircraft'
        })
}

exports.get_all_aircraft = async(req, res) => { 
    const aircrafts = await Aircraft.find({})
    res.status(StatusCodes.OK).render('admin/manage-aircraft.ejs', { aircrafts, alertMsg: false })
}

exports.get_single_aircraft = async(req, res) => { 
    const { id: aircraftId } = req.params || ''
    const aircraft = await Aircraft.findOne({ registration: aircraftId })
    if(!aircraft) { 
        throw new customError.NotFound(`No aircraft with id : ${aircraftId}`)
    }
    res.status(StatusCodes.OK).json({ aircraft: aircraft })
}
