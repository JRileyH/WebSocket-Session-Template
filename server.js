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

global.sessions = [];
io.sockets.on('connection', require('./packets/packet000')().construct);

app.listen(1337);
console.log('Server Running');