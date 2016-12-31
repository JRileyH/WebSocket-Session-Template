//packet002
//Client Connection packet

module.exports = function(util, socket, me) {
    var _p = {};
    _p.serve = function(data) {
        //set username from data package
        me.un = data.userName;
        //find index of session from the session ID user input
        var index = util.sessionIndex(data.sessionID);
        if (index > -1) { //if session is found
            if (!util.clientIndex(me.ip, index)) { //if is not already a client
                //join session
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