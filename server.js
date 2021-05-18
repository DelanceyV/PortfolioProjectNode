const express = require('express');
const morgan = require('morgan');
const eventsCalendarRouter = require('./routes/eventsCalendarRouter');
const volunteerRouter = require('./routes/volunteerRouter');
const donateRouter = require('./routes/donateRouter');
const aboutRouter = require('./routes/aboutRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/eventsCalendar', eventsCalendarRouter);
app.use('/volunteer', volunteerRouter);
app.use('/donate', donateRouter);
app.use('/about', aboutRouter);

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is the OneWord Express Server</h1></body></html>');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});