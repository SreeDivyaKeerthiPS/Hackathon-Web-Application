var mongoose = require('mongoose'), Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/nbad', { useNewUrlParser: true, useUnifiedTopology: true});


var loginschema = new mongoose.Schema({
  userId: String,
  email: String,
  password: String
});

var logininfo = mongoose.model('logininfodb', loginschema, 'logininfodb');

var loginuser;
async function getLoginInfo(email){
  await logininfodb.findOne({"email": email}).then((data) => {
    loginuser= data;
    console.log("data inside db: ",data);
  }).catch((err)=>{
    console.log(err);
  });
  return loginuser;
};


module.exports.getLoginInfo = getLoginInfo;
module.exports.logininfo = logininfo;
