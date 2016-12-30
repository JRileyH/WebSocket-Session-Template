var socket;
var session = {};
function init() {
    var i;
    socket = io.connect();
    socket.on('refresh', function() {
        window.locatio = window.location;
    });
    socket.on('broadcast', function(s) {
        session = s;
        var tbod = '<tr data-id="' + s.host.id + '"><td>&nbsp;</td><td>' + s.host.un + '</td><td>' + s.host.ip + '</td></tr>';
        for (i = 0; i < s.clients.length; i++) {
            tbod +=
            '<tr data-id="' + s.clients[i].id + '">' +
                '<td>' +
                    '<button type="button" onclick="kickClient(\'' + s.clients[i].ip + '\')">kick</button>' +
                '</td>' +
                '<td>' +
                    s.clients[i].un +
                '</td>' +
                '<td>' +
                    s.clients[i].ip +
                '</td>' +
            '</tr>';
        }
        document.getElementById('connList').innerHTML = tbod;
        document.getElementById('SID').innerHTML = s.id;
    });
}

function closeSession() {
    var data = {id: session.id};
    socket.emit('closeSession', data);
}
function kickClient(ip) {
    var data = {id: session.id, client: ip};
    socket.emit('closeSession', data);
}
function sendMsg() {
    var data = {id: session.id, sender: 'host', msg: document.getElementById('msg').value};
    socket.emit('message', data);
}