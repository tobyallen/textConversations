# textConversations

## How to Setup
1. Add some numbers to your default messaging service.
1. Copy the .env.example file and rename it to .env provide the required API keys and configuration information as outlined below.
1. Ensure [Twilio CLI](twil.io/cli) and the Serverless Plugin are installed and configured.
1. run 'twilio serverless:deploy' 
1. Copy the deployment URL information into Tradie Finder repo as explained below.
1. In order to respond to the conversation as the tradesman Spin up an Instance of this [Demo Chat App](https://github.com/cwkendall/demo-chat-app).

**Note: This system uses the default message service and conversation service for your account.**

## Ways to Use
1. Join Via Text
1. Join Via Tradie Finder
1. Join Via QR Scan
1. View and delete the conversations, participants and messages at <deploymentURL>/conversations.html


### Join via Text
1. Send a message to a number in your messaging service.
1. Follow the prompts in the message to add yourself to the conversation.

### Join Via Tradie Finder
A Simple React Based front end used to capture user details. Hits the "signup.js" function when confirmation button is hit.
Follow instrutions [here](https://github.com/tobyallen/signUpsetup) including specifying the Deployment URL.
**You need to sign in to the chat application as "Bob" to participate in conversations created by this.**

### Join Via QR Scan
instructions coming soon.

### Setup Information
Copy .env.example to .env and update with your account variables.

*Set your account Credentials for local testing*
ACCOUNT_SID=
AUTH_TOKEN=

*Create a TwiML bin that will play a simple message copy the URL and past below. e.g. the below will play a bell 10 times.*
```
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Play loop="10">https://api.twilio.com/cowbell.mp3</Play>
</Response>
```
CALL_TWIML_BIN=

#### Verify Service
*Create a [Verify Service](https://www.twilio.com/console/verify/services) and specify the SID here to allow the App to Verify a phone number. *
VERIFY_SID=

#### Email Validation for Signup
*In order to use email validation a Sendgrid account with [Email Validation](https://sendgrid.com/solutions/email-validation-api/) needs to used. This requires a specific API key available from the API Key section of the [Sendgrid Console](https://app.sendgrid.com/email_validation) 
SG_EMAIL_VERIFY_KEY=

#### Email sending for Signup
*An additional standard Sendgrid API key is required for sending email when using the QR Sign Up option.*
SENDGRID_API_KEY=

#### Phone Number AKA Proxy Address for Signup
*Phone number from the Conversations Messaging Pool used to as the sending address for conversations created by signup functions.
SIGNUP_PHONE=

#### Monkey Learn Setup
* If you're using the [Monkey Learn](https://monkeylearn.com/) powered profanity filter you need to specify the key and model ID here.
MONKEY_LEARN_TOKEN=
PROFANITY_MODEL_ID=