//packet002
//Client Connection packet

module.exports = function(util, socket, me) {
    var _p = {};
    _p.serve = function(data) {
        me.un = data.userName;
        var index = util.sessionIndex(data.sessionID);
        if (index > -1) {
            if (!util.clientIndex(me.ip, index)) {
                util.joinSession(me, index, function() {
                    socket.emit('refresh');
                });
            } else {
                console.log('Client ' + me.ip + ' is already in this session.');
            }
        } else {
            console.log('No Session ' + data.sessionID + ' found.');
        }
    };
    return _p;
};