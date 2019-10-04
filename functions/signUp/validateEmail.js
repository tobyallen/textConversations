// Calls Send Grid Email Validation API
const got = require('got');

exports.handler = function (context, event, callback) {
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "GET, POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    console.log(event.email);

    got
        .post('https://api.sendgrid.com/v3/validations/email', {
            headers: {
                'authorization': `Bearer ${process.env.SG_EMAIL_VERIFY_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": event.email })
        })
        .then(resp => {
            console.log('Body');
            console.log(resp.body);
            response.setBody(resp.body);
            callback(null, response);
        })
        .catch(err => {
            response.setBody(err);
            console.log(err)
            callback(response);
        });

};