const express = require('express');
const cors = require('cors');

//const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS
app.use(cors());



// Error middleware
//app.use(errorMiddleware);

module.exports = app;