const { CardFactory } = require("botbuilder")

// const showStatusDetailsCard = (userName, userEmail, seatsBooked, totalBookings, totalPrice, movieName, theatreName) => {
//     return {
//         "type": "AdaptiveCard",
//         "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
//         "version": "1.3",
//         "body": [
//             {
//                 "type": "ColumnSet",
//                 "columns": [
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": "Name:",
//                                 "wrap": true,
//                                 "horizontalAlignment": "center"
//                             }
//                         ]
//                     },
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": `${userName}`,
//                                 "wrap": true,
//                                 "horizontalAlignment": "center"
//                             }
//                         ]
//                     }
//                 ],
//                 "horizontalAlignment": "Left"
//             },
//             {
//                 "type": "ColumnSet",
//                 "columns": [
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": "Email:",
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     },
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": `${userEmail}`,
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "type": "ColumnSet",
//                 "columns": [
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": "Seats Booked:",
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     },
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": `${seatsBooked}`,
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "type": "ColumnSet",
//                 "columns": [
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": "Total Price:",
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     },
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": `${totalPrice}`,
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "type": "ColumnSet",
//                 "columns": [
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": "Movie:",
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     },
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": `${movieName}`,
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "type": "ColumnSet",
//                 "columns": [
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": "Theatre:",
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     },
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": `${theatreName}`,
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "type": "ColumnSet",
//                 "columns": [
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": "Total Booking:",
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     },
//                     {
//                         "type": "Column",
//                         "width": "stretch",
//                         "items": [
//                             {
//                                 "type": "TextBlock",
//                                 "text": `${totalBookings}`,
//                                 "wrap": true,
//                                 "horizontalAlignment": "Center"
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     };
// };

const showBookingsStatusCard = (bookings) => {
    const bodyItems = [];
    for (const iterator of bookings) {
        bodyItems.push({
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Movie",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Theatre",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Seats Booked",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Total Price",
                            "wrap": true
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": `${iterator.showTimeId.movieId.title}`,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": `${iterator.showTimeId.theatreId.name}`,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": `${iterator.seatsBooked}`,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": `${iterator.totalPrice}`,
                            "wrap": true
                        }
                    ]
                }
            ],
            "separator": true
        });
    }

    const card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "auto",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Total Bookings:",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "auto",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${bookings.length}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Name",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "Email",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${bookings[0].userId.name}`,
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": `${bookings[0].userId.email}`,
                                "wrap": true
                            }
                        ]
                    }
                ],
                "separator": true
            },
            // {
            //     "type": "ColumnSet",
            //     "columns": [
            //         {
            //             "type": "Column",
            //             "width": "stretch",
            //             "items": [
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "Movie",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "Theatre",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "Seats Booked",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "Total Price",
            //                     "wrap": true
            //                 }
            //             ]
            //         },
            //         {
            //             "type": "Column",
            //             "width": "stretch",
            //             "items": [
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "New TextBlock",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "New TextBlock",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "New TextBlock",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "New TextBlock",
            //                     "wrap": true
            //                 }
            //             ]
            //         }
            //     ],
            //     "separator": true
            // }
        ]
    };

    for (const iterator of bodyItems) {
        card.body.push(iterator);
    }

    return card;
};

const getBookingStatusFromEmailCard = () => {
    return {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "Input.Text",
                "placeholder": "abc@example.com",
                "label": "Email for checking Status of your Booking",
                "id": "checkStatusFromEmail",
                "isRequired": true,
                "errorMessage": "please enter a valid email",
                "regex": "^[a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,15})$"
            },
            {
                "type": "ActionSet",
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Check",
                        "id": "checkStatusButton"
                    }
                ]
            }
        ]
    }
};

const deleteBookingFromEmailCard = () => {
    return {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "Input.Text",
                "placeholder": "abc@example.com",
                "label": "Please Provide Your Email for deleting your Booking",
                "id": "deleteBookingFromEmail",
                "isRequired": true,
                "errorMessage": "please enter a valid email",
                "regex": "^[a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,15})$"
            },
            {
                "type": "ActionSet",
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Check",
                        "id": "deteleBookingButton"
                    }
                ]
            }
        ]
    };
};

const showDeleteBookingCard = (bookings) => {
    const bodyItems = [];
    for (const iterator of bookings) {
        bodyItems.push({
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Movie",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Theatre",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Seats Booked",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Total Price",
                            "wrap": true
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": `${iterator.showTimeId.movieId.title}`,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": `${iterator.showTimeId.theatreId.name}`,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": `${iterator.seatsBooked}`,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": `${iterator.totalPrice}`,
                            "wrap": true
                        }
                    ]
                }
            ],
            "separator": true,
        }, {
            "type": "ActionSet",
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Delete Booking",
                    "id": `${iterator._id}`,
                    "data": {
                        "deletedBtnID": `${iterator._id}`
                    }
                }
            ]
        });
    }

    const card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "auto",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Total Bookings:",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "auto",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${bookings.length}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Name",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "Email",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${bookings[0].userId.name}`,
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": `${bookings[0].userId.email}`,
                                "wrap": true
                            }
                        ]
                    }
                ],
                "separator": true
            },
            // {
            //     "type": "ColumnSet",
            //     "columns": [
            //         {
            //             "type": "Column",
            //             "width": "stretch",
            //             "items": [
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "Movie",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "Theatre",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "Seats Booked",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "Total Price",
            //                     "wrap": true
            //                 }
            //             ]
            //         },
            //         {
            //             "type": "Column",
            //             "width": "stretch",
            //             "items": [
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "New TextBlock",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "New TextBlock",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "New TextBlock",
            //                     "wrap": true
            //                 },
            //                 {
            //                     "type": "TextBlock",
            //                     "text": "New TextBlock",
            //                     "wrap": true
            //                 }
            //             ]
            //         }
            //     ],
            //     "separator": true
            // }
        ]
    };

    for (const iterator of bodyItems) {
        card.body.push(iterator);
    }

    return card;
};

// const showMoviesCard = (movies) => {
//     const card = {
//         "type": "AdaptiveCard",
//         "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
//         "version": "1.3",
//         "body": [
//             {
//                 "type": "ColumnSet",
//                 "columns": []
//             }
//         ],
//         "verticalContentAlignment": "Center"
//     };
//     for (const iterator of movies) {
//         let movieCard = {
//             "type": "Column",
//             "width": "auto",
//             "items": [
//                 {
//                     "type": "Image",
//                     "size": "medium",
//                     "horizontalAlignment": "center"
//                 },
//                 {
//                     "type": "TextBlock",
//                     "text": `${iterator.title}`,
//                     "wrap": true,
//                     "id": `${iterator._id}`,
//                     "horizontalAlignment": "Center",
//                     "separator": true
//                 },
//                 {
//                     "type": "TextBlock",
//                     "text": `${iterator.genre}`,
//                     "wrap": true,
//                     "id": `${iterator.genre}`,
//                     "separator": true,
//                     "horizontalAlignment": "Center"
//                 },
//                 {
//                     "type": "ActionSet",
//                     "actions": [
//                         {
//                             "type": "Action.Submit",
//                             "title": "Book",
//                             "id": "bookBtn",
//                             "data": {
//                                 "clickedMovieId": `${iterator._id}`
//                             }
//                         }
//                     ],
//                     "separator": true,
//                     "spacing": "None",
//                     "horizontalAlignment": "Center"
//                 }
//             ],
//             "verticalContentAlignment": "Center",
//             "horizontalAlignment": "Center"
//         };
//         card.body[0].columns.push(movieCard);
//     }
//     return card;
// };

const makeMovieCard = (movies) => {
    let moviesCards = [];
    for (let index = 0; index < movies.movies.length; index++) {
        let adaptiveCard = CardFactory.adaptiveCard(
            {
                "type": "AdaptiveCard",
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.3",
                "id": "my-adaptive-card",
                "body": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "auto",
                                "items": [
                                    {
                                        "type": "Image",
                                        "url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.p9bs2vbWYWdV1KxoQnzQqgHaKU%26pid%3DApi&f=1&ipt=4ace0d2c4b2d2c9a325d0b5de04c0e7673f04224b052c9d6ddb44afa3c57774c&ipo=images",
                                        "spacing": "none",
                                        "horizontalAlignment": "center",
                                        "size": "medium",
                                        "separator": true
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": `${movies.movies[index].title}`,
                                        "wrap": true,
                                        "horizontalAlignment": "Center",
                                        "separator": true,
                                        "spacing": "Small",
                                        "size": "Default"
                                    },
                                    {
                                        "type": "ActionSet",
                                        "actions": [
                                            {
                                                "type": "Action.Submit",
                                                "title": "Book",
                                                "data": {
                                                    name: `${movies.movies[index].title}`
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
        moviesCards.push(adaptiveCard);
    }
    return moviesCards;
}

const bookingConfimationCard = (movieName, theatreName, seatesBooked, totalPrice, qrcode_url, qrcodeImage_id) => {
    const card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.4",
        "body": [
            {
                "type": "Image",
                "url": `${qrcode_url}`,
                "altText": "qrcode",
                "id": `${qrcodeImage_id}`,
                "separator": true,
                "horizontalAlignment": "Center",
                "backgroundColor": "blac",
                "size": "Large"
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Movie",
                                "wrap": true
                            }
                        ],
                        "horizontalAlignment": "Center"
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${movieName}`,
                                "wrap": true
                            }
                        ],
                        "horizontalAlignment": "Center"
                    }
                ],
                "separator": true
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Theatre",
                                "wrap": true
                            }
                        ],
                        "horizontalAlignment": "Center"
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${theatreName}`,
                                "wrap": true
                            }
                        ],
                        "horizontalAlignment": "Center"
                    }
                ],
                "separator": true
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Seats Booked",
                                "wrap": true
                            }
                        ],
                        "horizontalAlignment": "Center"
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${seatesBooked}`,
                                "wrap": true
                            }
                        ],
                        "horizontalAlignment": "Center"
                    }
                ],
                "separator": true
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Total Price",
                                "wrap": true
                            }
                        ],
                        "horizontalAlignment": "Center"
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${totalPrice}`,
                                "wrap": true
                            }
                        ],
                        "horizontalAlignment": "Center"
                    }
                ],
                "separator": true
            }
        ]
    }
    return card;
}

const messageCard = (msg) => {
    const card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.4",
        "body": [
            {
                "type": "RichTextBlock",
                "inlines": [
                    {
                        "type": "TextRun",
                        "text": `${msg}`
                    }
                ],
                "id": "msgCard",
                "horizontalAlignment": "center"
            }
        ]
    };
    return card;
};
module.exports = { getBookingStatusFromEmailCard, showBookingsStatusCard, makeMovieCard, deleteBookingFromEmailCard, showDeleteBookingCard, bookingConfimationCard, messageCard };