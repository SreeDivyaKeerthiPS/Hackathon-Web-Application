

var email,password;

var loginuser = function(parameter){
  var loginmodel = {
    useremail: parameter.email,
  userpassword: parameter.password
};
return loginmodel;
};


Object.defineProperty(loginuser,"Email",{
get:function(){
	return this.useremail;
},


set:function(value){
	this.useremail=value;
}

});
Object.defineProperty(loginuser,"Password",{
get:function(){
	return this.userpassword;
},

set:function(value){
 this.userpassword=value;
}
});
loginuser.Email = "testing";
module.exports.loginuser = loginuser;
