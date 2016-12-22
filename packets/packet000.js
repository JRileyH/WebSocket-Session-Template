//packet000
//Connection packet

module.exports = function(){
    var _p = {};
    var _me;
    var socket;
    _p.construct = function(socket) {
        _me = socket.handshake.address;
        console.log(_me + " has landed");

        for(var i in global.sessions) {
            if(global.sessions[i].host===connector) {
                //redirect to host
                break;
            }
            for(var j in global.sessions[i].clients) {
                if(global.sessions[i].clients===connector) {
                    //redirect to client
                    break;
                }
            }
        }

        socket.on('hostConnect', require('./packet001')(_me).construct);
        socket.on('clientConnect', require('./packet002')(_me).construct);
    }
    _p.emit = function(){

    }
    return _p;
};