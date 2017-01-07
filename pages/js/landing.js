var socket;
function init() { //on page load
    socket = io.connect('', {query: 'guid=' + util.Guid()}); //create socket connection
    socket.on('refresh', util.refresh);
    socket.on('guid', util.Guid);
}

function hostConnect() { //connect as host
    var data = {
        userName: document.getElementById('UserName').value,
        guid: util.Guid()
    };
    socket.emit('hostConnect', data);
}

function clientConnect() { //connect as client
    var data = {
        userName: document.getElementById('UserName').value,
        guid: util.Guid(),
        sessionID: document.getElementById('SessionID').value
    };
    socket.emit('clientConnect', data);
}