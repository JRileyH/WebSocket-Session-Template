//packet004
//Chat Message packet

module.exports = function(util, socket) {
    var _p = {};
    _p.serve = function(data) {
        console.log(data);
    };
    return _p;
};