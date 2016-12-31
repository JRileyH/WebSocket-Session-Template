var socket;
var session = {};
var index = {};

function init() {
    var i;
    socket = io.connect();
    socket.on('index', function(_index) {
        index = _index;
    });
    socket.on('refresh', function() {
        window.location = window.location;
    });
    socket.on('broadcast', function(s) {
        if (s === 'OPEN_SESSION') {
            window.location = window.location;
            return;
        }
        console.log(s);
        session = s;
        var tbod =
        '<tr data-id="' + s.host.id + '">' +
            '<td>&nbsp;</td>' +
            '<td>' + s.host.un + '</td>' +
            '<td>' + s.host.ip + '</td>' +
        '</tr>';
        for (i = 0; i < s.clients.length; i++) {
            //skip over undefined client slots
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
    socket.on('message', function() {
        var mbod =
        '<li>' +
        '</li>';
    });
}

function closeSession() {
    var data = {index: index.ofSession};
    socket.emit('closeSession', data);
}
function kickClient(clientIndex, clientID) {
    var data = {index: index.ofSession, client: clientIndex, id: clientID};
    socket.emit('closeSession', data);
}
function sendMsg() {
    var data = {id: session.id, sender: 'host', msg: document.getElementById('msg').value};
    socket.emit('message', data);
}