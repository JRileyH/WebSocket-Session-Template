var socket;
var session = {};
var host;
var me;

function init() {
    socket = io.connect();
    socket.on('refresh', function() {
        window.location = window.location;
    });
    socket.on('broadcast', function(s) {
        session = s;
        host = s.host.ip;
        me = s.lastConnected;
        document.getElementById('SID').innerHTML = s.id;
        document.getElementById('HOST').innerHTML = host;
        document.getElementById('CLIENT').innerHTML = me;
    });
}

function closeSession() {
    var data = {id: session.id, client: me};
    socket.emit('closeSession', data);
}