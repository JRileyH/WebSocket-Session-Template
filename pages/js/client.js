var socket;
var session = {};
var host;
var me;
var index = {};

function init() {
    socket = io.connect();
    socket.on('index', function(_index) {
        console.log(_index);
        index = _index;
    });
    socket.on('refresh', function() {
        window.location = window.location;
    });
    socket.on('broadcast', function(s) {
        if (s === 'OPEN_SESSION' || s.clients[index.ofClient] === 'OPEN_CLIENT') {
            window.location = window.location;
            return;
        }
        console.log(s);
        session = s;
        host = s.host.ip;
        me = s.lastConnected;
        document.getElementById('SID').innerHTML = s.id;
        document.getElementById('HOST').innerHTML = host;
        document.getElementById('CLIENT').innerHTML = me.ip;
    });
}

function closeSession() {
    var data = {index: index.ofSession, client: index.ofClient, id: me.id};
    socket.emit('closeSession', data);
}