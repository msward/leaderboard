var mongoose = require('mongoose');

var princessSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  moniker: String,
  birthday: { type: Date },
  gender: String,
  scores: [{type: mongoose.Schema.Types.ObjectId, ref: 'Score'}],
  tribe: {type: mongoose.Schema.Types.ObjectId, ref: 'Tribe'}
});

princessSchema.set('toJSON', { getters: true, virtuals: true });

princessSchema.virtual('age').get(function () {
  var today = new Date();
  var dob = this.birthday;
  var years = today.getFullYear() - dob.getFullYear();

  // Reset birthday to the current year.
  dob.setFullYear(today.getFullYear());

  // If the user's birthday has not occurred yet this year, subtract 1.
  if (today < dob)
  {
    years--;
  }
  return years;
});

module.exports = mongoose.model('Princess', princessSchema);
