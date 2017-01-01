var http = require('http');
var fs = require('fs');
var url = require('url');
var socket = require('socket.io')();
var util = require('./server-util')();

var landingHandler = function(req, res) {
    /* Landing Handler determines whether the connecting user is
    * a new user, a host of an existing session, or a client of 
    * an existing session. It then routes the page accordingly.
    * */

    var getCookie = function(cname) {
        var name = cname + '=';
        var ca = req.headers.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    };

    var cb = function(err, data) {
        //sends data in response after path to right HTML has been determined
        if (err) { //send server error response
            res.writeHead(500);
            console.error(err);
            return res.end('ERROR: Failed to load landing page');
        } else { //send OK response
            res.writeHead(200);
            res.end(data);
        }
    };

    var connectorGUID = getCookie('websocketguid');

    //find path of url
    var path = url.parse(req.url, true).pathname;
    if (path === '/') { //if root path (one of the app pages)

        if (util.hostIndex(connectorGUID)) { //detect if host
            //return host landing page
            fs.readFile(__dirname + '/pages/host.html', cb);
        } else if (util.clientIndex(connectorGUID)) { //detect if client
            //return client landing page
            fs.readFile(__dirname + '/pages/client.html', cb);
        } else { //neither host nor client
            //return landing page where they can choose to be host or client
            fs.readFile(__dirname + '/pages/landing.html', cb);
        }
    } else { //not an app page (some other extranious resource)
        fs.readFile(__dirname + path, cb);
    }
};

var app = http.createServer(landingHandler);
var io = socket.listen(app);

//initialized socket.io object for the utility module
util.initSocket(io);

//sets events for connection and disconnection
io.sockets.on('connection', require('./packets/packet000')(util).serve);

app.listen(1337);
console.log('Server Running');