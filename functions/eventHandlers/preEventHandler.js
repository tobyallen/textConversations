//Conversations Pre Event Hook

// To DO: Update Sending Numbers
// Add logic to get sending number, add logic to not send messages to chat partipants

twilio = require('twilio');

exports.handler = async function (context, event, callback) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Content-Type', 'application/json');
    console.log(event);

    if (event.EventType == 'onMessageAdd') {
        let participant = await getParticipant(event.Author, event.ConversationSid);
        var isChat = participant.identity ? true : false;
        let smsName = JSON.parse(participant.attributes).name ? JSON.parse(participant.attributes).name : 'User';
        var name = isChat ? participant.identity : smsName;

        console.log(`Message from ${name} isChat:${isChat}`);
        //Default Response
        response.setBody({
            'body': `[${name}]:${event.Body}`
        });

        var checkCredit = RegExp('([0-9- ]{15,16})');
        if (checkCredit.test(event.Body)) {
            console.log('Detected a Credit Card')

            if (!isChat) {
                //Send a Message to non-chat user to say it was redacted.
                let msg = await client.messages
                    .create({
                        body: 'Hi there, we detected a credit card. Never send credit card information over in an SMS.',
                        from: participant.messagingBinding.proxy_address,
                        to: participant.messagingBinding.address
                    })
                console.log(msg.body);
            }

            response.setBody({
                'body': 'Chief Compliance Bot- A credit card was redacted.',
                'author': 'Chief Compliance Bot'
            });
        } else if (event.Body.startsWith('@leave')) {
            console.log(`Request from ${name} to leave the conversation service`);

            let removal = await client.conversations
                .conversations(event.ConversationSid)
                .participants(participant.sid)
                .remove()

            console.log(removal);
            if (!isChat) {
                // Send a message to non-chat user telling them how to re-join.
                let msg = await client.messages
                    .create({
                        body: 'We\'ve removed you. To rejoin reply back with \'@join <Your Name>\'',
                        from: participant.messagingBinding.proxy_address,
                        to: participant.messagingBinding.address
                    })
            }
            response.setBody({
                'body': `[${name} has left the conversation.]`
            });
        }  

        if (!isChat) {
            if (event.Body.startsWith('@call')) {
                console.log(`Request from ${name} to for a call`);

                let call = await client.calls
                    .create({
                        url: process.env.CALL_TWIML_BIN,
                        from: participant.messagingBinding.proxy_address,
                        to: participant.messagingBinding.address 
                    })

                console.log(call);
                // Set Status to 403 to reject the message and not post to channel.
                response.setStatusCode(403);
            } else if (event.Body.startsWith('@help')) {
                console.log(`Request from ${name} for a help message`);

                let msg = await client.messages
                    .create({
                        body: `Hi ${name}, To leave at anytime reply \'@leave\' To get a get a test call send \'@call\' To view help message send \'@help\'`,
                        from: participant.messagingBinding.proxy_address,
                        to: participant.messagingBinding.address
                    })
                // Set Status to 403 to reject the message and not post to channel.
                response.setStatusCode(403);
            }
        }
    } else if (event.EventType == 'onParticipantAdd') {
        //Participant Added Event if the user added is an SMS user Send them the welcome message.
        console.log('Participant Added')
        if ( event.MessagingBinding.Type == 'SMS') {
            let msg = await client.messages
                .create({
                    body: `Hi you've been added to a conversation, To leave at anytime reply \'@leave\' To get a get a test call send \'@call\' To view help message send \'@help\'`,
                    from: event.MessagingBinding.ProxyAddress,
                    to: event.MessagingBinding.Address
                })
        }
    }
    callback(null, response);
};

// We need to retrieve all participants in the conversation,
// then check the authors number to retrieve them.
async function getParticipant(author, conversationSid) {
    let participants = await client.conversations
        .conversations(conversationSid)
        .participants
        .list();
    console.log(`Got ${participants.length} Participants`)

    // Check if we're looking for a chat users
    var filteredIdentity = participants.filter(function (part) {
        return part.identity == author
    });
    // return the first one even if we have multiple.
    if ( filteredIdentity.length > 0 ) {
        console.log('Chat Partipant');
        return filteredIdentity[0];
    }

    // If we're looking for an SMS/Whatapps user filter them out of the full list
    var filterSMS = participants.filter(function (part) {
        return part.identity == null
    });
    var filteredAuthor = filterSMS.filter( function (part) {
        console.log(`Comparing ${part.messagingBinding.address} with ${author}`);
        return part.messagingBinding.address == author
    });
    
    console.log(`Got ${filteredAuthor.length} Filtered Participants`);
    if ( filteredAuthor.length > 0 ) {
        console.log('SMS/WhatsApp Participant');
        return filteredAuthor[0];
    }
    return '';
}