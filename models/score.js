var mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
  eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
  kind: String,
  value: String,
  metadata: [{
    key: String,
    value: String
  }]
});
    
scoreSchema.set('toJSON', { getters: true, virtuals: true });

scoreSchema.virtual('timeInMillis').get(function () {
  try {
  if (this.kind.toUpperCase()=='TIME' && this.value) {
	  var timeArray = this.value.split(":");
	  timeArray.reverse();
	  var hours = 0;
	  var minutes = 0;
	  var seconds = 0;
	  var millis = 0;
	  var i = 0;
	  for (i = 0; i < timeArray.length; i++) {
		  if (!isNaN(timeArray[i])) {
	    	  if (i===3) {
	    		  hours = timeArray[i]*60000*60;
	    	  }
	    	  if (i===2) {
	    		  minutes = timeArray[i]*60000;
	    	  }
	    	  if (i===1) {
	    		  seconds = timeArray[i]*1000;
	    	  }
	    	  if (i===0) {
	    		  millis = timeArray[i]+'00';
		   		  millis = millis.substring(0,3);
		   	  }
	      }
      }
      return (hours+minutes+seconds+millis);
  } else {
	  return null;
  }
  } catch (e) {
	  console.log('error in timeMillis calculation: ' + e);
  }
});
    

module.exports = mongoose.model('Score', scoreSchema);
