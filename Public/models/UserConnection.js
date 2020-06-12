


// this represents a connection object saved to the user profile with two properties: Connection and rsvp
var UserConnection = function (Connection,User, rsvp) {
    this.Connection = Connection;
    this.User = User
    this.rsvp = rsvp;
    };

    module.exports = {
        UserConnection: UserConnection
    }
