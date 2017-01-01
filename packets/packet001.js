//packet001
//Host Connection packet

module.exports = function(util, socket, me) {
    var _p = {};
    _p.serve = function(data) {
        //set client information passed form client
        me.un = data.userName;
        me.guid = data.guid;

        if (me.guid.length !== 8) {
            me.guid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
            while (util.hostIndex(me.guid) || util.clientIndex(me.guid)) {
                me.guid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
            }
            socket.emit('guid', me.guid);
        }

        if (!util.hostIndex(me.guid)) {//if the user is a not already a host
            //generate a random 4 character session ID
            var sessionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
            while (util.sessionIndex(sessionID) > -1) { //if the session ID is not already used
                //continue to generate a new session ID until one is found that is not duplicated
                sessionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
            }
            //create session
            util.createSession(me, sessionID, function() {
                socket.emit('refresh');
            });
        } else {
            console.log('Host ' + me.ip + ' already connected to another session');
        }
    };
    return _p;
};
