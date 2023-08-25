const { performScraping, searchVideo } = require("./video");
const request = require('request');

const handleSendMessage = (req, res) =>{
    let body = req.body;
    // Checks if this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];

            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhookEvent.message) {
                handleMessage(senderPsid, webhookEvent.message);
            } else if (webhookEvent.postback) {
                handlePostback(senderPsid, webhookEvent.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}
// Handles messages events
async function handleMessage(senderPsid, receivedMessage) {
    let response;

    // Checks if the message contains text
    if (receivedMessage.text) {
        const search = await searchVideo(receivedMessage.text);
        if (search && search.videos.length > 0) {
            const searchUrl = search.videos.map(v => {
                return { "url": v.url, "image": v.default_thumb.src, "title": v.title }
            });
            const attachmentElement = searchUrl.map(el => {
                const elConvert = {
                    "title": el.title,
                    "image_url": el.image,
                    "subtitle": "Valiny recherche nataonao",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Alaina",
                            "payload": el.url
                        }, {
                            "type": "postback",
                            "title": "Hiova",
                            "payload": el.url
                        }
                    ]
                }
                return elConvert;
            })
            console.log("attachement element :", attachmentElement);
            response = {
                'text': `Mahandrasa kely azafady eto ampangalana ny video izahay zao!`
            };
            callSendAPI(senderPsid, response);
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": attachmentElement
                    }
                }
            }

        }

    } else if (receivedMessage.attachments) {
        response = {
            'text': `Mahandrasa kely azafady eto ampangalana ny video izahay zao!`
        };
        callSendAPI(senderPsid, response);
        // Get the URL of the message attachment
        let attachmentUrl = receivedMessage.attachments[0].payload.url;
        response = {
            "text": "Pick a color:",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Red",
                    "payload": "<POSTBACK_PAYLOAD>",
                }, {
                    "content_type": "text",
                    "title": "Green",
                    "payload": "<POSTBACK_PAYLOAD>",
                }
            ]
        }
    }
    // Send the response message
    callSendAPI(senderPsid, response);
    response = {
        'text': `Misaotra @fahatokisana o!`
    };
    callSendAPI(senderPsid, response);
    response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": 'Ny ataonao manaraka',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Video',
                                'payload': 'video',
                            },
                            {
                                'type': 'postback',
                                'title': 'Photo',
                                'payload': 'photo',
                            },
                            {
                                'type': 'postback',
                                'title': 'Mon abonnement',
                                'payload': 'mysubscription',
                            },
                            {
                                'type': 'postback',
                                'title': 'Mon indentifant',
                                'payload': 'myid',
                            },
                        ],
                    }
                ],
            }
        }
    }
    callSendAPI(senderPsid, response);

}

// Handles messaging_postbacks events
async function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { 'text': 'Thanks!' };
    } else if (payload === 'no') {
        response = { 'text': 'Oops, try sending another image.' };
    } else {
        console.log("choix client :", payload);
        const urlTest = await performScraping(payload);
        response = {
            "attachment": {
                "type": "video",
                "payload": {
                    "url": `https://www.eporner.com${urlTest}`,
                    "is_reusable": true
                }
            }
        }

    }
    // Send the message to acknowledge the postback
    callSendAPI(senderPsid, response);
}

// Sends response messages via the Send API
function callSendAPI(senderPsid, response) {
    // The page access token we have generated in your app settings
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    // Construct the message body
    let requestBody = {
        'recipient': {
            'id': senderPsid
        },
        'message': response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        'uri': 'https://graph.facebook.com/v17.0/me/messages',
        'qs': { 'access_token': PAGE_ACCESS_TOKEN },
        'method': 'POST',
        'json': requestBody
    }, (err, _res, _body) => {
        if (!err) {
            console.log('Message sent!');
        } else {
            console.error('Unable to send message:' + err);
        }
    });
}

module.exports = handleSendMessage;