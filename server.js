var http = require('http');
var fs = require('fs');
var url = require('url');
var socket = require('socket.io')();
var util = require('./util')();

var landingHandler = function(req, res) {
    /* Landing Handler determines whether the connecting user is
    * a new user, a host of an existing session, or a client of 
    * an existing session. It then routes the page accordingly.
    * */
    var cb = function(err, data) {
        //sends data in response after path to right HTML has been determined
        if (err) {
            res.writeHead(500);
            console.error(err);
            return res.end('ERROR: Failed to load landing page');
        } else {
            res.writeHead(200);
            res.end(data);
        }
    };

    var path = url.parse(req.url, true).pathname;
    if (path === '/') {
        if (util.hostIndex(req.connection.remoteAddress)) {
            fs.readFile(__dirname + '/pages/host.html', cb);
        } else if (util.clientIndex(req.connection.remoteAddress)) {
            fs.readFile(__dirname + '/pages/client.html', cb);
        } else {
            fs.readFile(__dirname + '/pages/landing.html', cb);
        }
    } else { //for any requests that don't involve html pages
        fs.readFile(__dirname + path, cb);
    }
};

var app = http.createServer(landingHandler);
var io = socket.listen(app);
util.initSocket(io);

//sets events for connection and disconnection
io.sockets.on('connection', require('./packets/packet000')(util).serve);

app.listen(1337);
console.log('Server Running');