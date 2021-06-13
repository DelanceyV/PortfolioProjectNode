// const express = require('express');
// const Volunteer = require('../models/volunteer');
// const authenticate = require('../authenticate');
// const cors = require('./cors');

// const volunteerRouter = express.Router();

// volunteerRouter.route('/')
// .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//   Volunteer.find({})
// })