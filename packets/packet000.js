//packet000
//Connection packet
var socket = require('socket.io')();

module.exports = function(){
    var _p = {};
    var _me;
    var socket;
    _p.serve = function(socket) {
        _me = socket.handshake.address;
        console.log(_me + " - "+socket.id+" has landed");
        socket.on('hostConnect', require('./packet001')({ip:_me,id:socket.id}).serve);
        socket.on('clientConnect', require('./packet002')({ip:_me,id:socket.id}).serve);

        for(var i in global.sessions) {
            if(_me===global.sessions[i].host.ip) {
                global.sessions[i].lastConnected = _me;
                global.sessions[i].lastConnectionType = "host";
                global.sessions[i].host.id = socket.id;
                var distro = global.sessionDistribution(global.sessions[i].id)
                for(var j in distro){
                    distro[j].emit('broadcast', global.sessions[i]);
                }
                break;
            }
            for(var j in global.sessions[i].clients) {
                if(_me===global.sessions[i].clients[j].ip) {
                    global.sessions[i].lastConnected = _me;
                    global.sessions[i].lastConnectionType = "client"
                    global.sessions[i].clients[j].id = socket.id;
                    var distro = global.sessionDistribution(global.sessions[i].id)
                    for(var j in distro){
                        distro[j].emit('broadcast', global.sessions[i]);
                    }
                    break;
                }
            }
        }
    }
    _p.respond = function(){

    }
    return _p;
};