// Verification Service for Signup form.
// Requires phone in query string.
// If no code is supplied it sends one to the phone number
// Otherwise it checks the code against the Verify service.

exports.handler = function (context, event, callback) {
    client = context.getTwilioClient();
    const response = new Twilio.Response();

    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "GET, POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    if (!event.code) {
        const phone = '+' + event.phone;
        console.log(`Got phone: ${phone}`);

        client.verify.services(process.env.VERIFY_SID)
            .verifications
            .create({ to: phone, channel: 'sms' })
            .then(verification => {
                console.log(verification.status);
                response.setBody(verification);
                callback(null, response);
            })
            .catch(err => {
                response.setBody(err);
                callback(response);
            });
    } else if (event.code) {
        const code = event.code;
        console.log(`Got code: ${code}`);
        const phone = '+' + event.phone;
        console.log(`Got phone: ${phone}`);

        client.verify.services(process.env.VERIFY_SID)
            .verificationChecks
            .create({ to: phone, code: code })
            .then(verification_check => {
                console.log(verification_check.status);
                response.setBody(verification_check);
                callback(null, response);
            })
            .catch(err => {
                response.setBody(err);
                callback(response);
            });
    }
}; 