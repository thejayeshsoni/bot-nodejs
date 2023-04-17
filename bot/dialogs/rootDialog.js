const { ComponentDialog,
    WaterfallDialog,
    DialogSet,
    ChoicePrompt,
    DialogTurnStatus
} = require("botbuilder-dialogs");

const { CardFactory, InputHints } = require("botbuilder");

const { CancelAndHelpDialog } = require("./cancelAndHelpDialog");

const { BOOK_TICKET_DIALOG, BookTicketDialog } = require("./booking-dialogs/bookTicketDialog");
const { TicketStatusDialog, TICKET_STATUS_DIALOG } = require("./booking-dialogs/ticketStatusDialog");
const { CancelTicketDialog, CANCEL_TICKET_DIALOG } = require("./booking-dialogs/cancelTiecketDialog");

const optionCard = require("../resources/optionsCard.json");

const ROOT_DIALOG = "ROOT_DIALOG";
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = "WATERFALL_DIALOG";

class RootDialog extends CancelAndHelpDialog {
    constructor(cluRecognizer, conversationState, userState, telemetryClient) {
        super(ROOT_DIALOG);

        if (!cluRecognizer) throw new Error('[MainDialog]: Missing parameter \'cluRecognizer\' is required');
        this.cluRecognizer = cluRecognizer;

        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.telemetryClient = telemetryClient;

        this.addDialog(new BookTicketDialog(conversationState, userState, telemetryClient));
        this.addDialog(new TicketStatusDialog(conversationState, userState, telemetryClient));
        this.addDialog(new CancelTicketDialog(conversationState, userState, telemetryClient));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }
    async initialStep(stepContext) {
        const bookingDetails = {};

        if (!this.cluRecognizer.isConfigured) {
            // CLU is not configured, we just run the BookingDialog path.
            return await stepContext.beginDialog(BOOK_TICKET_DIALOG, bookingDetails);
        }

        let choice;
        choice = stepContext.context.activity.value?.name;
        if (choice) {
            switch (choice) {
                case "book":
                    return await stepContext.beginDialog(BOOK_TICKET_DIALOG);
                case "status":
                    return await stepContext.beginDialog(TICKET_STATUS_DIALOG);
                case "cancel":
                    return await stepContext.beginDialog(CANCEL_TICKET_DIALOG);
                default:
                    return await stepContext.context.sendActivity({
                        attachments: [CardFactory.adaptiveCard(optionCard)]
                    });
            }
        } else {
            const cluResult = await this.cluRecognizer.executeCluQuery(stepContext.context);
            switch (this.cluRecognizer.topIntent(cluResult)) {
                case 'BookMovie': {
                    // Extract the values for the composite entities from the CLU result.
                    const movieDetails = this.cluRecognizer.getMovieNameEntities(cluResult);
                    const cinemaDetails = this.cluRecognizer.getCinemaNameEntities(cluResult);
                    const seatsToBeBookedDetails = this.cluRecognizer.getNumberOfSeatsEntities(cluResult);

                    // Show a warning for Origin and Destination if we can't resolve them.
                    // await this.showWarningForUnsupportedCities(stepContext.context, fromEntities, toEntities);

                    // Initialize BookingDetails with any entities we may have found in the response.
                    bookingDetails.movieTitle = movieDetails.movie;
                    bookingDetails.cinemaName = cinemaDetails.cinema;
                    bookingDetails.seatsToBeBooked = seatsToBeBookedDetails.seats;
                    console.log('CLU extracted these booking details:', JSON.stringify(bookingDetails));

                    // Run the BookingDialog passing in whatever details we have from the CLU call, it will fill out the remainder.
                    return await stepContext.beginDialog(BOOK_TICKET_DIALOG, bookingDetails);
                }

                case 'CancelTicket': {
                    return await stepContext.beginDialog(CANCEL_TICKET_DIALOG);
                }

                case 'TicektStatus': {
                    return await stepContext.beginDialog(TICKET_STATUS_DIALOG);
                }

                case 'None': {
                    await stepContext.context.sendActivity({
                        text: "How May I Help You..!!"
                    });
                    return await stepContext.context.sendActivity({
                        attachments: [CardFactory.adaptiveCard(optionCard)]
                    });
                }

                default: {
                    // Catch all for unhandled intents
                    const didntUnderstandMessageText = `Sorry, I didn't get that. Please try asking in a different way (intent was ${this.cluRecognizer.topIntent(cluResult)})`;
                    await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
                    return await stepContext.context.sendActivity({
                        attachments: [CardFactory.adaptiveCard(optionCard)]
                    });
                }
            }
        }
    }

    async finalStep(stepContext) {
        return await stepContext.endDialog();
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results && results.status === DialogTurnStatus.empty) {
            return await dialogContext.beginDialog(this.id);
        }
    }
}

module.exports = { RootDialog, ROOT_DIALOG };