const { CardFactory, TeamsActivityHandler, TeamsInfo, TurnContext } = require('botbuilder');

const { CosmosDataBase } = require("../cosmos");
const cosmos = new CosmosDataBase();

// const { getReference, setReference } = require("../cosmosConfig")

const greetingCard = require("../resources/greetingCard.json");
const optionCard = require("../resources/optionsCard.json");

class MyBot extends TeamsActivityHandler {
    constructor(conversationState, userState, dialog, conversationReferences) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.conversationReferences = conversationReferences;
        this.dialogState = this.conversationState.createProperty('DialogState');

        // this.onConversationUpdate(async (context, next) => {
        //     await this.addConversationReference(context);
        //     await next();
        // });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            await this.addConversationReference(context);
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity({
                        attachments: [CardFactory.adaptiveCard(greetingCard), CardFactory.adaptiveCard(optionCard)]
                    });
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            return await next();
        });

        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');
            // this.adapter = context.adapter;
            await this.addConversationReference(context);
            // Run the Dialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);

            return await next();
        });

        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });

        const handleTeamsSigninVerifyState = async (context, state) => {
            await this.dialog.run(context, this.dialogState);
        }
    }

    async addConversationReference(context) {
        let members = await TeamsInfo.getMembers(context);
        const conversationReference = TurnContext.getConversationReference(context.activity);
        return await cosmos.Upsert(members[0].userPrincipalName, conversationReference);
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);


        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}

module.exports.MyBot = MyBot;