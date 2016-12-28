var http = require('http');
var fs = require('fs');
var url = require('url');
var socket = require('socket.io')();

var landingHandler = function(req, res){
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

    var newConnection = true;
    for(var i in global.sessions) {
        if(global.sessions[i].host.ip===req.connection.remoteAddress) {
            fs.readFile(__dirname + '/pages/host.html', cb);
            newConnection = false;
            break;
        }
        for(var j in global.sessions[i].clients) {
            if(global.sessions[i].clients[j].ip===req.connection.remoteAddress) {
                fs.readFile(__dirname + '/pages/client.html', cb);
                newConnection = false;
                break;
            }
        }
    }
    if(newConnection){
        fs.readFile(__dirname + '/pages/landing.html', cb);
    }
};

var app = http.createServer(landingHandler);
var io = socket.listen(app);

global.sessions = [];
global.sessionDistribution = function(sid, includeHost){
    includeHost=includeHost||true;
    var distribution = [];
    for(var i in global.sessions){
        var sesh = global.sessions[i];
        if(sesh.id===sid){
            if(includeHost){
                var host = sesh.host;
                distribution.push(io.sockets.sockets[host.id]);
            }
            for(var j in sesh.clients){
                var client = sesh.clients[j];
                distribution.push(io.sockets.sockets[client.id]);
            }
            break;
        }
    }
    return distribution;
}
io.sockets.on('connection', require('./packets/packet000')().serve);
io.sockets.on('disconnect', require('./packets/packet999')().serve);

app.listen(1337);
console.log('Server Running');