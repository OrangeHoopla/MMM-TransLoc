var NodeHelper = require('node_helper');
var unirest = require('unirest');
var hashtable = {};
'use strict';
module.exports = NodeHelper.create({

	Transstart: function (url) {
		
		console.log('MMM-Transloc helper started...');
	unirest.get("https://transloc-api-1-2.p.rapidapi.com/routes.json?callback=call&agencies=" + url.AgencyNum)
		.header("X-RapidAPI-Host", "transloc-api-1-2.p.rapidapi.com")
		.header("X-RapidAPI-Key", url.Key)
		.end(function (result,callback) {
			  wow = result.body['data'];
			  

			  

			  for (i = 0; i < wow['116'].length; i++) {
				    		hashtable[wow['116'][i]['route_id']] = wow['116'][i]['long_name'];
			  }
			console.log(hashtable[4001246])
		});



	},

	getJson: function (url) {
		var self = this;
	




unirest.get("https://transloc-api-1-2.p.rapidapi.com/arrival-estimates.json?&stops="+ url.stop_id + "&callback=call&agencies=" + url.AgencyNum)
.header("X-RapidAPI-Host", "transloc-api-1-2.p.rapidapi.com")
.header("X-RapidAPI-Key", url.Key)
.end(function (result,callback) {
	var  tests = result.body['data'][0];
	  delete tests['agency_id'];
	  delete tests['stop_id'];

	tests['arrivals'].splice(3, 200);

	var time1 = new Date();
	  var time2 = new Date();
	  //formatting time for arrival
	  for (i = 0; i < tests['arrivals'].length; i++) {
	    		delete tests['arrivals'][i]['vehicle_id'];
	    		delete tests['arrivals'][i]['type'];
	    		//use regex in the future not hard coded values
	    		var hours = parseInt(tests['arrivals'][i]['arrival_at'].slice(11,13));
	   		  		  		  		var minutes = parseInt(tests['arrivals'][i]['arrival_at'].slice(14,16));
	    		  		  		  
	time2.setHours(hours);
	time2.setMinutes(minutes);
	    		  		  		  		   var minutes = (time2 - time1) / 60000;
	tests['arrivals'][i]['arrival_at'] = minutes + " min";
	tests['arrivals'][i]['route_id'] = hashtable[tests['arrivals'][i]['route_id']];  
	  }

	self.sendSocketNotification("MMM-JsonTable_JSON_RESULT", {url: url.url, data: tests,head: "title"});

	    });

			   
	
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, url) {
		if (notification === "MMM-JsonTable_GET_JSON") {
			this.getJson(url);
		}

		if( notification === "MMM-Transloc-start"){
			this.Transstart(url)
		}
	}
});
