//packet998
//Close Connection packet

module.exports = function(util, socket) {
    var _p = {};
    _p.serve = function(data) {
        //if no specific client is included in data, entire session is closed
        if (!data.hasOwnProperty('client')) {
            //close session
            util.removeSession(data.index);
        } else { //if a specific client was included in data, only close session for that client
            //close session for specified client
            util.removeClient(data.index, data.client);
        }
    };
    return _p;
};