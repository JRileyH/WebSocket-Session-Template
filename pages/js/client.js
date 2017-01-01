var socket;
var host;
var me;

function init() {
    socket = io.connect('', {query: 'guid=' + util.getGuid()}); //create socket connection
    socket.on('index', util.setIndex);
    socket.on('guid', util.setGuid);
    socket.on('refresh', util.refresh);
    socket.on('broadcast', function(s) { util.updateSession(s, function() {
            host = s.host.ip;
            me = s.lastConnected;
            document.getElementById('SID').innerHTML = s.id;
            document.getElementById('HOST').innerHTML = host;
            document.getElementById('CLIENT').innerHTML = me.ip;
        });
    });
}

function closeSession() {
    var data = {index: util.getIndex().ofSession, client: util.getIndex().ofClient, id: me.id};
    socket.emit('closeSession', data);
}


