const { CardFactory } = require("botbuilder");
const { WaterfallDialog, TextPrompt, Dialog, ComponentDialog } = require("botbuilder-dialogs");

const { deleteBookingFromEmailCard, showDeleteBookingCard, messageCard } = require("../../resources/card");
const { getBookingDetailsByEmail, deleteBooking } = require("../../services/axios");

const optionCard = require("../../resources/optionsCard.json");

const CANCEL_TICKET_DIALOG = "CANCEL_TICKET_DIALOG";

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const EMAIL_PROMPT = 'EMAIL_PROMPT';

const BOOKING_STATUS_DATA_ACCESSOR = "bookingStatusDataAccessor";

class CancelTicketDialog extends ComponentDialog {
    constructor(conversationState, userState, telemetryClient) {
        super(CANCEL_TICKET_DIALOG);

        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.telemetryClient = telemetryClient;

        this.bookingStatusDataAccessor = this.userState.createProperty(BOOKING_STATUS_DATA_ACCESSOR);

        this.addDialog(new TextPrompt(EMAIL_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.getTicketIdStep.bind(this),
            this.showBookingStep.bind(this),
            this.cancelTicketStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async getTicketIdStep(step) {
        const emailCard = await step.context.sendActivity({
            text: "",
            attachments: [CardFactory.adaptiveCard(deleteBookingFromEmailCard())]
        });
        step.values.emailCardActivityID = emailCard.id;
        return Dialog.EndOfTurn;
    }

    async showBookingStep(step) {
        const email = step.context.activity.value.deleteBookingFromEmail;
        await step.context.deleteActivity(step.values.emailCardActivityID);
        const bookingDetails = await getBookingDetailsByEmail(email);
        if (bookingDetails.success) {
            await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(showDeleteBookingCard(bookingDetails.result))]
            });
            return Dialog.EndOfTurn;
        } else {
            await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(messageCard("This email ID has no bookings in our Database."))]
            });
        }
        await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(optionCard)]
        });
        return await step.endDialog();
    }

    async cancelTicketStep(step) {
        const deletedBookingBtn = step.context.activity.value.deletedBtnID;
        const result = await deleteBooking(deletedBookingBtn);
        await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(messageCard("Booking Deleted successfully..!!!"))]
        });
        await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(optionCard)]
        });
        return await step.endDialog();
    }
}

module.exports = { CancelTicketDialog, CANCEL_TICKET_DIALOG };