const { ConfigurationBotFrameworkAuthentication, CloudAdapter } = require("botbuilder");
const { CosmosDataBase } = require('./cosmos');

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);
const adapter = new CloudAdapter(botFrameworkAuthentication);

module.exports.notifyHelp = async (userName) => {
    const cosmos = new CosmosDataBase();
    const conv = await cosmos.Find(userName);

    let flag = false;
    for (const conversationReference of Object.values(conv)) {
        await adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference.conversion, async context => {
            await context.sendActivity('proactive hello');
            flag = true;
        });
    }
    return flag;
};