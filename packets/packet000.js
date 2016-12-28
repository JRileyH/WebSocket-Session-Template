//packet000
//Connection packet

module.exports = function(){
    var _p = {};
    var _me;
    var socket;
    _p.serve = function(socket) {
        _me = socket.handshake.address;
        console.log(_me + " has landed");
        socket.on('hostConnect', require('./packet001')(_me).serve);
        socket.on('clientConnect', require('./packet002')(_me).serve);
    }
    _p.respond = function(){

    }
    return _p;
};