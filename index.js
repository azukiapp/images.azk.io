var express = require('express');
var app     = express();
var morgan  = require('morgan');

var dotenv  = require('dotenv');
dotenv.load();

// set the static files location /build
app.use(express.static(__dirname + '/build'));
app.use(morgan('dev'));
app.listen(8080);
console.log("App listening on port 8080");
