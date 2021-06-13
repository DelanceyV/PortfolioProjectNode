const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const donationSchema = new Schema({
  donationAmmount: {
    type: Currency,
    min: 0
  },
  annonymity: {
    type: Boolean,
  },
  contributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    default: ''
  },
  paymentInformation: {
    type: String,
  }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;