//packet999
//Disconnect packet

module.exports = function(){
    var _p = {};
    var _me;
    var socket;
    _p.serve = function(socket) {

        _me = socket.handshake.address;

        console.log(_me + "disconnected");
    }
    return _p;
};