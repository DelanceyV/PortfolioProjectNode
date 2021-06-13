const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volunteerOpSchema = new Schema({
  title: {
    type: String,
  },
  days: {
    type: String,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
  },
  volunteers: [{
    // need this to only include users who's "volunteer" is set to "true"
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const VolunteerOp = mongoose.model('VolunteerOp', volunteerOpSchema)

module.exports = VolunteerOp;