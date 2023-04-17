const express = require('express');
const path = require('node:path');

const { CosmosDbPartitionedStorage } = require("botbuilder-azure");

const { ApplicationInsightsTelemetryClient, TelemetryInitializerMiddleware } = require('botbuilder-applicationinsights');
const { TelemetryLoggerMiddleware } = require('botbuilder-core');

// const { ReferenceStore } = require("./services/referenceStore")

// Read environment variables from .env file
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
// const { storeInstance } = require('./services/singleStore')

// Import required bot services.
const {
    CloudAdapter,
    ConversationState,
    MemoryStorage,
    UserState,
    ConfigurationBotFrameworkAuthentication,
    NullTelemetryClient,
    ShowTypingMiddleware
} = require('botbuilder');

// Import our custom bot class that provides a turn handling function.
const { MyBot } = require('./bots/bot');
const { RootDialog } = require('./dialogs/rootDialog');

const { BookTicketRecognizer } = require("./recognizer/BookTicketRecognizer");

const { notifyHelp } = require("./notify");

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);

// Create the adapter.
const adapter = new CloudAdapter(botFrameworkAuthentication);

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
    // Clear out state
    await conversationState.delete(context);
};

adapter.use(new ShowTypingMiddleware('3000', '4000'));

/*
// Define the state store for your bot.
// A bot requires a state storage system to persist the dialog and user state between messages.
const memoryStorage = new MemoryStorage();
// Create conversation state with in-memory storage provider.
let conversationState = new ConversationState(memoryStorage);
let userState = new UserState(memoryStorage);
*/

function getTelemetryClient(instrumentationKey) {
    if (instrumentationKey) {
        return new ApplicationInsightsTelemetryClient(instrumentationKey)
    }
    return new NullTelemetryClient()
}

// Add telemetry middleware to the adapter middleware pipeline
var telemetryClient = getTelemetryClient(process.env.InstrumentationKey);
var telemetryLoggerMiddleware = new TelemetryLoggerMiddleware(telemetryClient);
var initializerMiddleware = new TelemetryInitializerMiddleware(telemetryLoggerMiddleware, false);
adapter.use(initializerMiddleware);

const { CluAPIKey, CluAPIHostName, CluProjectName, CluDeploymentName } = process.env;
const cluConfig = { endpointKey: CluAPIKey, endpoint: `https://${CluAPIHostName}`, projectName: CluProjectName, deploymentName: CluDeploymentName };

const cluRecognizer = new BookTicketRecognizer(cluConfig);

const cosmosConfig = {
    cosmosDbEndpoint: process.env.COSMOS_DB_ENDPOINT,
    authKey: process.env.COSMOS_DB_KEY,
    databaseId: process.env.COSMOS_DB_DATABASE_ID,
    containerId: process.env.COSMOS_DB_CONTAINER_ID,
    compatibilityMode: process.env.compatibilityMode
}
const conversationReferences = {};
const cosmosDbPartitionedStorage = new CosmosDbPartitionedStorage(cosmosConfig);
const conversationState = new ConversationState(cosmosDbPartitionedStorage);
const userState = new UserState(cosmosDbPartitionedStorage);

// Create the main dialog.
const dialog = new RootDialog(cluRecognizer, conversationState, userState, telemetryClient);
dialog.telemetryClient = telemetryClient
const bot = new MyBot(conversationState, userState, dialog, conversationReferences);
// storeInstance('intervalStore', {})

// Create HTTP server.
const server = express();
server.use(express.json());

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`\n${server.name} listening to ${server.url}.`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
    // Route received a request to adapter for processing
    await adapter.process(req, res, (context) => bot.run(context));
});

server.get('/api/notify', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            message: "PLz provide valid email"
        });
    }
    const result = await notifyHelp(email);
    if (result) {
        return res.status(200).json({
            message: "Notification has been sent"
        });
    }
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', async (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new CloudAdapter(botFrameworkAuthentication);

    // Set onTurnError for the CloudAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;
});