const { CardFactory } = require("botbuilder");
const { WaterfallDialog, TextPrompt, ComponentDialog, Dialog } = require("botbuilder-dialogs");

const { getBookingDetailsByEmail, getMovieByID, getTheatreByID } = require("../../services/axios");

const { getBookingStatusFromEmailCard, showBookingsStatusCard, messageCard } = require("../../resources/card");


const optionCard = require("../../resources/optionsCard.json");

const TICKET_STATUS_DIALOG = "TICKET_STATUS_DIALOG";

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const EMAIL_PROMPT = 'EMAIL_PROMPT';

const CANCEL_BOOKING_DATA_ACCESSOR = "cancelBookingDataAccessor";

class TicketStatusDialog extends ComponentDialog {
    constructor(conversationState, userState, telemetryClient) {
        super(TICKET_STATUS_DIALOG);

        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.telemetryClient = telemetryClient;

        this.cancelBookingDataAccessor = this.userState.createProperty(CANCEL_BOOKING_DATA_ACCESSOR);

        this.addDialog(new TextPrompt(EMAIL_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.getTicketIdStep.bind(this),
            this.showStatus.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async getTicketIdStep(step) {
        // console.log(step.options.msgId);
        // if (step.values.msgCardID) {
        //     await step.context.deleteActivity(step.values.msgCardID);
        // }
        const resCard = await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(getBookingStatusFromEmailCard())]
        });
        step.values.activityID = resCard.id;
        return Dialog.EndOfTurn;
    }

    async showStatus(step) {
        const email = step.context.activity.value.checkStatusFromEmail;
        await step.context.deleteActivity(step.values.activityID);
        const bookingDetails = await getBookingDetailsByEmail(email);
        if (bookingDetails.success) {
            await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(showBookingsStatusCard(bookingDetails.result))]
            });
        } else {
            await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(messageCard("This email ID has no bookings in our Database."))]
            });
            // const msgCard = await step.context.sendActivity({
            //     attachments: [CardFactory.adaptiveCard(messageCard("This email ID has no bookings in our Database."))]
            // });
            // step.values.msgCardID = msgCard.id;
            // return await step.replaceDialog(this.id, { msgId: msgCard.id });
        }
        await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(optionCard)]
        });
        return await step.endDialog();
    }
}

module.exports = { TicketStatusDialog, TICKET_STATUS_DIALOG };