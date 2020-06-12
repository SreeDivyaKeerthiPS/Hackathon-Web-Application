var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var connectionDb = require('./connectionDB');
const shortid = require('shortid');
var express = require('express');
var session = require('express-session');
var userprofile = require('./../models/UserProfile');

mongoose.connect('mongodb://localhost/nbad', { useNewUrlParser: true, useUnifiedTopology: true});

var userprofileschema = new mongoose.Schema({
   userId: String,
   connectionId: String,
   topic: String,
   name:String,
   rsvp: String

});

var userprofileDb = mongoose.model('userprofiledb',userprofileschema);

// getuserconnections from userProfile DB
async function getUserProfile(userId){
console.log("inside getUserProfile of UserprofileDB");
    var UserProfileconnections = [];
    await userprofileDb.find({userId: userId}).then((data) => {
UserProfileconnections = data;
          })
          .catch((err) => {
              console.log(err);
          });
  return UserProfileconnections;
}

// to add userconnection to userProfile DB
async function addRSVP(connectionobj, userId, rsvp) {
console.log("inside addRSVP of UserprofileDB");
        return new Promise((resolve, reject) => {
          let theConnections = new userprofileDb({
            userId: userId,
            connectionId: connectionobj.connectionId,
            topic: connectionobj.topic,
            name:connectionobj.name,
            rsvp: rsvp,
          });

          theConnections.save(async function (err, data) {
            console.log("data added to userprofiledb", data);
            if (data) resolve(data);
            else return reject(err);
          });
        });
    };

// to delete userconnection from userProfile DB
async function deleteuserconnection(userId,connectionId){
  console.log("inside deleteuserconnection of UserprofileDB");
  var deleteddata = userprofileDb.deleteOne({userId: userId, connectionId:connectionId}, function (err) {
        if (err) return handleError(err);
      });

}

// to update rsvp of userconnection
async function updateRSVP(connectionId, userId, rsvp){
    console.log("inside updateRSVP of UserprofileDB");
    return new Promise(async function(resolve, reject){
    await userprofileDb
        .findOneAndUpdate({userId: userId, connectionId:connectionId}, { $set: { rsvp: rsvp } },
          { new: true, upsert: true },
          function (err, data) {
            console.log("connection either updated or added.");
            console.log(data);
            resolve(data);
          }
        )
        .catch((erro) => {
          return reject(err);
        });
    });
  }


  // to add new connection to connection DB
  async function addNewconnection(newconnection) {
          console.log("inside addNewconnection of userprofileDB");
                return new Promise(async (resolve, reject) => {
                  let theCourse = new connectionDb.connectionDb({
                    connectionId : shortid.generate(),
                    topic: newconnection.Topic,
                    name: newconnection.Name,
                    date: newconnection.Date,
                    host: newconnection.Host,
                    details: newconnection.Details,
                    time: newconnection.Time,
                    location: newconnection.Location,
                  });

                  theCourse.save(async function (err, data) {
                    console.log(data);
                    if (data) resolve(data);
                    else return reject(err);
                  });
                });

              }

module.exports.addRSVP = addRSVP;
module.exports.getUserProfile = getUserProfile;
module.exports.deleteuserconnection = deleteuserconnection;
module.exports.updateRSVP = updateRSVP;
module.exports.addNewconnection=addNewconnection;
