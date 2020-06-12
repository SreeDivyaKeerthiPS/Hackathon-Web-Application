var express = require('express');
var app = express();
var session = require('express-session');
var flash = require("connect-flash");
app.use(session({ secret: 'Sree Divya Keerthi PS' }));
var usercontrollerRouter = require('./routes/UserController');
var connectionController = require('./routes/connectionController.js');
app.use('/assets', express.static('assets'));

var mongoose = require("mongoose");
app.use(flash());

app.set('view engine', 'ejs');

app.use('/savedConnections', usercontrollerRouter.UserControllerRouter);
app.use('/', connectionController);
// app.use('/',connectionController);


 app.get('/*', function (req, res) {
     res.redirect('/');
  });
app.listen(8084);
