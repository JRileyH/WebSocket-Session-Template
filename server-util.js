module.exports = function() {
    var util = {};
    var sessions = [];
    var io = null;

    util.sessions = function() {
        var temp = [];
        for (var i = 0; i < sessions.length; i++) {
            temp.push(sessions[i]);
        }
        return temp;
    };

    util.initSocket = function(socket) {
        io = socket;
    };

    util.hostIndex = function(ip) {
        for (var i = 0; i < sessions.length; i++) {
            if (sessions[i] !== 'OPEN_SESSION') {
                if (sessions[i].host.ip === ip) {
                    return {ofSession: i, ofClient: 'host'};
                }
            }
        }
        return false;
    };

    util.clientIndex = function(ip, sindex) {
        var i;
        if (sindex) {
            if (sessions[sindex] !== 'OPEN_SESSION') {
                for (i = 0; i < sessions[sindex].clients.length; i++) {
                    if (sessions[sindex].clients[i] !== 'OPEN_CLIENT') {
                        if (sessions[sindex].clients[i].ip === ip) {
                            return {ofSession: sindex, ofClient: i};
                        }
                    }
                }
            }
        } else {
            for (i = 0; i < sessions.length; i++) {
                if (sessions[i] !== 'OPEN_SESSION') {
                    for (var j = 0; j < sessions[i].clients.length; j++) {
                        if (sessions[i].clients[j] !== 'OPEN_CLIENT') {
                            if (sessions[i].clients[j].ip === ip) {
                                return {ofSession: i, ofClient: j};
                            }
                        }
                    }
                }
            }
        }
        return false;
    };

    util.sessionIndex = function(id) {
        for (var i = 0; i < sessions.length; i++) {
            if (sessions[i].id === id) {
                return i;
            }
        }
        return -1;
    };

    util.returnToSession = function(index, ip, type, id) {
        sessions[index.ofSession].lastConnected = {ip:ip, id:id};
        sessions[index.ofSession].lastConnectionType = type;
        switch (type) {
            case 'host':
                sessions[index.ofSession].host.id = id;
            break;

            case 'client':
                sessions[index.ofSession].clients[index.ofClient].id = id;
            break;

            default:
                console.log('Unknown connection type ' + type);
        }
    };

    util.updateSession = function(sindex, exSocket) {
        var distro = this.sessionDistribution(sindex);
        if (exSocket) {
            distro.push(exSocket);
        }
        for (var j = 0; j < distro.length; j++) {
            distro[j].emit('broadcast', sessions[sindex]);
        }
    };

    util.sessionDistribution = function(sindex, includeHost) {
        includeHost = includeHost || true;
        if (sessions[sindex] === 'OPEN_SESSION') {
            return [];
        }
        var distribution = [];
        var sesh = sessions[sindex];
        if (includeHost) {
            var host = sesh.host;
            if (host.id !== 'DISCONNECTED') {
                distribution.push(io.sockets.sockets[host.id]);
            }
        }
        for (var i = 0; i < sesh.clients.length; i++) {
            if (sesh.clients[i] !== 'OPEN_CLIENT') {
                if (sesh.clients[i].id !== 'DISCONNECTED') {
                    distribution.push(io.sockets.sockets[sesh.clients[i].id]);
                }
            }
        }
        return distribution;
    };

    util.createSession = function(host, id, cb) {
        var i, index = -1;
        for (i = 0; i < sessions.length; i++) {
            if (sessions === 'OPEN_SESSION') {
                index = i;
                break;
            }
        }
        if (index > -1) {
            sessions[index] = {
                host:host,
                id:id,
                clients:[]
            };
        } else {
            index = sessions.push({
                host:host,
                id:id,
                clients:[]
            });
        }
        cb();
    };

    util.joinSession = function(client, sindex, cb) {
        var i, cindex = -1;
        for (i = 0; i < sessions[sindex].clients.length; i++) {
            if (sessions[sindex].clients[i] === 'OPEN_CLIENT') {
                cindex = i;
                break;
            }
        }
        if (cindex > -1) {
            sessions[sindex].clients[cindex] = client;
        } else {
            cindex = sessions[sindex].clients.push(client);
        }
        cb();
    };

    util.removeSession = function(sindex) {
        var distro = this.sessionDistribution(sindex);
        sessions[sindex] = 'OPEN_SESSION';
        for (var i = 0; i < distro.length; i++) {
            distro[i].emit('broadcast', 'OPEN_SESSION');
        }
    };

    util.removeClient = function(sindex, cindex, clientID) {
        sessions[sindex].clients[cindex] = 'OPEN_CLIENT';
        this.updateSession(sindex, io.sockets.sockets[clientID]);
    };

    util.disconnect = function(index) {
        if (index.ofClient === 'host') {
            sessions[index.ofSession].host.id = 'DISCONNECTED';
        } else {
            sessions[index.ofSession].clients[index.ofClient].id = 'DISCONNECTED';
        }
    };

    return util;
};