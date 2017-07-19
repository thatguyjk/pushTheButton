'use strict';

var Alexa = require("alexa-sdk");
var firebase = require("firebase");

var appId = '     ';

var config = {
  apiKey: " ",
  authDomain: "push-the-button-4f2a2.firebaseapp.com",
  databaseURL: "https://push-the-button-4f2a2.firebaseio.com",
  storageBucket: "push-the-button-4f2a2.appspot.com",
};

var app = firebase.initializeApp(config);


exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);

	alexa.applicationId = appId;
	alexa.registerHandlers(handlers);
	alexa.execute();
};

var handlers = {
	'LaunchRequest': function(){
		this.emit('GetTheSide');
	},

	'GetTheSide': function() {
		var that = this;
		var speechOutput = "";
		var fullName = "";
		var teamName = "";

		//console.log("Inside 'GetTheSide'");

		firebase.database().ref("pushes").orderByChild("published_at").limitToLast(1).once('value', function(data){
			var info = data.val();
			var key = Object.keys(info);
			var team = info[key[0]]["data"];
			team = team.replace(/'/g, '"');

			teamName = JSON.parse(team)['deviceName'];

			if(teamName == "westside") {
				fullName = "west side track fires";
			} else if(teamName == "eastside") {
				fullName = "east side grid lox";
			}

			speechOutput = "The " + fullName + " have the button. Is there anything else I can tell you?";
			var reprompt = "Is there anything else I can tell you?";

			that.emit(':ask', speechOutput, reprompt);
		});
	},

	'AMAZON.HelpIntent': function() {
		var speechOutput = "You can say who has the button or cancel...What can I help you with?";
		var reprompt = "What can I help you with?";
		this.emit(':ask', speechOutput, reprompt);
	},

    'AMAZON.StopIntent': function () {
		var exitPhrases = ["Peace Out!", "See ya later!", "Deuces!", "Adios!"];
		var phraseIndex = Math.floor(Math.random() * exitPhrases.length);
		var randomPhrase = exitPhrases[phraseIndex];

        this.emit(':tell', randomPhrase);
    },

    'AMAZON.NoIntent': function () {
		var exitPhrases = ["Peace Out!", "See ya later!", "Deuces!", "Adios!"];
		var phraseIndex = Math.floor(Math.random() * exitPhrases.length);
		var randomPhrase = exitPhrases[phraseIndex];

        this.emit(':tell', randomPhrase);
    },

	'AMAZON.CancelIntent': function() {}
};
