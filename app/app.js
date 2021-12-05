const express = require('express');
const   hbs = require('express-hbs');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const webRouter = require('../routes/web');
const apiRouter = require('../routes/api');
const app = express();

app.engine('hbs', hbs.express4({
    partialsDir: "app/views/partials",
    defaultLayout: "app/views/layouts/main.hbs"
}));
app.set('view engine', 'hbs');
app.set('views', 'app/views');

app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());

app.use(webRouter);
app.use("/api", apiRouter);


app.use(express.static(path.join(__dirname, './static')));

module.exports = app;