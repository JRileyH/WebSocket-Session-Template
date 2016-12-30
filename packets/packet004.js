//packet004
//Chat Message packet

module.exports = function(socket) {
    var _p = {};
    _p.serve = function(data) {
        console.log(data.msg);
    };
    _p.respond = function() {

    };
    return _p;
};