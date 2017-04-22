const request = require('request')
const token = "EAABdDLxPwfABAGPihFaggBZCeri5ZC6u3u0k5dZAtKMyQ2uI5UxpxU2M0JDva6jTIvmEsF0VWsfsKNFnQe00VDre1JZA1gznXwpnLOqwCg52VpJbdBpqQBFZBvEotcTQXvu6dCsT13hoZCsqupa1aZC71btNbLy7xCOHUSiCFG7oQZDZD"

module.exports = {
    // get random value from an array
    getRandomFromArray: function(arr){
        return arr[Math.floor(Math.random()*arr.length)]
    },
    // get random image size
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // is this single word is in array?
    arrayContains: function(needle, arrhaystack){
        var ret = false;
        needle.split(' ').map(item => {
            if(arrhaystack.indexOf(item) > -1){ret = true}
        })
        return ret;
    },
    // Typing
    typing: function(sender){
        // I will delay it just to make it feel real!
        setTimeout(() => {
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {access_token:token},
                method: 'POST',
                json: {
                    recipient: {id: sender},
                    sender_action: 'typing_on'
                }
            }, function(error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }
            })
        }, 500)
    },
    // Send text messages
    sendTextMessage: function(sender, text) {
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
    },
    // Send images
    sendImage: function(sender, imgUrl) {
        let messageData = {
            attachment:{
                type: 'image',
                payload:{
                    url: imgUrl
                }
            }
        };
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
}





















// function sendGenericMessage(sender) {
// 	let messageData = {
// 		"attachment": {
// 			"type": "template",
// 			"payload": {
// 				"template_type": "generic",
// 				"elements": [{
// 					"title": "First card",
// 					"subtitle": "Element #1 of an hscroll",
// 					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
// 					"buttons": [{
// 						"type": "web_url",
// 						"url": "https://www.messenger.com",
// 						"title": "web url"
// 					}, {
// 						"type": "postback",
// 						"title": "Postback",
// 						"payload": "Payload for first element in a generic bubble",
// 					}],
// 				}, {
// 					"title": "Second card",
// 					"subtitle": "Element #2 of an hscroll",
// 					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
// 					"buttons": [{
// 						"type": "postback",
// 						"title": "Postback",
// 						"payload": "Payload for second element in a generic bubble",
// 					}],
// 				}]
// 			}
// 		}
// 	}
// 	request({
// 		url: 'https://graph.facebook.com/v2.6/me/messages',
// 		qs: {access_token:token},
// 		method: 'POST',
// 		json: {
// 			recipient: {id:sender},
// 			message: messageData,
// 		}
// 	}, function(error, response, body) {
// 		if (error) {
// 			console.log('Error sending messages: ', error)
// 		} else if (response.body.error) {
// 			console.log('Error: ', response.body.error)
// 		}
// 	})
// }


// Stay up bitch!
// setInterval(function() {
//     request.get('http://pacific-bayou-22883.herokuapp.com/');
// }, 1500); // each 20 min bing him