const express = require('express');
const Event = require('../models/event');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { json } = require('express');

const eventRouter = express.Router();

eventRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  Event.find()
  .populate('comments.author')
  .then(events => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(events);
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Event.create(req.body)
  .then(event => {
    console.log('Event Created ', event);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(event);
  })
  .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /event');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  Event.deleteMany()
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});

eventRouter.route('/:eventId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  Event.findById(req.params.eventId)
  .populate('comments.author')
  .then(event => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(event);
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /events/${req.params.eventId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Event.findByIdAndUpdate(req.params.eventId, {
    $set: req.body
  }, { new: true })
  .then(event => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(event);
  })
  .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Event.findByIdAndDelete(req.params.eventId)
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});

eventRouter.route('/:eventId/comments')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  Event.findById(req.params.eventId)
  .populate('comments.author')
  .then(event => {
    if (event) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(event.comments);
    } else {
      err = new Error(`event ${req.params.eventId} not found`);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Event.findById(req.params.eventId)
  .then(event => {
    if (event) {
      req.body.author = req.user._id;
      event.comments.push(req.body);
      event.save()
      .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(event);
      })
      .catch(err => next(err));
    } else {
      err = new Error(`event ${req.params.eventId} not found`);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end(`PUT operation not supported on /events/${req.params.eventId}/comments`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Event.findById(req.params.eventId)
  .then(event => {
    if (event) {
      for (let i = (event.comments.length-1); i >= 0; i--) {
        event.comments.id(event.comments[i]._id).remove();
      }
      event.save()
      .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(event);
      })
      .catch(err => next(err));
    } else {
      err = new Error(`event ${req.params.eventId} not found`);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
});

eventRouter.route('/:eventId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  Event.findById(req.params.eventId)
  .populate('comments.author')
  .then(event => {
    if (event && event.comments.id(req.params.commentId)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(event.comments.id(req.params.commentId));
    } else if (!event) {
      err = new Error(`event ${req.params.eventId} not found`);
      err.status = 404;
      return next(err);
    } else {
      err = new Error(`Comment ${req.params.commentId} not found`);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /events/${req.params.eventId}/comments/${req.params.commentId}`);
  })
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Event.findById(req.params.eventId)
  .then(event => {
    if (event && event.comments.id(req.params.commentId)) {
      if (event.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
        if (req.body.rating) {
          event.comments.id(req.params.commentId).rating = req.body.rating;
        }
        if (req.body.text) {
          event.comments.id(req.params.commentId).text = req.body.text;
        }
        event.save()
        .then(event => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(event);
        })
        .catch(err => next(err));
      } else {
        err = new Error(`You are not authorized to edit another user's comment!`);
        err.status = 403;
        return next(err);
      }
    } else if (!event) {
      err = new Error(`event ${req.params.eventId} not found`);
      err.status = 404;
      return next(err);
    } else {
      err = new Error(`Comment ${req.params.commentId} not found`);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Event.findById(req.params.eventId)
  .then(event => {
    if (event && event.comments.id(req.params.commentId)) {
      if (event.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
        event.comments.id(req.params.commentId).remove();
        event.save()
        .then(event => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(event);
        })
        .catch(err => next(err));
      } else {
        err.status = 403;
        err = new Error(`You are not authorized to delete another user's comment!`);
        return next(err);
      }
    } else if (!event) {
      err = new Error(`event ${req.params.eventId} not found`);
      err.status = 404;
      return next(err);
    } else {
      err = new Error(`Comment ${req.params.commentId} not found`);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
});

module.exports = eventRouter;