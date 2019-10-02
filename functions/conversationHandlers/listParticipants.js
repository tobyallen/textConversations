// Retrieve Conversation Participants
exports.handler = async function (context, event, callback) {
  client = context.getTwilioClient();
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