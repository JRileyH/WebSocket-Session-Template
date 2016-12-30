var socket;
function init() { //on page load
    socket = io.connect(); //create socket connection
    socket.on('refresh', function() {
        window.location = window.location;
    });
}

function hostConnect() { //connect as host
    var data = {userName: document.getElementById('UserName').value};
    socket.emit('hostConnect', data);
}

function clientConnect() { //connect as client
    var data = {
        userName: document.getElementById('UserName').value,
        sessionID: document.getElementById('SessionID').value
    };
    socket.emit('clientConnect', data);
}