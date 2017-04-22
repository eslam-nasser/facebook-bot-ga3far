'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
// const http = require('http');
const app = express();
const dictionary = require('./words_dictionary')
const helpers = require('./helpers')


app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text;
			let messageData;
			// send cards
			if (text === 'Generic'){
				console.log("welcome to chatbot")
				sendGenericMessage(sender)
				continue
			}
			// send images
			if(
				text === 'ابعت صورة' ||
				text === 'هات صورة' ||
				text === 'صورة' ||

				text === 'ابعت صوره' ||
				text === 'هات صوره' ||
				text === 'صوره' ||

				text === 'خلفية' ||
				text === 'خلفيه' ||

				text.includes('صورة') ||
				text.includes('صوره') ||
				text.includes('خلفي')
			){
				messageData = {
					attachment:{
						type: 'image',
						payload:{
						url: `https://unsplash.it/${helpers.getRandomInt(100, 1000)}/${helpers.getRandomInt(100, 1000)}/?random`
						}
					}
				}
				sendImage(sender, messageData)
				continue
			}
			// swearing
			if(
				text === 'اشتم' ||
			 	dictionary.bad_words.includes(text)
			){
				sendTextMessage(sender, helpers.getRandomFromArray(dictionary.bad_words))
				continue
			}
			// morning
			if(
				text === 'صباح الفل' ||
				text === 'صباح الخير' ||
				text === 'صباح جميل' ||
			 	text.includes('صباح')
			){
				sendTextMessage(sender, helpers.getRandomFromArray(dictionary.morning))
				continue
			}
			// evening
			if(
				text === 'مساء الفل' ||
				text === 'مساء الخير' ||
				text === 'مساء جميل' ||
			 	text.includes('مسا')
			){
				sendTextMessage(sender, helpers.getRandomFromArray(dictionary.evening))
				continue
			}
			// Salam
			if(
				text === 'السلام عليكم' ||
				text === 'سلام عليكم' ||
			 	text.includes('سلام')
			){
				sendTextMessage(sender, helpers.getRandomFromArray(dictionary.salam))
				continue
			}
			// How you doing!
			if(
				text === 'أخبارك ايه' ||
				text === 'اخبارك ايه' ||
				text === 'عامل ايه' ||
				text === 'ايه الدنيا' ||
			 	text.includes('اخبارك') ||
			 	text.includes('عامل') ||
			 	text.includes('أخبرك')
			){
				sendTextMessage(sender, helpers.getRandomFromArray(dictionary.salam))
				continue
			}
			// if i don't understand
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		// if (event.postback) {
		// 	let text = JSON.stringify(event.postback)
		// 	sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
		// 	continue
		// }
	}
	res.sendStatus(200)
})


const token = "EAABdDLxPwfABAGPihFaggBZCeri5ZC6u3u0k5dZAtKMyQ2uI5UxpxU2M0JDva6jTIvmEsF0VWsfsKNFnQe00VDre1JZA1gznXwpnLOqwCg52VpJbdBpqQBFZBvEotcTQXvu6dCsT13hoZCsqupa1aZC71btNbLy7xCOHUSiCFG7oQZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text: text }
	console.log(`Sending ${text} to ${sender}`)
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendImage(sender, obj) {
	let messageData = obj;
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}


// Stay up bitch!
setInterval(function() {
    request.get('http://pacific-bayou-22883.herokuapp.com/');
}, 1200); // each 20 min bing him

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
