// Deletes Assets
// If only conversation specified delete conversation
// If Conversation and Partipant delete participant
// if Conversation and Message delete message
exports.handler = async function (context, event, callback) {
  client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET, POST");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");
  console.log(event)

  try {
    if ( event.conversation && event.participant ) {
      console.log('Delete Participant', event.participant)
      let result = await client.conversations
        .conversations(event.conversation)
        .participants(event.participant)
        .remove();
      response.setBody(result);
    } else if ( event.conversation && event.message ) {
      console.log('Delete Message', event.message)
      let result = await client.conversations
        .conversations(event.conversation)
        .messages(event.message)
        .remove();
      response.setBody(result);
    } else if ( event.conversation ) {
      console.log('Delete conversation', event.conversation)
      let result = await client.conversations
        .conversations(event.conversation)
        .remove();
      response.setBody(result);
    }
    callback(null, response)
  } catch (err) {
    console.log(err);
    callback(err)
  }
};