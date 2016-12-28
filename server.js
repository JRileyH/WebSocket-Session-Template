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
        if(global.sessions[i].host===req.connection.remoteAddress) {
            fs.readFile(__dirname + '/pages/host.html', cb);
            newConnection = false;
            break;
        }
        for(var j in global.sessions[i].clients) {
            if(global.sessions[i].clients[j]===req.connection.remoteAddress) {
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
io.sockets.on('connection', require('./packets/packet000')().serve);

app.listen(1337);
console.log('Server Running');