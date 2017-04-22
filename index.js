'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const JSONbig = require('json-bigint')
const app = express();
const token = "EAABdDLxPwfABAGPihFaggBZCeri5ZC6u3u0k5dZAtKMyQ2uI5UxpxU2M0JDva6jTIvmEsF0VWsfsKNFnQe00VDre1JZA1gznXwpnLOqwCg52VpJbdBpqQBFZBvEotcTQXvu6dCsT13hoZCsqupa1aZC71btNbLy7xCOHUSiCFG7oQZDZD"

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
	// let data = JSONbig.parse(req.body);
	// let messaging_events = data.entry[0].messaging
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id.toString();
		console.log('\n\n SENDER: ', event.sender, '\n\n')
		if (event.message && event.message.text) {
			let text = event.message.text;
			let messageData;
			// send single image
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
				helpers.typing(sender)
				helpers.sendImage(sender, `https://unsplash.it/${helpers.getRandomInt(100, 1000)}/${helpers.getRandomInt(100, 1000)}/?random`)
				continue
			}
			// get few images
			if(
				text === 'ابعت صور' ||
				text === 'هات صور' ||
				text === 'صور' ||
				text === 'خلفيات' ||
				text.includes('صور')
			){
				let howManyImages = helpers.getRandomInt(2, 5);
				let theWord = `${howManyImages} صور`;
				if(howManyImages === 2){
					theWord = 'صورتين'
				}
				helpers.sendTextMessage(sender, `هبعتلك ${theWord} اهو ..`)
				for (let i = 0; i < howManyImages; i++) {
					helpers.sendImage(sender, `https://unsplash.it/${helpers.getRandomInt(100, 1000)}/${helpers.getRandomInt(100, 1000)}/?random`)
				}
				continue
			}
			// swearing
			if(
				text.includes('شتم') ||
				text.includes('شتايم') ||
				text.includes('شتائم') ||
			 	helpers.arrayContains(text, dictionary.hard_bad_words)
			){
				helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.soft_bad_words))
				continue
			}
			// morning
			if(
				text === 'صباح الفل' ||
				text === 'صباح الخير' ||
				text === 'صباح جميل' ||
			 	text.includes('صباح')
			){
				helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.morning))
				setTimeout(() => {
					helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.howAreYou))
				}, 500)
				continue
			}
			// evening
			if(
				text === 'مساء الفل' ||
				text === 'مساء الخير' ||
				text === 'مساء جميل' ||
			 	text.includes('مسا')
			){
				helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.evening))
				setTimeout(() => {
					helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.howAreYou))
				}, 500)
				continue
			}
			// Salam
			if(
				text === 'السلام عليكم' ||
				text === 'سلام عليكم' ||
			 	text.includes('سلام')
			){
				helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.salam))
				setTimeout(() => {
					helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.howAreYou))
				}, 500)
				continue
			}
			// I'm up
			if(
			 	text.includes('صاحي')
			){
				helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.imUp))
				continue
			}
			// give me some money
			if(
			 	text.includes('جنيه')
			){
				helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.one_pound))
				continue
			}
			// How you doing!
			if(
				text === 'أخبارك ايه' ||
				text === 'اخبارك ايه' ||
				text === 'عامل ايه' ||
				text === 'ايه الدنيا' ||
			 	text.includes('أخبارك') ||
			 	text.includes('اخبارك') ||
			 	text.includes('عامل')
			){
				helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.imGood))
				setTimeout(() => {
					helpers.sendTextMessage(sender, helpers.getRandomFromArray(dictionary.howAreYou))
				}, 500)
				continue
			}
			// typing
			if(
				text === 'typing'
			){
				helpers.typing(sender);
				setTimeout(() => {
					helpers.sendTextMessage(sender, 'هكتب رساله ...')
				})
				continue
			}
			// if i don't understand
			helpers.sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		// if (event.postback) {
		// 	let text = JSON.stringify(event.postback)
		// 	helpers.sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
		// 	continue
		// }
	}
	res.sendStatus(200)
})



// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
