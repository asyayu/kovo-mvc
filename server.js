const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const app = express();
const homeRoutes = require("./routes/home");
const methodOverride = require('method-override');
const courseRoutes = require("./routes/courses");
const ExpressError = require('./utils/ExpressError');

require('dotenv').config({path: './config/.env'})

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const PORT = 4000;

app.use("/", homeRoutes);
app.use("/courses", courseRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});
app.use((err, req, res, next) => {
    const {statusCode=500} = err;
    if (!err.message) err.message = 'Oh no, something went wrong...';
    res.status(statusCode).render('error', {err, title: 'Error'});
});

app.listen(process.env.PORT, () => {
    console.log(`LISTENING ON PORT ${process.env.PORT}`);
});