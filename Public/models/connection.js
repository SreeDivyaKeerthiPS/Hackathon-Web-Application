

var topic, connectionId, name,host,details,date,time,location,pic,image;


var connection = function(parameter){
  var Model = {
		conTopic: parameter.topic,
    connectionId: parameter.connectionId,
    conName: parameter.name,
		conHost: parameter.host,
    conDetails: parameter.details,
    conDate: parameter.date,
    conTime:parameter.time,
    conLocation:parameter.location,
		//connectionPic:parameter.pic,
		connectionImage:parameter.image

  };
  return Model;
};



// defining getters and setters

Object.defineProperty(connection,"Topic",{
get:function(){
	return this.conTopic;
},


set:function(value){
	this.conTopic=value;
}

});
Object.defineProperty(connection,"connectionId",{
get:function(){
	return this.connectionId;
},

set:function(value){
	connectionId=value;
}

});
Object.defineProperty(connection,"Name",{
get:function(){
	return this.conName;
},

set:function(value){
	this.conName=value;
}

});
Object.defineProperty(connection,"Host",{
get:function(){
	return this.conHost;
},

set:function(value){
	this.conHost=value;
}

});


Object.defineProperty(connection,"Details",{
get:function(){
	return this.conDetails;
},

set:function(value){
	this.conDetails=value;
}

});
Object.defineProperty(connection,"Date",{
get:function(){
	return this.conDate;
},

set:function(value){
	this.conDate=value;
}

});

Object.defineProperty(connection,"Time",{
get:function(){
	return this.conTime;
},

set:function(value){
	this.conTime=value;
}

});
Object.defineProperty(connection,"Location",{
get:function(){
	return this.conLocation;
},

set:function(value){
	this.conLocation=value;
}

});

// Object.defineProperty(connection,"connectionPic",{
// get:function(){
// 	return pic;
// },
//
// set:function(value){
// 	pic=value;
// }
//
// });

Object.defineProperty(connection,"Image",{
get:function(){
	return this.connectionImage;
},

set:function(value){
	this.connectionImage=value;
}

});



module.exports.connection = connection;
