const express = require('express');
const authenticate = require('../authenticate');
const Donation = require('../models/donation');
const cors = require('./cors');

const donationRouter = express.Router();

donationRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  Donation.find()
  .then(donations => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(donations);
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Donation.create(req.body)
  .then(donation => {
    console.log('New Donation', donation);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(donation);
  })
  .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /donations');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Donation.deleteMany()
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});

donationRouter.route('/:donationId')
.options(cors.corsWithOptions, authenticate.verifyAdmin, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  Donation.findById(req.params.donationId)
  .then(donation => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(donation);
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res,) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /donations/${req.params.donationId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Donation.findByIdAndUpdate(req.params.donationId, {
    $set: req.body
  }, { new: true })
  .then(donation => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(donation);
  })
  .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Donation.findByIdAndDelete(req.params.donationId)
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});

module.exports = donationRouter;