//packet003
//Close Connection packet

module.exports = function(socket) {
    var i, j, k, distro;
    var _p = {};
    _p.serve = function(data) {
        for (i = 0; i < global.sessions.length; i++) {
            if (data.id === global.sessions[i].id) {
                distro = global.sessionDistribution(global.sessions[i].id);
                if (!data.hasOwnProperty('client')) { //close entire session
                    global.sessions.splice(i, 1);//remove session from global session list
                } else { //close client connection to session
                    for (j = 0; j < global.sessions[i].clients.length; j++) {
                        if (data.client === global.sessions[i].clients[j].ip) {
                            global.sessions[i].clients.splice(j, 1); //remove client from session client list
                            break;
                        }
                    }
                }
                for (k = 0; k < distro.length; k++) { //broadcast updated session info to all clients
                    if (distro.length > 0) {
                        distro[k].emit('broadcast', global.sessions[i]);
                    }
                }
                break;
            }
        }
        socket.emit('refresh');
    };
    _p.respond = function() {

    };
    return _p;
};