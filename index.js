#!/usr/bin/env node
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

// error handling function...still don't understand this one
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, "An error has occurred.  My bad.");
});

var server = app.listen(process.env.PORT || 8100, function() {
    console.log("Application listening on %d", server.address().port);
});


