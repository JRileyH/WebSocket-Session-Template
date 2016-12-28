//packet000
//Connection packet
var socket = require('socket.io')();

module.exports = function(){
    var _p = {};
    var _me;
    _p.serve = function(socket) {
        _me = socket.handshake.address; //gets the currect connecting user's ip address
        console.log(_me + " - "+socket.id+" has landed");

        //set up event listeners for host and client connections
        socket.on('hostConnect', require('./packet001')({ip:_me,id:socket.id}).serve);
        socket.on('clientConnect', require('./packet002')({ip:_me,id:socket.id}).serve);

        for(var i in global.sessions) {
            //looking for if connecting user is already a host of an existing session
            if(_me===global.sessions[i].host.ip) {
                //updates global session info
                global.sessions[i].lastConnected = _me;
                global.sessions[i].lastConnectionType = "host";
                global.sessions[i].host.id = socket.id;
                //broadcasts updated session info to all session members
                var distro = global.sessionDistribution(global.sessions[i].id)
                for(var j in distro){
                    distro[j].emit('broadcast', global.sessions[i]);
                }
                break;
            }
            for(var j in global.sessions[i].clients) {
                //looking for if connecting user is already a client of an existing session
                if(_me===global.sessions[i].clients[j].ip) {
                    //updates global session info
                    global.sessions[i].lastConnected = _me;
                    global.sessions[i].lastConnectionType = "client"
                    global.sessions[i].clients[j].id = socket.id;
                    //broadcasts updated session info to all session members
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