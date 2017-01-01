//packet999
//Disconnect packet

module.exports = function(util, socket, disconnectGUID) {
    var _p = {};
    _p.serve = function() {
        //get index of disconnecting party (starting by checking if host)
        var index = util.hostIndex(disconnectGUID);
        if (index) { //if party is host
            util.disconnect(index);
        } else {
            //get index of connecting party (assuming client)
            index = util.clientIndex(disconnectGUID);
            if (index) { //if party is client
                util.disconnect(index);
            }
        }
    };
    return _p;
};