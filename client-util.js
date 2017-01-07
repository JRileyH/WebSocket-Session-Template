var util = (function () {
    var _util = {};
    var _session = {};
    var _my = {
        index: {},
        id: '',
        guid: getCookie('websocketguid'),
        name:'',
        ip:''
    };

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
    _util.Guid = function(guid) {
        if (guid === undefined) {//get
            return _my.guid;
        } else {//set
            setCookie('websocketguid', guid, 365);
            _my.guid = guid;
        }
    };

    _util.Index = function(i) {
        if (i === undefined) {//get
            return _my.index;
        } else {//set
            _my.index = i;
        }
    };

    _util.Name = function(name) {
        if (name === undefined) { //get
            return _my.name;
        } else { //set
            _my.name = name;
        }
    };

    _util.Ip = function(ip) {
        if( ip === undefined) {
            return _my.ip; //get
        } else { //set
            _my.ip = ip;
        }
    };

     _util.Id = function(id) {
        if( id === undefined) {
            return _my.id; //get
        } else { //set
            _my.id = id;
        }
    };

    _util.Session = function(s, cb) {
        if (s === undefined) { //get
            return _session;
        } else { //set
            if (s === 'OPEN_SESSION'  || s.clients[_my.index.ofClient] === 'OPEN_CLIENT') {
                window.location = window.location;
                return;
            }
            _session = s;
            var info = _my.index.ofClient === 'host' ? s.host : s.clients[_my.index.ofClient];
            _my.guid = info.guid;
            _my.name = info.un;
            _my.id = info.id;
            _my.ip = info.ip;
        }
        cb();
    };

    _util.refresh = function() {
        window.location = window.location;
    };
    
    return _util;
})();