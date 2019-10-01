// Handle Inbound Messages to the Converations Message Service
twilio = require('twilio');

exports.handler = async function (context, event, callback) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    console.log(event);
    let twiml = ""
    console.log(`From: ${event.From} Body:${event.Body}`);

    if (event.Body.startsWith('@join')) {
        var name = event.Body.replace('@join ', '');
        console.log(`Request from ${name} to join to conversation service`);

        try {
            // Get List of Conversations
            let convList = await client.conversations
                .conversations
                .list();
            convList.forEach(c => console.log(c.friendlyName));
            var conversation = convList[0];
            console.log(conversation)
            if (convList.length == 0) {
                console.log('No Active Conversations Creating One now')
                conversation = await client.conversations.conversations
                    .create({
                        friendlyName: `Engage Sydney Conversation`
                    })
                console.log(`Created Conversation SID:${conversation.sid}`)
            }

            // Add User as participant
            console.log(`Adding participant: ${event.From} ProxyAddress:${event.To}`);
            let attributes = JSON.stringify({
                'name': `${name}`
            });

            console.log(attributes)
            let participant = await client.conversations
                .conversations(conversation.sid)
                .participants
                .create({
                    'messagingBinding.address': `${event.From}`,
                    'messagingBinding.proxyAddress': `${event.To}`,
                    'attributes': attributes
            })
            console.log(participant);

            twiml = 'Welcome to the Engage Conversations Demo - To leave at anytime reply \'@leave\'';
        } catch (err) {
            twiml = 'Uh Oh! We couldn\'t add you to a conversation right now.';
            console.log(err)
        }
    } else {
        twiml = 'If you\'d like to Engage in Conversation. Reply back with \'@join <Your Name>\'';
    }

    callback(null, twiml);
};