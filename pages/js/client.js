var socket;

function init() {
    socket = io.connect('', {query: 'guid=' + util.Guid()}); //create socket connection
    
    socket.on('index', function(index) {
        util.Index(index);
        document.getElementById('MY_SINDEX').innerHTML = index.ofSession;
        document.getElementById('MY_CINDEX').innerHTML = index.ofClient;
    });
    
    socket.on('session', function(s) { util.Session(s, function() {
            document.getElementById('SID').innerHTML = s.id;
            document.getElementById('HOST').innerHTML = s.host.ip;
            
            var info = s.clients[util.Index().ofClient];
            document.getElementById('MY_GUID').innerHTML = info.guid;
            document.getElementById('MY_NAME').innerHTML = info.un;
            document.getElementById('MY_ID').innerHTML = info.id;
            document.getElementById('MY_IP').innerHTML = info.ip;
        });
    });
    socket.on('refresh', util.refresh);
}

function closeSession() {
    var data = {index: util.Index().ofSession, client: util.Index().ofClient, id: me.id};
    socket.emit('closeSession', data);
}

