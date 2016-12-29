//packet003
//Close Connection packet

module.exports = function(socket) {
    var _p = {};
    _p.serve = function(data) {
        for(var i in global.sessions) {
            if(data.id===global.sessions[i].id) {
                if(!data.hasOwnProperty('client')) { //close entire session
                    global.sessions.splice(i, 1);
                }else{ //close client connection to session
                    for(var j in global.sessions[i].clients) {
                        if(data.client===global.sessions[i].clients[j].ip) {
                            global.sessions[i].clients.splice(j, 1);
                            break;
                        }
                    }
                }
                var distro = global.sessionDistribution(global.sessions[i].id)
                for(var j in distro){
                    distro[j].emit('broadcast', global.sessions[i]);
                }
                break;
            }
        }
        socket.emit('refresh');
    }
    _p.respond = function(){

    }
    return _p;
};