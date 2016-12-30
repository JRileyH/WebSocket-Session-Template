var http = require('http');
var fs = require('fs');
var url = require('url');
var socket = require('socket.io')();

var i, j;

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
        var newConnection = true;   //if the user is not a host or client of an existing session
        //looking for if the connecting user is a host of an existing session
        for (i = 0; i < global.sessions.length; i++) {
            if (global.sessions[i].host.ip === req.connection.remoteAddress) {
                fs.readFile(__dirname + '/pages/host.html', cb);
                newConnection = false;
                break;
            }
            //looking for if the connecting user is a client of an existing session
            for (j = 0; i < global.sessions[i].clients.length; j++) {
                if (global.sessions[i].clients[j].ip === req.connection.remoteAddress) {
                    fs.readFile(__dirname + '/pages/client.html', cb);
                    newConnection = false;
                    break;
                }
            }
        }
        if (newConnection) {
            //The connecting user was not determined to be a host or client of an existing session
            //so bring them to the landing page where they can choose to host or join session
            fs.readFile(__dirname + '/pages/landing.html', cb);
        }
    } else { //for any requests that don't involve html pages
        fs.readFile(__dirname + path, cb);
    }
};

var app = http.createServer(landingHandler);
var io = socket.listen(app);

global.sessions = []; //globally accessible session information among all packets
global.sessionDistribution = function(sid, includeHost){
    /* Session Disitribution is a globally accessible function that returns an array
     * of sockets that belong to a specific session.
     * Param 1: Session ID of the specific session
     * Param 2: (optional)
     *          TRUE: Host & Clients included in distribution
     *          FALSE: Only Clients included in distribution
     *          Default: TRUE
     * Usage:   var distro = global.sessionDistribution('abcd', true);
                for(var i in distro){
                    distro[i].emit('broadcast', packet);
                }
     * */
    includeHost = includeHost || true;
    var distribution = [];
    for (var i in global.sessions) {
        if (global.sessions[i].id === sid) {
            var sesh = global.sessions[i];
            if (includeHost) {
                var host = sesh.host;
                if (host.id != null) {
                    distribution.push(io.sockets.sockets[host.id]);
                }
            }
            for (var j in sesh.clients) {
                if (sesh.clients[j].id != null) {
                    var client = sesh.clients[j];
                    distribution.push(io.sockets.sockets[client.id]);
                }
            }
            break;
        }
    }
    return distribution;
};

//sets events for connection and disconnection
io.sockets.on('connection', require('./packets/packet000')().serve);

app.listen(1337);
console.log('Server Running');