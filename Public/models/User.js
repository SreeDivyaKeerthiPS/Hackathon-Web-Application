

// represents a user of the application with the following properties
var User =   function (UserID, FirstName, LastName,EmailAddress, Password) {
this.UserID = UserID;
this.FirstName = FirstName;
this.LastName = LastName;
this.EmailAddress = EmailAddress;
};


module.exports = {
    User: User
}
