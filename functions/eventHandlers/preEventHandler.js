//Conversations Pre Event Hook

twilio = require('twilio');

exports.handler = async function (context, event, callback) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Content-Type', 'application/json');
    console.log(event);

    if (event.EventType == 'onMessageAdd') {

        let participant = await getParticipant(event.Author, event.ConversationSid);
        let name = JSON.parse(participant.attributes).name 
        console.log(`Message from ${name}`);

        var checkCredit = RegExp('([0-9- ]{15,16})');
        if (checkCredit.test(event.Body)) {
            console.log('Detected a Credit Card')
            let msg = await client.messages
                .create({
                    body: 'Hi there, we detected a credit card. Never send credit card information over in an SMS.',
                    messagingServiceSid: process.env.CONV_MSG_SRV_SID,
                    to: event.Author
                })
            console.log(msg.body);
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

            let msg = await client.messages
                .create({
                    body: 'We\'ve removed you. To rejoin reply back with \'@join <Your Name>\'',
                    messagingServiceSid: process.env.CONV_MSG_SRV_SID,
                    to: event.Author
                })

            response.setBody({
                'body': `[${name} has left the conversation.]`
            });
        } else {
            response.setBody({
                'body': `[${name}]:${event.Body}`
            });
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

    var filterSMS = participants.filter(function (part) {
        return part.identity == null
    });

    var filtered = filterSMS.filter( function (part) {
        console.log(`Comparing ${part.messagingBinding.address} with ${author}`);
        return part.messagingBinding.address == author
    });
    
    console.log(`Got ${filtered.length} Filtered Participants`);
    console.log(filtered);
    return filtered[0];
}