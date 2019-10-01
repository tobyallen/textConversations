// Post Event Handler for Twilio Conversations
twilio = require('twilio');

exports.handler = async function (context, event, callback) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Content-Type', 'application/json');

    console.log(event);

    // if (event.EventType == 'onMessageAdded') {
    //     console.log(`Getting Conversation ${event.ConversationSid}`);
    //     let conversation = await client.conversations.conversations(event.ConversationSid)
    //         .fetch()
    //     console.log(conversation);

    // }
    callback(null, response);
};
