const express = require('express');
const eventsCalendarRouter = express.Router();

eventsCalendarRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get((req, res) => {
  res.end('Will show events on calendar');
})
.post((req, res) => {
  res.end(`Will add the event: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /eventsCalendar');
})
.delete((req, res) => {
  res.end('Deleting all events');
});

module.exports = eventsCalendarRouter;