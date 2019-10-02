// Create conversation from Text Thread.
// Takes event and details Json Object
// Returns Details of all conversations on Account.
// If conversation SID is specified it returns the details of that specific conversation only.

twilio = require('twilio');


exports.handler = async function (context, event, callback) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET, POST");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  try {
    if ( event.sid ) {
      let convSID = event.sid;
      let participants = await client.conversations
        .conversations(convSID)
        .participants
        .list();
      response.setBody(participants);
    }
    callback(null, response)
  } catch (err) {
    console.log(err);
    callback(err)
  }
};