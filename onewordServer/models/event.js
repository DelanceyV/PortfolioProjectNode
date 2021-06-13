const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  attending: {
    type: Boolean,
  },
  text: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

const eventSchema = new Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  host: String
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;