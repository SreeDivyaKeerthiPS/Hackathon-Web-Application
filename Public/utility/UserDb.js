var usermodel = require('./../models/User');
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;


mongoose.connect('mongodb://localhost/nbad', { useNewUrlParser: true, useUnifiedTopology: true});

var userschema = new mongoose.Schema({
  userId : String,
  firstName : String,
  lastName: String,
  email: String
});

var userDb = mongoose.model('userdb', userschema);


// this function returns user list from user DB
async function getUserConnections(userid){
var user;
await userDb.findOne({ "userId" : userid}).then((data) =>{
user = data;
      })
      .catch((err) => {
          console.log(err);
      });
      return user;
};

module.exports = {
   getUserConnections: getUserConnections

}
