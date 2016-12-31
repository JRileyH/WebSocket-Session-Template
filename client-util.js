var util = (function () {
    var _util = {};
    var _session = {};
    var _index = {};

    _util.setIndex = function(i) {
        console.log(i);
        _index = i;
    };
    _util.getIndex = function() {
        return _index;
    };

    _util.refresh = function() {
        window.location = window.location;
    };

    _util.updateSession = function(s, cb) {
        if (s === 'OPEN_SESSION'  || s.clients[_index.ofClient] === 'OPEN_CLIENT') {
            window.location = window.location;
            return;
        }
        console.log(s);
        _session = s;
        cb();
    };

    _util.getSession = function() {
        return _session;
    };

    return _util;
})();