# Marketplace Authentication Browser Extension
A small Chrome browser extension that stores customer IDs per environment, retrieves a token from an internal service and sets the `authId` cookie - for use on CreditMatcher pre-production environments or a local build of the web app.

## Downloading the extension
Download and extract the latest source files from [here](https://git.gbl.experiancs.com/ecs-uk/marketplace-auth-browser-extension/releases).

## Installing the extension
*Only available for Google Chrome*

1. Go to `chrome://extensions`
2. Ensure **Developer mode** toggle is on (top right corner)
3. Click **Load unpacked** (top left corner)
4. Select root directory of the extension

## Using the extension

1. **Connect to the UK VPN** (ukvpn.experianinteractive.com)
2. Navigate to a CreditMatcher pre-production environment or your local
3. Open the extension via the icon in the browser
4. Select the environment you're using if not already selected (DEV, INT or STG) - *check your `.env` file if you're running locally*
5. Click the user you'd like to login as

*The token will never expire by default unless you click the 'Reset Token' button in the extension popup or your browser session expires, please ensure you have the following two variables with these two values in your `.env`*
- FE_SESSION_TIMEOUT_COUNTDOWN=120
- FE_SESSION_TIMEOUT=810

## Adding users

1. Open the `vars.js` file in the extension directory
2. Add a new object to the chosen environment list found in the users object (develop, integration or staging)
3. Ensure you specify the customer ID in the object property named `id` and a description (e.g. email address) in `description`

## Troubleshooting

If you ever come across any issues such as a looping logout or a session that won't reset, click the 'Clear Site Data' button in the extension popup - this will clear all cookies, local storage, session storage and other browser related data for the domain you're on.
