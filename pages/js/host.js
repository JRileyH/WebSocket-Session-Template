var socket;
function init() {
    socket = io.connect('', {query: 'guid=' + util.getGuid()}); //create socket connection
    socket.on('index', util.setIndex);
    socket.on('guid', util.setGuid);
    socket.on('refresh', util.refresh);
    socket.on('broadcast', function(s) { util.updateSession(s, function() {
            var tbod =
            '<tr data-id="' + s.host.id + '">' +
                '<td>&nbsp;</td>' +
                '<td>' + s.host.un + '</td>' +
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
                            s.clients[i].ip +
                        '</td>' +
                    '</tr>';
                }
            }
            document.getElementById('connList').innerHTML = tbod;
            document.getElementById('SID').innerHTML = s.id;
        });
    });
}

function closeSession() {
    var data = {index: util.getIndex().ofSession};
    socket.emit('closeSession', data);
}
function kickClient(clientIndex, clientID) {
    var data = {index: util.getIndex().ofSession, client: clientIndex, id: clientID};
    socket.emit('closeSession', data);
}
function sendMsg() {
    var data = {id: util.getSession().id, sender: 'host', msg: document.getElementById('msg').value};
    socket.emit('message', data);
}