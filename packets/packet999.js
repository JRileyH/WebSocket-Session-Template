//packet999
//Disconnect packet

module.exports = function(socket, me) {
    var _p = {};
    _p.serve = function(socket) {
        var i, j, k, distro;
        console.log(me + ' disconnected');

        for (i = 0; i < global.sessions.length; i++) {
            //looking for if disconnecting user was a host
            if (me === global.sessions[i].host.ip) {
                //nullifies hosts socket ID until they reconnect
                global.sessions[i].host.id = null;
                //broadcasts nullified session info to all connected session members
                distro = global.sessionDistribution(global.sessions[i].id);
                for (j = 0; j < distro.length; j++) {
                    distro[j].emit('broadcast', global.sessions[i]);
                }
                break;
            }
            for (j = 0; j < global.sessions[i].clients.length; j++) {
                //looking for if connecting user is already a client of an existing session
                if (me === global.sessions[i].clients[j].ip) {
                    //nullifies clients socket ID until they reconnect
                    global.sessions[i].clients[j].id = null;
                    //broadcasts nullifed session info to all connected session members
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