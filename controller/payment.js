const axios = require('axios')
const Booking = require('../model/book-ticket')
const nodemailer = require('nodemailer')
const Flight = require('../model/flight')

exports.payment = async(req, res) => {
    const passenger = req.session.passenger
    const adult = req.session.adult  
    const child = req.session.child  
    const infact = req.session.infact 
    const amount = req.session.total_price
    const flight_number = req.session.flight_number
    const price = req.session.price
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email: passenger.email[0],
      callback_url:  "https://siwesflight-ll5w.onrender.com/siwesFlight/verify-payment",
      amount: amount * 100,
      metadata: {
        passenger: passenger,
        adult: adult,
        child: child,
        infact: infact,
        flight_number: flight_number,
        price: price
      }
  }, {
    headers: {
       Authorization: `Bearer ${process.env.PAYSTACK}`,
      'Content-Type': 'application/json'
    }
  })

  const { authorization_url } = response.data.data;
  const {reference} = response.data.data 
  req.session.reference = reference

  // res.json(response.data)
  res.redirect(authorization_url)
}

exports.verifyPayment = async(req, res) => {
  
  const reference = req.query.reference 
   const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK}`
    }
  });

  const data = response.data.data
  if(data.status === "success") {
    const amount  = data.amount/100
    const { passenger, child, adult, infact, flight_number, price, total_price } = data.metadata
    const fligth_detail = await Flight.findOne({flight_number})

    const  departure = new Date(fligth_detail.departureTime)
    const departuredate = departure.toLocaleDateString()
    const departuretime = departure.toLocaleTimeString()

    
    const  arrival = new Date(fligth_detail.arrivalTime)
    const arrivaldate = arrival.toLocaleDateString()
    const arrivaltime = arrival.toLocaleTimeString()


    const bookingData = {
        passenger: passenger,
        flight: {
          flight_number,
          price,
          reference: data.reference,
        },
         child,
          adult,
          infact
      };
      
      const savedBooking = await Booking.create(bookingData);
      if(!savedBooking) {
        return res.send('lll')
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "muqtarajiboye@gmail.com",
          pass: "ujbv vcvv qxvd jcer",
        },
      });


      let info = await transporter.sendMail({
      from: '"Siwes Flight Project" <muqtarajiboye@gmail.com>',
      to: `${passenger.email}`,
      subject: "Flight Booking Confirmation",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0;">
      <h2 style="color: #007bff;">Flight Booking Confirmation</h2>
      <p>Dear ${passenger.fullname[0]},</p>
      <p>Your flight has been successfully booked. Below are the details of your trip:</p>

      <h3 style="background-color: #f1f1f1; padding: 10px;">Flight Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td>Flight Number:</td><td>${flight_number}</td></tr>
        <tr><td>Departure:</td><td>${fligth_detail.departure} at ${departuretime} on ${departuredate}</td></tr>
        <tr><td>Arrival:</td><td>${fligth_detail.arrival} at ${arrivaltime} on ${arrivaldate}</td></tr>
        <tr><td>Class:</td><td>Economy</td></tr>
      </table>

      <h3 style="background-color: #f1f1f1; padding: 10px;">Passenger Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td>Full Name:</td><td>${passenger.fullname}</td></tr>
        <tr><td>Email:</td><td>${passenger.email}</td></tr>
        <tr><td>Phone:</td><td>+2341234567890</td></tr>
      </table>

      <h3 style="background-color: #f1f1f1; padding: 10px;">Payment Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td>Amount Paid:</td><td style="color: #28a745;"><strong>${total_price}}</strong></td></tr>
        <tr><td>Transaction reference:</td><td>${reference}</td></tr>
      </table>

      <p>We wish you a pleasant journey. If you have any questions, contact our support.</p>

      <div style="text-align: center; font-size: 12px; color: #888; padding-top: 10px;">
        &copy; 2025 Siwes Flight Project &bull; support@siwesflight.com
      </div>
    </div>
  `,
      });



      console.log("Message sent:", info.messageId);
      return res.render('flight/index', {
            alertMsg: true, 
            location: '/siwesflight/',
            icon: 'success',
            title: 'Book Ticket',
            msgAlert: 'You are successful book ticket 😁😎 ! check your email'
      })
  }
  res.send('l')
}
