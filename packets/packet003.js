//packet003
//Close Connection packet

module.exports = function(util, socket) {
    var _p = {};
    _p.serve = function(data) {
        if (!data.hasOwnProperty('client')) {
            util.removeSession(data.index);
        } else {
            util.removeClient(data.index, data.client, data.id);
        }
    };
    return _p;
};