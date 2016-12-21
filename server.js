var http = require('http');
var fs = require('fs');
var url = require('url');
var socket = require('socket.io')();

var landingHandler = function(req, res){
    var path = url.parse(req.url).pathname;
    var cb = function(err, data){
        if(err){
            res.writeHead(500);
            console.error(err);
            return res.end("ERROR: Failed to load landing page");
        }else{
            res.writeHead(200);
            res.end(data);
        }
    }

    switch(path) {
        case '/host':
            fs.readFile(__dirname + '/pages/host.html', cb);
            break;

        case '/client':
            fs.readFile(__dirname + '/pages/host.html', cb);
            break;
        
        case '/':
        default:
            fs.readFile(__dirname + '/pages/landing.html', cb);
            break;
    }
};

var app = http.createServer(landingHandler);
var io = socket.listen(app);

var connector = "";
var sessions = [];

io.sockets.on('connection', function(socket){
    connector = socket.handshake.address;
    console.log(connector + " landed");

    for(var i in sessions){
        if(sessions[i].host===connector){
            var packet = {index:i};
            socket.emit('redirectHost', packet);
            break;
        }
        for(var j in sessions[i].clients){
            if(sessions[i].clients===connector){
                var packet = {index:i};
                socket.emit('redirectClient', packet);
                break;
            }
        }
    }

    socket.on('hostConnect', function(data){
        var sessionIndex = null;
        var sessionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
        var createSession = true;
        for(var i in sessions){
            if(sessions[i].host===connector){
                sessionIndex = i;
                createSession = false;
                break;
            }else if(sessions[i].id===sessionID){
                sessionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
                i=-1;continue;
            }
        }
        if(createSession){
            console.log(connector + " connected as Host for Session "+ sessionID);
            sessions.push({
                host:connector,
                id:sessionID,
                clients:[]
            });
            var packet = {index:sessionIndex};
            socket.emit('redirectHost', packet);
        }else{
            console.log("Host "+connector+" already connected for Session "+session[sessionIndex].id);
        }
        console.log(sessions);
    });

    socket.on('clientConnect', function(data){
        var sessionIndex = null;
        var joinSession = false;
        for(var i in sessions){
            if(sessions[i].id===data.sessionID){
                sessionIndex = i;
                var inSession = false;
                for(var j in sessions[i].clients){
                    if(sessions[i].clients[j]===connector){
                        inSession=true;
                        break;
                    }
                }
                joinSession=!inSession;
                break;
            }
        }
        if(joinSession){
            sessions[sessionIndex].clients.push(connector);
            var packet = {index:sessionIndex};
            socket.emit('redirectClient', packet);
        }else{
            console.log("No Session "+data.sessionID+" found or "+connector+" already connected as client");
        }
        console.log(sessions);
    });
});

app.listen(1337);
console.log('Server Running');