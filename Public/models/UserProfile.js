var userconnection = require('./UserConnection');
var connectiondb = require('./../utility/connectionDB');
var userprofiledata = require('./../utility/UserProfileDB');

var UserProfile =
       function(UserId, UserConnectionList) {
            this.UserId = UserId;
            this.UserConnectionList = UserConnectionList;


            this.addConnection =  async function (Connection, userid, rsvp){
              console.log("inside addconnection of userprofile");
  // this function adds new connection data
              var update = false;
              var connectionObj;
                if(this.UserConnectionList==undefined || this.UserConnectionList==0){
                    connectionObj = await connectiondb.getConnection(Connection)
                    await userprofiledata.addRSVP(connectionObj, userid, rsvp);
              }
                else{
                    connectionObj =  await connectiondb.getConnection(Connection);
                    userconnectionobj = new userconnection.UserConnection(connectionObj,userid,rsvp);
                    update =  await this.updateRSVP(userconnectionobj,userid,rsvp);
                    if(update===false){
                      console.log("inside update false");
                          await userprofiledata.addRSVP(connectionObj, userid, rsvp);
                         var   userconnectionobj = new userconnection.UserConnection(connectionObj,userid,rsvp);
                         this.UserConnectionList.push(userconnectionobj);
                        }
                }
              }


              this.removeConnection = async function (userId,Connection) {
                console.log("inside removeConnection of userprofile");
          // this function removes the connection data
                  for (i = 0; i < this.UserConnectionList.length; i++) {
                      if(this.UserConnectionList[i].connectionId === Connection){
                          this.UserConnectionList.splice(i,1);

                          break;
                        }
                  }
               await userprofiledata.deleteuserconnection(userId, Connection);
                }

                this.updateRSVP = async function(userconnection){
                  console.log("inside updateRSVP of userprofile");
            // this function updates the rsvp of connection data
                    var update = false;
                     this.UserConnectionList.forEach(async function(item) {
                     if(item.connectionId === userconnection.Connection.connectionId ){
                      userprofiledata.updateRSVP(userconnection.Connection.connectionId,userconnection.User,userconnection.rsvp);
                           update = true;

                           }
                           console.log("update inside function is: ",update);
                        });
                    console.log("update outside function is: ",update);
                    return update;
                    console.log("update is: ",update);
                  }

                  this.getUserConnections = function(){
                    console.log("inside getUserConnections of userprofile");
            // this function returns a List/Collection of UserConnection from the user profile
                                    return this.UserConnectionList;
                                  }

                  };


module.exports = {
  UserProfile: UserProfile
}
