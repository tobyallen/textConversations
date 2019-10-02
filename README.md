# textConversations
Copy .env.example to .env and update with your account variables.

*Set your account Credentials for local testing*
ACCOUNT_SID=
AUTH_TOKEN=

*Create a TwiML bin that will play a simple message copy the URL and past below. e.g. the below will play a bell 10 times.*
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Play loop="10">https://api.twilio.com/cowbell.mp3</Play>
</Response>

CALL_TWIML_BIN=

# How to Use
1. Add some numbers to your default messaging service.
1. Create a TwiML bin as above.
1. Send a message to a number in your messaging service.
1. Follow the prompts in the message to add yourself to the conversation.
1. View and delete the conversations,participants and messages at <deploymentURL>/conversations.html

**Note: This system uses the default message service and conversation service for your account.**