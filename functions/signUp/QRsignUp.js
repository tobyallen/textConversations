
// Create conversation from Text Thread.
// Takes event and event Json Object
// event ={
//   name: Users Name for use in Prefixing conversation,
//   info: List of stuff,  e.g. Twilio products that they're interested in,
// }
const sgMail = require('@sendgrid/mail');

exports.handler = async function (context, event, callback) {
    client = context.getTwilioClient();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "GET, POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "text/plain");

    console.log(event);

    try {

        let msg = await client.messages
            .create({
                body: `Thanks for registering for electronic correspondance from ${event.brand}`,
                from: process.env.SIGNUP_PHONE,
                to: event.number
            })
        console.log(msg.body);

        let bodyText = event.bodyText ? event.bodyText : `${event.brand} thanks you for switching to electronic correspondance and saving paper.`
        // Send an Email to the address supplied,
        const email = {
            to: event.email,
            from: 'demo@tobytes.com',
            subject: `Demonstration Email from ${event.brand}`,
            text: bodyText,
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        sgResp = await sgMail.send(email);
        response.setBody("Success");
        callback(null, response);

    } catch (err) {
        console.log(err);
        response.setBody("Bugger");
        callback(null, response)
    }
};