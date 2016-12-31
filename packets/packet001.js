//packet001
//Host Connection packet

module.exports = function(util, socket, me) {
    var _p = {};
    _p.serve = function(data) {
        me.un = data.userName;
        if (!util.hostIndex(me.ip)) {
            var sessionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
            while (util.sessionIndex(sessionID) > -1) {
                sessionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
            }
            util.createSession(me, sessionID, function() {
                socket.emit('refresh');
            });
        } else {
            console.log('Host ' + me.ip + ' already connected to another session');
        }
    };
    return _p;
};
