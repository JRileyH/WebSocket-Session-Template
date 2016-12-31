//packet000
//Connection packet000

module.exports = function(util) {
    var _p = {};
    var connectorsIP;
    _p.serve = function(socket) {
        connectorsIP = socket.handshake.address; //gets the currect connecting user's ip address
        console.log(connectorsIP + ' - ' + socket.id + ' has landed');

        //set up event listeners for connections and disconnections
        socket.on('hostConnect', require('./packet001')(util, socket, {ip:connectorsIP,id:socket.id}).serve);
        socket.on('clientConnect', require('./packet002')(util, socket, {ip:connectorsIP,id:socket.id}).serve);
        socket.on('closeSession', require('./packet003')(util, socket).serve);
        socket.on('message', require('./packet004')(util, socket).serve);
        socket.on('disconnect', require('./packet999')(util, socket, connectorsIP).serve);

        var index = util.hostIndex(connectorsIP);
        if (index) {
            socket.emit('index', index);
            util.returnToSession(index, connectorsIP, 'host', socket.id);
            util.updateSession(index.ofSession);
        } else {
            index = util.clientIndex(connectorsIP);
            if (index) {
                socket.emit('index', index);
                util.returnToSession(index, connectorsIP, 'client', socket.id);
                util.updateSession(index.ofSession);
            }
        }
    };
    return _p;
};