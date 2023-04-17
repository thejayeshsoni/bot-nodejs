const { CardFactory, MessageFactory } = require('botbuilder');
const {
    ChoiceFactory,
    ChoicePrompt,
    ConfirmPrompt,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog,
    ComponentDialog,
    Dialog,
} = require("botbuilder-dialogs");

const { makeMovieCard, bookingConfimationCard } = require("../../resources/card");
const optionCard = require("../../resources/optionsCard.json");

const { getAllMoviesList, getAllTheatresList, getMovie, getTheatre, getShow, getUser, bookMovieTicket, getBookingDetails, sendBookingConfirmationMail } = require("../../services/axios");

const BOOK_TICKET_DIALOG = "BOOK_TICKET_DIALOG";

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const EMAIL_PROMPT = 'EMAIL_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

const BOOKING_DATA_ACCESSOR = "bookingDataAccessor";

class BookTicketDialog extends ComponentDialog {
    constructor(conversationState, userState, telemetryClient) {
        super(BOOK_TICKET_DIALOG);

        this.conversationState = conversationState;
        this.userState = userState;
        this.telemetryClient = telemetryClient;

        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');

        this.conversationState = conversationState;
        this.userState = userState;

        this.bookingDataAccessor = this.userState.createProperty(BOOKING_DATA_ACCESSOR);

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new TextPrompt(EMAIL_PROMPT, this.validateEmail));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.movieStep.bind(this),
            this.cinemaHouseStep.bind(this),
            this.showTimingStep.bind(this),
            this.seatsStep.bind(this),
            this.nameStep.bind(this),
            this.emailStep.bind(this),
            this.bookingConfirmStep.bind(this),
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async movieStep(step) {
        const bookingDetails = step.options;
        step.values.userInfo = {};
        if (!bookingDetails.movieTitle) {
            const movies = await getAllMoviesList();
            const movieCard = makeMovieCard(movies);
            const sendAdptiveCard = await step.context.sendActivity(MessageFactory.carousel(movieCard));
            step.values.activityID = sendAdptiveCard.id;
            return Dialog.EndOfTurn;
        }
        step.values.userInfo.movieName = bookingDetails.movieTitle;
        return await step.next(bookingDetails.movieTitle);
    }

    async cinemaHouseStep(step) {
        const bookingDetails = step.options;

        if (step.values.activityID) {
            step.values.userInfo.movieName = step.context.activity.value.name;
            await step.context.deleteActivity(step.values.activityID);
        }

        if (!bookingDetails.cinemaName) {
            const theatres = await getAllTheatresList();
            const theatresList = theatres.theatres.map(theatre => theatre.name);
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'Please choose a Cinema House.',
                choices: ChoiceFactory.toChoices(theatresList)
            });
        }
        step.values.userInfo.cinemaHouse = bookingDetails.cinemaName;
        return await step.next(bookingDetails.cinemaName);
    }

    async showTimingStep(step) {
        if (step.result.value) {
            step.values.userInfo.cinemaHouse = step.result.value;
        }
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please choose show Timings.',
            choices: ChoiceFactory.toChoices(['9:00-12:00', '12:15-15:15', '15:30-18:30', '18:45-21:45'])
        });
    }

    async seatsStep(step) {
        const bookingDetails = step.options;
        if (!bookingDetails.seatsToBeBooked) {
            step.values.userInfo.showTiming = step.result.value;
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'Please Provide how many seats you want to book.',
                choices: ChoiceFactory.toChoices(['1', '2', '3', '4'])
            });
        }
        step.values.userInfo.numberOfSeats = bookingDetails.seatsToBeBooked;
        return await step.next(bookingDetails.seatsToBeBooked);
    }

    async nameStep(step) {
        if (step.result.value) {
            step.values.userInfo.numberOfSeats = step.result.value;
        }
        return await step.prompt(NAME_PROMPT, 'Please enter your name.');
    }

    async emailStep(step) {
        step.values.userInfo.userName = step.result;
        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(`Thanks ${step.result}.`);
        return await step.prompt(EMAIL_PROMPT, 'Please enter your email.');
    }

    async bookingConfirmStep(step) {
        step.values.userInfo.userEmail = step.result;
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT, 'Do you want to confirm your booking?', ['yes', 'no']);
    }

    async summaryStep(step) {
        if (step.result) {
            const userProfile = step.values.userInfo;

            const movieObj = await getMovie(userProfile.movieName);
            const theatreObj = await getTheatre(userProfile.cinemaHouse);
            const showObj = await getShow(movieObj.movie.title, theatreObj.theatre.name);
            const userObj = await getUser(userProfile.userEmail);

            const booking = await bookMovieTicket(
                movieObj.movie._id,
                theatreObj.theatre._id,
                showObj.show._id,
                userObj.user._id,
                userProfile.numberOfSeats
            );

            const bookingDeatails = await getBookingDetails(booking.newBooking._id);

            if (bookingDeatails.success) {
                const { userEmail, movieName, cinemaHouse, numberOfSeats } = userProfile;
                const bookingConfirmation = await sendBookingConfirmationMail(userEmail, movieName, cinemaHouse, numberOfSeats, bookingDeatails.booking.totalPrice);
                // let msg2 = `Booking ID = ${bookingDeatsiils.booking._id}
                // User Name = ${bookingDeatsiils.booking.userId.name}
                // User Email = ${bookingDeatsiils.booking.userId.email}`;
                let msg2 = `Plz show this QR in Theatre.`
                await step.context.sendActivity(msg2);
                await step.context.sendActivity({
                    attachments: [CardFactory.adaptiveCard(bookingConfimationCard(movieName, cinemaHouse, numberOfSeats, bookingDeatails.booking.totalPrice, bookingConfirmation.result.secure_url, bookingConfirmation.result.public_id))]
                });
            } else {
                await step.context.sendActivity('Your Booking has not been completed due to some issue! plz try after some time');
            }
        } else {
            await step.context.sendActivity('Thanks. Your Booking has not be completed!');
        }

        await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(optionCard)]
        });

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is the end.
        return await step.endDialog();

    }
    validateEmail(prompt) {
        const email = prompt.recognized.value;
        var EMAIL_REGEXP = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$', 'i');
        return EMAIL_REGEXP.test(email)
    }
}

module.exports = { BookTicketDialog, BOOK_TICKET_DIALOG };