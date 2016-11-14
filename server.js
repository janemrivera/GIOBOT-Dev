var express = require('express');
var bodyParser = require("body-parser")
var CiscoSparkClient = require('node-sparkclient')
var request = require('request');
var https = require('https');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var bearerToken = process.env.bearerToken
var spark = new CiscoSparkClient(bearerToken)


//Webhook for Messages.  Check if 1:1 or Group Room.
app.post('/messages', function (req, res) {

	message = req.body

	//console.log(JSON.stringify(message))

	//confirm its not a message we sent we're seeing in the webhook
	if (message.data.personId != process.env) {

		spark.getMessage(messageId, function(err,message) {
			if (err) {
		   		console.dir('Error getting Spark message');
		   		console.error(err)
		   	}
		   	else {
		   		sendSparkMessage(message.roomId,message.text,'markdown',true)
		   	}
		})

		
	
	}

	res.sendStatus(200)
})

//Webhook for Memberships.  Check if 1:1 or Group Room.
app.post('/memberships', function (req, res) {
	message = req.body

	//console.log(JSON.stringify(message))

	res.sendStatus(200)
})


//Handle Status Code 429 Headers for Retry-After header (not yet implemented)
function sendSparkMessage(roomId, message, format, retry, callback) {
	var messageParams = {}
	switch (format) {
		case 'text':
			break;
		case 'html':T
			messageParams.html = true
			break;
		case 'markdown':
			messageParams.markdown = true
			break;
		default:
			break;
	}
	spark.createMessage(roomId, message, messageParams, function(err, response) {
		if (err) {
   			console.dir('Error creating message for roomId: '+roomId);
   			console.error(err)
   			if (retry == true && err != 429) {
   				sendSparkMessage(roomId,message, false)
   			}
   			if (err == 429) {
   				pmx.notify('Spark sending 429 Messages')
   			}
	   	}
	   	if (callback) {
	   		//callback?
	   	}
	})
}


//Web Server Port
var port = process.env.PORT

// Create an HTTP service.
app.listen(port);
console.log('Web server listening on',port);
