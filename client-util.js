var util = (function () {
    var _util = {};
    var _session = {};
    var _index = {};
    var _guid = getCookie('websocketguid');

//Private
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }

    function getCookie(cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

//Public
    _util.setGuid = function(guid) {
        setCookie('websocketguid', guid, 365);
        _guid = guid;
    };

    _util.getGuid = function() {
        return _guid;
    };

    _util.setIndex = function(i) {
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
        _session = s;
        cb();
    };

    _util.getSession = function() {
        return _session;
    };

    return _util;
})();