const express = require('express');
const donateRouter = express.Router();

donateRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get((req, res) => {
  res.end('Will show donation information.');
})
.post((req, res) => {
  res.end(`Will add the donation: ${req.body.amount}`);
})
.put((req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /donate');
})
.delete((req, res) => {
  res.end('Deleting all donation information');
});

module.exports = donateRouter;