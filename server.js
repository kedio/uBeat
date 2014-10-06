var express = require('express');
var app = express();

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/partials', express.static(__dirname + '/partials'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.all('/*', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

console.log('serving on port 4000...');
app.listen(4000);