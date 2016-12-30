//packet002
//Client Connection packet

module.exports = function(socket, me) {
    var _p = {};
    _p.serve = function(data) {
        var i, j;
        me.un = data.userName;
        var sessionIndex = null; //index of the session client is connecting to
        var joinSession = false;
        for (i = 0; i < global.sessions.length; i++) {
            //looking for session that matches session ID provided by client
            if (global.sessions[i].id === data.sessionID) {
                sessionIndex = i;
                var inSession = false;
                //looking for if client is already in this session (redundent check for good measure)
                for (j = 0; j < global.sessions[i].clients.length; j++) {
                    if (global.sessions[i].clients[j].ip === me.ip) {
                        inSession = true; //don't let this client join again
                        break;
                    }
                }
                joinSession = !inSession;
                break;
            }
        }
        if (joinSession) {
            global.sessions[sessionIndex].clients.push(me);
        } else {
            console.log('No Session ' + data.sessionID + ' found or ' + me.ip + ' already connected as client');
        }
        console.log(global.sessions);
        socket.emit('refresh');
    };
    _p.respond = function() {

    };
    return _p;
};