const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const homeRoutes = require("./routes/home");
const methodOverride = require('method-override');
const courseRoutes = require("./routes/courses");
const ExpressError = require('./utils/ExpressError');

require('dotenv').config({path: './config/.env'})

connectDB();

// MIDDLEWARE

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const PORT = process.env.PORT;

const sessionConfig = {
    secret: process.env.FLASH_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ROUTES

app.use("/", homeRoutes);
app.use("/courses", courseRoutes);

// ERROR HANDLING

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const {statusCode=500} = err;
    if (!err.message) err.message = 'Oh no, something went wrong...';
    res.status(statusCode).render('error', {err, title: 'Error'});
});

app.listen(process.env.PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
});