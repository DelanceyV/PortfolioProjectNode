const express = require('express');
const volunteerRouter = express.Router();

volunteerRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get((req, res) => {
  res.end('Will show information about volunteer opportunities.');
})
.post((req, res) => {
  res.end(`Will add the volunteer opportunity: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /volunteer');
})
.delete((req, res) => {
  res.end('Deleting all volunteer opportunities');
});

module.exports = volunteerRouter;