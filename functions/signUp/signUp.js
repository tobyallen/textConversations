// Create conversation from Text Thread.
// Takes event and event Json Object
// event ={
//   name: Users Name for use in Prefixing conversation,
//   info: List of stuff,  e.g. Twilio products that they're interested in,
// }

exports.handler = async function (context, event, callback) {
    client = context.getTwilioClient();
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "GET, POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    console.log(event);

    var firstMessage = `We're connect you with Bob, a ${event.info}. To talk about your needs.`

    try {
        let conversation = await client.conversations.conversations
            .create({
                friendlyName: `Conversation with ${event.name}`,
                attributes: JSON.stringify({
                    'info': `${event.info}`
                })
            })
        console.log(`Conversation SID:${conversation.sid}`);

        console.log(`Adding participant: ${event.number} ProxyAddress:${process.env.SIGNUP_PHONE}`);
        let participant = await client.conversations
            .conversations(conversation.sid)
            .participants
            .create({
                'messagingBinding.address': `+${event.number}`,
                'messagingBinding.proxyAddress': `${process.env.SIGNUP_PHONE}`
            })
        console.log(`SMS participant SID:${participant.sid}`)
        let boothChat = await await client.conversations
            .conversations(conversation.sid)
            .participants
            .create({
                'identity': `Bob`
            })
        console.log(`Chat participant SID:${boothChat.sid}`)

        let infoMsg = await client.conversations
            .conversations(conversation.sid)
            .messages
            .create({
                author: 'Twilio Expert Bot',
                body: firstMessage
            })

        console.log(`Info Message: ${infoMsg}`)

        callback(null, infoMsg)
    } catch (err) {
        console.log(err);
        callback(null, "Bugger")
    }
};

// Add to Tradie Finder contact list
async function addContactToList(values) {
    console.log('Adding to Contacts API');
    let requestBody = {
        "list_ids": [
            "cd7e1a84-d219-4b2c-bb25-34f0c4711b51"
        ],
        "contacts": [
            {
                "email": values.email,
                "first_name": values.name,
                "phone_number": values.number,
                "custom_fields": {
                    "e1_T": values.trade
                }
            }
        ]
    };
    console.log(requestBody);
    let sgResp = await got
        .put('https://api.sendgrid.com/v3/marketing/contacts', {
            headers: {
                Authorization: `Bearer ${process.env.SG_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
    console.log(sgResp.body);
}