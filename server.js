var http = require('http');
var socket = require('socket.io')();
var handler = require('./handlers')

var app = http.createServer(handler.landing);
var io = socket.listen(app);

var connector = "";
var sessions = [];

io.sockets.on('connection', function(socket){
    connector = socket.handshake.address;
    console.log(connector + " landed");

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
        }else{
            console.log("Host "+connector+" already connected for Session "+session[sessionIndex].id);
        }
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
        }else{
            console.log("No Session "+data.sessionID+" found or "+connector+" already connected as client");
        }
    });
});

app.listen(1337);
console.log('Server Running');