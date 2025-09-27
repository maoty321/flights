const express = require("express");
const { createFlight, getFlights, getFlight, updateFlight, deleteFlight, 
createFare, updateFare, deleteFare, dashboard,
getFares,
get_create_flight} = require("../controller/flight");
const Airport = require("../model/airport");
const { get_bookedtickets, get_bookedticket } = require("../controller/book-ticket");
const flightRouter = express.Router();
const authUser = require('../middleware/authmiddel')

flightRouter.get("/dashboard", authUser, dashboard)

flightRouter.get("/", authUser, get_create_flight)
flightRouter.post("/", authUser, createFlight)
flightRouter.get("/manage-flight", authUser, getFlights)
flightRouter.get("/book-ticket", authUser, get_bookedtickets)
flightRouter.get("/ticket/:ticket_id", authUser, get_bookedticket)


flightRouter.get("/view/:id", authUser, getFlight)
flightRouter.put("/:id", authUser, updateFlight)
flightRouter.get("/delete/:id", authUser, deleteFlight)

flightRouter.post("/:flight_number/fares", authUser, createFare);
flightRouter.get("/:id/fares", authUser, getFares);
flightRouter.put("/:id/fares", authUser, updateFare);
flightRouter.delete("/:id/fares",  authUser, deleteFare);



module.exports = flightRouter;