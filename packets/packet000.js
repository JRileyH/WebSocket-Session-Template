//packet000
//Connection packet000

module.exports = function(util) {
    var _p = {};
    var connectorsIP;
    _p.serve = function(socket) {
        //gets the currect connecting user's ip address
        connectorsIP = socket.handshake.address;
        //set up event listeners for connections and disconnections
        socket.on('hostConnect', require('./packet001')(util, socket, {ip:connectorsIP,id:socket.id}).serve);   //when party connects as host
        socket.on('clientConnect', require('./packet002')(util, socket, {ip:connectorsIP,id:socket.id}).serve); //when party connects as client
        socket.on('message', require('./packet003')(util, socket).serve);   //when a message is send (template for all data packets)
        socket.on('closeSession', require('./packet998')(util, socket).serve);  //when a session or client session is closed
        socket.on('disconnect', require('./packet999')(util, socket, connectorsIP).serve);  //when party disconnectes
        //get index of connecting party (starting by checking if host)
        var index = util.hostIndex(connectorsIP);
        if (index) { //if connecting party is already a host
            //set index information client side
            socket.emit('index', index);
            //send new host ID to session
            util.returnToSession(index, connectorsIP, 'host', socket.id);
            //broadcast session info to all connected parties
            util.updateSession(index.ofSession);
        } else { //if connection client is not a host
            //get index connecting party (assuming is a client)
            index = util.clientIndex(connectorsIP);
            if (index) { //if connecting party is already a client
                //set index information client side
                socket.emit('index', index);
                //send new client ID to session
                util.returnToSession(index, connectorsIP, 'client', socket.id);
                //broadcast session info to all connected parties
                util.updateSession(index.ofSession);
            }
        }
        // if connecting party is neither host nor client,
        // they will be redirected to landing page where they
        // can choose to connect as host or client.
    };
    return _p;
};