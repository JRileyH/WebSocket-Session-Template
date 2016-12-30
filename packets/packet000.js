//packet000
//Connection packet000

module.exports = function() {
    var _p = {};
    var _ip;
    _p.serve = function(socket) {
        _ip = socket.handshake.address; //gets the currect connecting user's ip address
        console.log(_ip + ' - ' + socket.id + ' has landed');

        //set up event listeners for connections and disconnections
        socket.on('hostConnect', require('./packet001')(socket, {ip:_ip,id:socket.id}).serve);
        socket.on('clientConnect', require('./packet002')(socket, {ip:_ip,id:socket.id}).serve);
        socket.on('closeSession', require('./packet003')(socket).serve);
        socket.on('message', require('./packet004')(socket).serve);
        socket.on('disconnect', require('./packet999')(socket, _ip).serve);

        var i, j, k, distro;
        //looking for if connecting user is already a host of an existing session
        for (i = 0; i < global.sessions.length; i++) {
            if (_ip === global.sessions[i].host.ip) {
                //updates global session info
                global.sessions[i].lastConnected = _ip;
                global.sessions[i].lastConnectionType = 'host';
                global.sessions[i].host.id = socket.id;
                //broadcasts updated session info to all session members
                distro = global.sessionDistribution(global.sessions[i].id)
                for (j = 0; j < distro.length; j++) {
                    distro[j].emit('broadcast', global.sessions[i]);
                }
                break;
            }
            for (j = 0; j < global.sessions[i].clients.length; j++) {
                //looking for if connecting user is already a client of an existing session
                if (_ip === global.sessions[i].clients[j].ip) {
                    //updates global session info
                    global.sessions[i].lastConnected = _ip;
                    global.sessions[i].lastConnectionType = 'client';
                    global.sessions[i].clients[j].id = socket.id;
                    //broadcasts updated session info to all session members
                    distro = global.sessionDistribution(global.sessions[i].id);
                    for (k = 0; k < distro.length; k++) {
                        distro[k].emit('broadcast', global.sessions[i]);
                    }
                    break;
                }
            }
        }
    };
    _p.respond = function() {

    };
    return _p;
};