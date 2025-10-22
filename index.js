require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const cors = require('cors');
const helmet = require('helmet');
const { INTERNAL_SERVER_ERROR } = require('./app/constants');
const path = require('path');
app.use(helmet());
app.use(cors());
app.use('/api/uploads', express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    console.log(`Request URL: ${req.originalUrl} - Method: ${req.method} - IP: ${req.ip}`);
    next();
});
app.use('/', require('./router'));

app.use(function (req, res, next) {
    res.status(404).json({returnCode: 400, msg: 'Not Found!'});
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({returnCode: 500, msg: INTERNAL_SERVER_ERROR});
});

app.listen(3000);