var socket;
function init() {
    socket = io.connect('', {query: 'guid=' + util.Guid()}); //create socket connection
    
    socket.on('index', function(index) {
        util.Index(index);
        document.getElementById('MY_SINDEX').innerHTML = index.ofSession;
        document.getElementById('MY_CINDEX').innerHTML = index.ofClient;
        
    });
    socket.on('session', function(s) { util.Session(s, function() {
            var tbod =
            '<tr data-id="' + s.host.id + '">' +
                '<td>&nbsp;</td>' +
                '<td>' + s.host.un + '</td>' +
                '<td>' + s.host.guid + '</td>' +
                '<td>' + s.host.ip + '</td>' +
            '</tr>';
            for (var i = 0; i < s.clients.length; i++) {
                if (s.clients[i] !== 'OPEN_CLIENT') {
                    tbod +=
                    '<tr data-id="' + s.clients[i].id + '">' +
                        '<td>' +
                            '<button type="button" onclick="kickClient(' + i + ', \'' + s.clients[i].id + '\')">kick</button>' +
                        '</td>' +
                        '<td>' +
                            s.clients[i].un +
                        '</td>' +
                        '<td>' +
                            s.clients[i].guid +
                        '</td>' +
                        '<td>' +
                            s.clients[i].ip +
                        '</td>' +
                    '</tr>';
                }
            }
            document.getElementById('connList').innerHTML = tbod;
            document.getElementById('SID').innerHTML = s.id;

            var info = s.host;
            document.getElementById('MY_GUID').innerHTML = info.guid;
            document.getElementById('MY_NAME').innerHTML = info.un;
            document.getElementById('MY_ID').innerHTML = info.id;
            document.getElementById('MY_IP').innerHTML = info.ip;
        });
        socket.on('refresh', util.refresh);
    });
}

function closeSession() {
    var data = {index: util.Index().ofSession};
    socket.emit('closeSession', data);
}
function kickClient(clientIndex, clientID) {
    var data = {index: util.Index().ofSession, client: clientIndex, id: clientID};
    socket.emit('closeSession', data);
}
function sendMsg() {
    var data = {id: util.getSession().id, sender: 'host', msg: document.getElementById('msg').value};
    socket.emit('message', data);
}