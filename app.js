require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const seession = require('express-session')
const cookieParser = require('cookie-parser')

const notFound = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandle');

const flightRouter = require('./route/flight');
const aircraftRouter = require('./route/aircraft');
const authRouter = require('./route/auth');

//connect db
const mongoose = require('mongoose');
const frontendRouter = require('./route/frontend');
const session = require('express-session');

mongoose.connect(process.env.MONGODB_URI)
.then(() => { console.log(`connect to Database`)})
.catch(err => {console.log(err)});

//middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    'secret': 'maoty',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60}
}))

app.set('view engine', 'ejs')
app.use(express.static('public'))
//route
app.get('/', (req, res) => {
    res.render('flight/admin/create-aircraft')
})

app.use('/flight', flightRouter);
app.use('/aircraft', aircraftRouter);
app.use('/siwesflight', frontendRouter)
app.use('/admin', authRouter);

//routeMiddleware
app.use(notFound);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});