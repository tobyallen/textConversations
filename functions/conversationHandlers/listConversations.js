// Create conversation from Text Thread.
// Takes event and details Json Object
// Returns Details of all conversations on Account.
// If conversation SID is specified it returns the details of that specific conversation only.
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
      let conversation = await client.conversations
        .conversations(convSID)
        .fetch();
      console.log(conversation.friendlyName);
      response.setBody(conversation);
    }  else {
      let convList = await client.conversations
        .conversations
        .list();
      convList.forEach(c => console.log(c.friendlyName));
      console.log(convList.length)
      response.setBody(convList);
    }
    callback(null, response)
  } catch (err) {
    console.log(err);
    callback(err)
  }
};