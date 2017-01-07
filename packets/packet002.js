//packet002
//Client Connection packet

module.exports = function(util, socket, me) {
    var _p = {};
    _p.serve = function(data) {
        //set client information passed form client
        me.un = data.userName;
        me.guid = data.guid;
        
        if (me.guid.length !== 8) {
            me.guid = util.generateGuid(8, function(x) {
                return (util.hostIndex(x) || util.clientIndex(x));
            });
        }

        //find index of session from the session ID user input
        var index = util.sessionIndex(data.sessionID);
        if (index > -1) { //if session is found
            if (!util.clientIndex(me.guid, index)) { //if is not already a client
                //join session
                util.joinSession(me, index, function() {
                    socket.emit('refresh');
                });
            } else {
                console.error('Client ' + me.ip + ' is already in this session.');
            }
        } else {
            console.error('No Session ' + data.sessionID + ' found.');
        }
    };
    return _p;
};