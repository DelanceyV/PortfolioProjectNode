const express = require('express');
const aboutRouter = express.Router();

aboutRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})
.get((req, res) => {
  res.end('Will show information about OneWord nonprofit.');
})
.post((req, res) => {
  res.end(`Will add the following information: ${req.body.description}`);
})
.put((req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /volunteer');
})
.delete((req, res) => {
  res.end('Deleting all information about OneWord.');
});

module.exports = aboutRouter;