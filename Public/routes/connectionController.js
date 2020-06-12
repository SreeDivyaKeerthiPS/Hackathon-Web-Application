var express = require('express');
var router = express.Router();
var connectiondb = require('./../utility/connectionDB');
var connection = require('./../models/connection');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const shortidgenerator = require('shortid');
var userprofiledata = require('./../utility/UserProfileDB');
const { check, validationResult } = require('express-validator');
const moment = require('moment');


// this function returns the connections list
async function Connectionsdata(){
  console.log("inside Connectionsdata of conncontroller");
  var connectiondetails = {};
  var connectdata = await connectiondb.getConnections();
  connectdata.forEach(function(item){
    if (item.topic in connectiondetails){
      connectiondetails[item.topic].push([item.name,item.connectionId]);
    } else{
      connectiondetails[item.topic] = [[item.name,item.connectionId]];
    }
  });
  return connectiondetails;
}

// this function returns each connection based on its ID.
async function ConnectionsdataID(req,res,connId){
  console.log("inside ConnectionsdataID of conncontroller");
  var regexid = new RegExp(/^[a-zA-Z0-9_-]+$/);                                  // validating connectionID for connection view
  var connId =  regexid.test(req.query.connectionId);
  console.log("connectionid validation for connection view: ", connId);
  if(connId !== false){
    let connData =await connectiondb.getConnection(req.query.connectionId);
    if(connData !== undefined){
    res.render('connection', {connectionData: connData,session:req.session.theUser});
  } else{
    var connectiondetails = Connectionsdata();
    res.render('connections', {connectionData:connectiondetails, session:req.session.theUser });
  }
}
}


router.get('/', function(req, res){
  res.render('index',{session:req.session.theUser});
})

router.get('/connections', function(req, res){
  console.log("inside /connections of conncontroller");
let promise = Connectionsdata();
promise.then(function(connectionData) {
res.render('connections', {connectionData:connectionData, session:req.session.theUser} );
})
})
router.get('/connection', function(req, res){
  console.log("inside /connection of conncontroller");
ConnectionsdataID(req,res,req.query.connectionId);
  router.get('/*',function(req,res){
    res.render('index',{session:req.session.theUser});
  });
})

router.get('/savedConnections', function(req, res){
  console.log("inside /savedConnections of conncontroller");
  res.render('savedConnections',{session:req.session.theUser});
})

router.get('/newConnection', function (req, res) {
  console.log("inside /newConnection of conncontroller");
  res.render('newConnection',{session:req.session.theUser,error:null});
})
router.get('/about', function(req, res){
  res.render('about',{session:req.session.theUser});
})
router.get('/contact', function(req, res){
  res.render('contact',{session:req.session.theUser});
})
router.get('/login', function(req, res){
  return res.render('login',{session:req.session.theUser,error:null});
})


//to create newhackathon
var regexdate = new RegExp(/^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/);
var regextime = new RegExp(/^(10|11|12|[1-9]):[0-5][0-9] (AM|PM)$/);
var regexdetails = new RegExp(/^[a-zA-Z0-9!@#$%^&*()_+-={};':"|,.<>\/?]*$/);
let now = moment();
router.post('/createhackathon', urlencodedParser, [check('topic').trim().isLength({min: 3, max: 100}).withMessage("Topic should contain minimum 3 letters and max of 30 letters."),
                                                    check('name').trim().isAlpha().withMessage("Name should contain only Alphabets").isLength({min: 3, max: 30}).withMessage("Name Length should be of minimum 3 and max of 30"),
                                                    check('date').trim().matches(regexdate).withMessage("Enter Valid date format mm/dd/yyyy or  mm.dd.yyyy or  mm-dd-yyyy").isAfter(now.format('MM/DD/YYYY')).withMessage("Please enter Future Date"),
                                                    check('details').isLength({min: 10}).withMessage("Details length should be of minimum 10"),
                                                    check('location').isLength({min: 2}).withMessage("Location length should be minimum 2 ")], async function(req,res){

console.log("inside /createhackathon of conncontroller");
const errors = validationResult(req)
    if (!errors.isEmpty()) {
    return res.render('newConnection',{session:req.session.theUser, error: errors.array() });
  }else{
      connection.connection.Topic = req.body.topic;
      connection.connection.Name = req.body.name;
      connection.connection.Date = (req.body.date);
      connection.connection.Host = req.session.theUser.FirstName;
      connection.connection.Details = (req.body.details);
      connection.connection.Time = (req.body.time);
      connection.connection.Location = (req.body.location);
await userprofiledata.addNewconnection(connection.connection);
let promise = Connectionsdata();
promise.then(function(connectionData) {
res.render('connections', {connectionData:connectionData, session:req.session.theUser} );

})
}
});

module.exports = router;
