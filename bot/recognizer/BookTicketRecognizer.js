// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { CluRecognizer } = require('../clu/cluRecognizer');

class BookTicketRecognizer {
    constructor(config) {
        const cluIsConfigured = config && config.endpointKey && config.endpoint && config.projectName && config.deploymentName;
        if (cluIsConfigured) {
            this.recognizer = new CluRecognizer(config);
        }
    }

    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted CLU results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    async executeCluQuery(context) {
        return await this.recognizer.recognizeAsync(context);
    }

    getMovieNameEntities(response) {
        var result = response.result.prediction;
        let movieName;

        for (const entity of result.entities) {
            if (entity.category === 'nameOfMovie') {
                movieName = entity.extraInformation[0].key;
            }
        }

        const movieNameValue = movieName;

        return { movie: movieNameValue };
    }

    getCinemaNameEntities(response) {
        var result = response.result.prediction;
        let cinemaName;

        for (const entity of result.entities) {
            if (entity.category === 'cinemaName') {
                cinemaName = entity.extraInformation[0].key;
            }
        }

        const cinemaHouseValue = cinemaName;

        return { cinema: cinemaHouseValue };
    }

    getNumberOfSeatsEntities(response) {
        var result = response.result.prediction;
        let numberOfSeats;

        for (const entity of result.entities) {
            if (entity.category === 'numberOfSeats') {
                numberOfSeats = entity.resolutions[0].value;
            }
        }

        const numberOfSeatsValue = numberOfSeats;

        return { seats: numberOfSeatsValue };
    }

    /**
     * This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
     * TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
     */
    getBookingDateAndTime(response) {
        const result = response.result.prediction;
        let datetimeEntity;

        for (const entity of result.entities) {
            if (entity.category === 'time') {
                datetimeEntity = entity.resolutions;
            }
        }

        if (!datetimeEntity || !datetimeEntity[0]) return undefined;

        const timex = datetimeEntity[0].timex;
        if (!timex) return undefined;

        return timex;
    }

    topIntent(response) {
        return response.result.prediction.topIntent;
    }
}

module.exports.BookTicketRecognizer = BookTicketRecognizer;
