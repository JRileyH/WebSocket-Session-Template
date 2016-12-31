//packet999
//Disconnect packet

module.exports = function(util, socket, disconnectIP) {
    var _p = {};
    _p.serve = function(socket) {
        console.log(disconnectIP + ' disconnected');
        var index = util.hostIndex(disconnectIP);
        if (index) {
            util.disconnect(index);
        } else {
            index = util.clientIndex(disconnectIP);
            if (index) {
                util.disconnect(index);
            }
        }
    };
    return _p;
};