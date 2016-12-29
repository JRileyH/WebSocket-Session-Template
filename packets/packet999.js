//packet999
//Disconnect packet

module.exports = function(socket, me){
    var _p = {};
    _p.serve = function(socket) {

        console.log(me + " disconnected")

        for(var i in global.sessions) {
            //looking for if disconnecting user was a host
            if(me===global.sessions[i].host.ip) {
                //nullifies hosts socket ID until they reconnect
                global.sessions[i].host.id = null;
                //broadcasts nullified session info to all connected session members
                var distro = global.sessionDistribution(global.sessions[i].id)
                for(var j in distro){
                    distro[j].emit('broadcast', global.sessions[i]);
                }
                break;
            }
            for(var j in global.sessions[i].clients) {
                //looking for if connecting user is already a client of an existing session
                if(me===global.sessions[i].clients[j].ip) {
                    //nullifies clients socket ID until they reconnect
                    global.sessions[i].clients[j].id = null;
                    //broadcasts nullifed session info to all connected session members
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