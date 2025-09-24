const express = require('express')
const { getIndex, searchflight, book_ticket, post_book_ticket } = require('../controller/template')
const { payment, verifyPayment } = require('../controller/payment')
const frontendRouter = express.Router()

frontendRouter.get('/',  getIndex)
frontendRouter.post('/',  searchflight)
frontendRouter.get('/book-ticket/:flight_number/:price',  book_ticket)
frontendRouter.post('/book-ticket',  post_book_ticket)
frontendRouter.get('/payment',  payment)
frontendRouter.get('/verify-payment',  verifyPayment)

module.exports = frontendRouter
