// class UserProfile {
//     id=0;
//     constructor(userName, movieName, cinemaHouseName, showTimings) {
//         this.userName = userName;
//         this.movieName = movieName;
//         this.cinemaHouseName = cinemaHouseName;
//         this.showTimings = showTimings;
//         this.ticketPrice = 220;
//         this.ticketId = ++id;
//     }
// }

const UserProfile = (function () {
    var nextID = 0;
    return function (userName, movieName, cinemaHouseName, showTimings) {
        this.id = nextID++;
        this.userName = userName;
        this.movieName = movieName;
        this.cinemaHouseName = cinemaHouseName;
        this.showTimings = showTimings;
    };
})();

module.exports.UserProfile = UserProfile;
