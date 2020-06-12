var connection = require('./../models/connection');
const shortid = require('shortid');
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;


mongoose.connect('mongodb://localhost/nbad', { useNewUrlParser: true, useUnifiedTopology: true});

var connectionschema = new mongoose.Schema({
  connectionId : String,
  topic : String,
  name: String,
  host: String,
  details: String,
  date: String,
  time: String,
  location: String,
  image: String
});

var connectionDb = mongoose.model('connectiondb', connectionschema);

// to all getconnections from Connection DB
async function getConnections(){
console.log("inside getConnections of connectionDB");
    var connections = [];
    await connectionDb.find({}).then((data) => {
connections = data;
          })
          .catch((err) => {
              console.log(err);
          });

  return connections;
}

async function getConnection(ConnectionId)
// to  get a connection  from Connection DB
 {
   console.log("inside getconnection of connectionDB");
        var newconnection;
        await connectionDb.findOne({ "connectionId" : ConnectionId}).then((data) =>{
    newconnection = data;
              })
              .catch((err) => {
                  console.log(err);
              });
      return newconnection;
    }



  module.exports.getConnections =getConnections;
  module.exports.getConnection=getConnection;
  module.exports.connectionDb=connectionDb;
