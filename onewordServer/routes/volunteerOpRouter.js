const express = require('express');
const VolunteerOp = require('../models/volunteerOp');
const authenticate = require('../authenticate');
const cors = require('./cors');

const volunteerOpRouter = express.Router();

volunteerOpRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  VolunteerOp.find()
  .then(volunteerOps => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(volunteerOps);
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  VolunteerOp.create(req.body)
  .then(volunteerOp => {
    console.log('volunteerOp Created', volunteerOp);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(volunteerOp);
  })
  .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /volunteerOps');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  VolunteerOp.deleteMany()
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});

volunteerOpRouter.route('/:volunteerOpId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  VolunteerOp.findById(req.params.volunteerOpId)
  .then(volunteerOp => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(volunteerOp);
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res,) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /volunteerOps/${req.params.volunteerOpId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  VolunteerOp.findByIdAndUpdate(req.params.volunteerOpId, {
    $set: req.body
  }, { new: true })
  .then(volunteerOp => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(volunteerOp);
  })
  .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  VolunteerOp.findByIdAndDelete(req.params.volunteerOpId)
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});

module.exports = volunteerOpRouter;