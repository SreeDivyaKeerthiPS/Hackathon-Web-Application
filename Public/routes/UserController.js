var express = require('express');
var session = require('express-session');
var router = express.Router();
var connectiondb = require('./../utility/connectionDB');
var userprofile = require('./../models/UserProfile');
var User = require('./../models/User')
var loginuser  = require('./../models/Login');
var userdb = require('./../utility/UserDb');
var userconnection = require('./../models/UserConnection');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var userprofiledata = require('./../utility/UserProfileDB');
var connection = require('./../models/connection');
const { check, validationResult } = require('express-validator');
var logininfodb = require('./../utility/logininfodb');
const { sanitizeBody } = require('express-validator');
var UserProfile;

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

var userinfo;
var userpassword;
var connId;
//  Login a user by initializing a UserProfile model and storing it in the session.
var regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!*?#])[A-Za-z\d@!*?#]{8,}$/);
  //Regex for password must contain at least eight characters, at least one number and both lower and uppercase letters and any of the special characters(@!*?#)
router.post('/loginuser', urlencodedParser, [check('username').isEmail().withMessage('Please enter a valid email ID'), check('password').custom(value => {

  // validates emailid and password
    var validate =  regex.test(value);
        if(value === ''){
            return Promise.reject('Password is empty. Please enter your password too');    // error message if the password filed is empty
        }else if (validate === false){
            return Promise.reject('Password doesnot match the valid password criteria.');    // error message if the password doesn't match the criteria
        }else{
            return true;
        }
  }) ],async  function(req,res,next){
          const errors = validationResult(req)
          if (!errors.isEmpty()) {
              return res.render('login',{session:req.session.theUser,error:errors.array() });  // renders login page with errors if validation fails
          }else if(req.body){
              await logininfodb.logininfo.findOne({email: req.body.username}).then( function(data) {   // if validation is success, this checks if the entered username exists in the database.
              userinfo = data;                                                                         // email which is sent as a request parameter to the DB is already validated previously
              });
              if(userinfo!=undefined && userinfo.password=== req.body.password ){  // if the username and password exists in database, this renders the saved connections of the user
                  var UserConnectionList = [];
                  var regexuserid = new RegExp(/^[0-9]+$/);                                 // validating user ids before retrieving data from userDb
                  useridvalid =  regexuserid.test(userinfo.userId);
                  console.log("userid validation: ",useridvalid);
                  if(useridvalid!== false){
                  let userdata =  userdb.getUserConnections(userinfo.userId);
                  userdata.then(async function(user) {
                  req.session.theUser =  new User.User(user.userId, user.firstName, user.lastName, user.email);
                  UserConnectionList = await userprofiledata.getUserProfile(req.session.theUser.UserID);
                  UserProfile = new userprofile.UserProfile(req.session.theUser.UserID, UserConnectionList);
                  req.session.theUser.currentProfile = UserProfile;
                   var regexid = new RegExp(/^[a-zA-Z0-9_-]+$/);
                   connId= true;                               // validating connection ids before rendering savedconnections page
                   UserConnectionList.forEach(function (item){
                    connId =  connId && regexid.test(item.connectionId);
                  });
                  console.log("connectionId validation for savedConnections-1: ", connId);

                  if(connId!==false){
                  res.render('savedConnections', {data: req.session.theUser.currentProfile, session: req.session.theUser, error:null});    // if the connectionid validation is success, render savedconnections view with the saved connections list
                }else{
                  req.session.theUser.currentProfile.UserConnectionList=[];
                  return res.render('savedConnections', {data: req.session.theUser.currentProfile, session: req.session.theUser,error:[{'msg': 'Connection ID of a connection is invalid. Hence,'}]});  // if the connectionid validation fails, render savedconnections view with error message
                }
                });
              }else{
                return res.render('login',{session:req.session.theUser,error:[{'msg': 'UserID validation status: Invalid userID'}]});  // if the username and password doesn't exist in database, this renders the login view with error message
              }
              }
              else{
                return res.render('login',{session:req.session.theUser,error:[{'msg': 'Username/Password is Invalid'}]});  // if the username and password doesn't exist in database, this renders the login view with error message
            }
          }
          });


// saves a user's rsvp for a connection - add a new connection to the user profile
router.post('/rsvp', urlencodedParser, async function (req, res) {
  console.log("inside /rsvp of usercontroller");
      var connectionId;

      if(req.session.theUser){
      if (Object.keys(req.query)[0] === 'connectionId') {
          connectionId = req.query.connectionId;
          console.log("connectionId: ",connectionId);
          await UserProfile.addConnection(connectionId,req.session.theUser.UserID, req.body.formValue);
          UserConnectionList = await userprofiledata.getUserProfile(req.session.theUser.UserID);  // UserId parameter is already validated and only if the userid is valid, req.session.theUser is initiated
          UserProfile = new userprofile.UserProfile(req.session.theUser.UserID, UserConnectionList);
          req.session.theUser.UserProfile = UserProfile;
          UserProfile.UserConnectionList = req.session.theUser.UserProfile.UserConnectionList;
          req.session.theUser.UserProfile = UserProfile;
          res.render('savedConnections', {data: req.session.theUser.UserProfile, session: req.session.theUser, error:null });

      }
    }else{
        res.redirect('/connections');
    }
  });



  //  Display a user's list of saved connections - list all user connections on the savedConnections view
  router.get('/', async function(req,res) {
console.log("inside / of usercontroller");
    if (req.session.theUser) {
      console.log("connectionId validation for savedConnections-2: ", connId);
        if(connId!==false){                    // validating connection ids before rendering savedconnections page
          UserConnectionList = await userprofiledata.getUserProfile(req.session.theUser.UserID);      // UserId parameter is already validated and only if the userid is valid, req.session.theUser is initiated
          UserProfile = new userprofile.UserProfile(req.session.theUser.UserID, UserConnectionList);
          req.session.theUser.UserProfile = UserProfile;
          UserProfile.UserConnectionList = req.session.theUser.UserProfile.UserConnectionList;
              res.render('savedConnections', { data: req.session.theUser.UserProfile, session: req.session.theUser, error:null });
            }else{
                req.session.theUser.currentProfile.UserConnectionList=[];
                return res.render('savedConnections', {data: req.session.theUser.currentProfile, session: req.session.theUser,error:[{'msg': 'Connection ID of a connection is invalid. Hence,'}]});
              }
        };
      });

router.post('/update', urlencodedParser, function (req, res) {
  console.log("inside /update of usercontroller");
// This function Updates a user's rsvp for a connection
    if(req.body.viewConnections === '8990'){
    if (req.body.formValue === 'Update') {
      if (req.session.theUser) {
        var connectionId;
        if (Object.keys(req.query)[0] === 'connectionId') {
            connectionId = req.query.connectionId;
            res.redirect('/connection?connectionId=' + connectionId)
        }
      }

    } else if (req.body.formValue === 'Delete') {
      console.log("inside /Delete of usercontroller");
      // This deletes a user's rsvp for a connection
        if (req.session.theUser) {
            if (Object.keys(req.query)[0] === 'connectionId') {
                connectionId = req.query.connectionId;
              //  UserProfile.UserConnectionList = req.session.theUser.UserProfile.UserConnectionList;
                UserProfile.removeConnection(req.session.theUser.UserID,connectionId);
                req.session.theUser.UserProfile = UserProfile;
                res.render('savedConnections', {data: req.session.theUser.UserProfile, session: req.session.theUser, error:null});

            }
        }

    }

}else{
    res.redirect('/savedConnections');
}

});


// Logouts a User or remove a user from the session
router.get('/logout', function (req, res) {
  console.log("inside /logout of usercontroller");
    UserProfile = undefined;
    req.session.theUser = undefined;
    req.session.destroy();
    res.redirect('/');

});




module.exports = {
    UserControllerRouter: router
}
