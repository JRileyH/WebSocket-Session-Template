module.exports = function() {
    var util = {};
    var sessions = [];
    var io = null;

    util.initSocket = function(socket) {
        io = socket;
    };

    /* Session Index: Returns Integer of sessions index in array OR -1 if the session cannot be found
     * Params:
     *      id: String - Session ID of session in question
     * */
    util.sessionIndex = function(id) {
        for (var i = 0; i < sessions.length; i++) {
            if (sessions[i].id === id) {
                return i;
            }
        }
        return -1;
    };

    /* Host Index: Returns Object {ofSession: <Integer Index>, ofClient: 'host'} or Boolean 'False' if the host cannot be found
     * Params:
     *      guid: String - Cookie GUID of the host in question
     * */
    util.hostIndex = function(guid) {
        for (var i = 0; i < sessions.length; i++) {
            if (sessions[i] !== 'OPEN_SESSION') {
                if (sessions[i].host.guid === guid) {
                    return {ofSession: i, ofClient: 'host'};
                }
            }
        }
        return false;
    };

    /* Client Index: Returns Object {ofSession: <Integer Index>, ofClient: <Integer Index of client>} or Boolean 'False' if the client cannot be found
     * Params:
     *      guid: String - Cookie GUID of the client in question
     *      sindex: Integer(Optional) - pass this in if you already have the session you want to look in and want to save processing time
     * */
    util.clientIndex = function(guid, sindex) {
        var i;
        if (sindex) {
            if (sessions[sindex] !== 'OPEN_SESSION') {
                for (i = 0; i < sessions[sindex].clients.length; i++) {
                    if (sessions[sindex].clients[i] !== 'OPEN_CLIENT') {
                        if (sessions[sindex].clients[i].guid === guid) {
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
                            if (sessions[i].clients[j].guid === guid) {
                                return {ofSession: i, ofClient: j};
                            }
                        }
                    }
                }
            }
        }
        return false;
    };

    /* Return To Session: after coming back from a disconnected state, set the clients new Socket ID to overwrite the Disconnected flag
     * Params:
     *      index: Object - {ofSession: <index of session>, ofClient: <index of client or 'host' if host>}
     *      connector Object - {ip: <connectors ip address>, guid: < connectors cookie guid>, id: <connectors new socket ID>, type: <'host' or 'client'>}
     * */
    util.returnToSession = function(index, connector) {
        sessions[index.ofSession].lastConnected = connector;
        switch (connector.type) {
            case 'host':
                sessions[index.ofSession].host.id = connector.id;
            break;

            case 'client':
                sessions[index.ofSession].clients[index.ofClient].id = connector.id;
            break;

            default:
                console.log('Unknown connection type ' + connector.type);
        }
    };

    /* Update Session: Broadcasts the current session info to all connected members
     * Use after any changes to session are made.
     * Params:
     *      sindex: Integer - index of session from session array
     *      exSocket: Socket(Optional) - if a client is going to be removed from session or for any reason is not in the session at the time of the update but still wants to recieve the update broadcast, pass their socket in.
     * */
    util.updateSession = function(sindex, exSocket) {
        var distro = this.sessionDistribution(sindex);
        if (exSocket) {
            distro.push(exSocket);
        }
        for (var j = 0; j < distro.length; j++) {
            distro[j].emit('broadcast', sessions[sindex]);
        }
    };

    /* Session Distribution: Returns an array of Socket objects of all clients in a session.
     * Can be used to emit events to all clients in a session
     * Params:
     *      sindex: Integer - index of session from session array
     *      includeHost: Boolean (Optional) - true(default): host socket will be in the array, false: only clients are in array
     * */
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

    /* Generate GUID: Returns a unique and random GUID to to be used for either session ID or client GUID
     * Params:
     *      length: Integer - number of characters of the guid.
     *      condition: Function - pass it a parameter and return a boolean of if that parameter is unique inside whatever array it's going to be saved to (true is it is not unique)
     * */
    util.generateGuid = function(length, condition) {
            var guid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
            while (condition(guid)) {
                guid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
            }
            return guid;
    };

    /* Create Session: This is for when a host creates a new session
     * First creates a unique and random Session ID.
     * Finds either the first Open Session flagged slot or adds a new session to the end of the session array
     * adds host information and session ID and initializes an empty client array for the session.
     * It then performs a callback for any post processing required.
     * Params:
     *      host: Object - {id: <socket.io ID of host>, ip: <Ip addess of host>, guid: <cookie value saved in hosts browser>, un: <username of host>}
     *      cb: Function - The callback function (Currently set to a refresh event, subject to change...)
     * */
    util.createSession = function(host, cb) {
        //generate a random 4 character session ID
        var sessionID = this.generateGuid(4, function(){
            return util.sessionIndex(sessionID) > -1;
        });
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
                id:sessionID,
                clients:[]
            };
        } else {
            index = sessions.push({
                host:host,
                id:sessionID,
                clients:[]
            });
        }
        cb();
    };

    /* Join Session: This is for when a client is joining a host's existing session with a session ID
     * Finds the first instance of a session with a matching input Session ID
     * Adds the clients info to the session client array to either the first Open Client flagged slot OR the end of the array if no Open Client slots
     * It then performs a callback for any post processing required.
     * Params:
     *      client: Object - {id: <socket.io ID of client>, ip: <Ip addess of client>, guid: <cookie value saved in clients browser>, un: <username of client>}
     *      sindex: Integer - index of session from session array
     *      cb: Function - The callback function (Currently set to a refresh event, subject to change...)
     * */
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

    /* Remove Session: Happens when a host destroyes the session perminantly
     * It simply overwrites the session object with an Open Session flag so it will be skipped oever in all session logic
     * It this broadcasts the Open Session flag to the clients so they can know the session had been closed.
     * The next host to create a session will take the first available Open Session flagged slot
     * Params:
     *      sindex: Integer - index of session from session array
     * */
    util.removeSession = function(sindex) {
        var distro = this.sessionDistribution(sindex);
        sessions[sindex] = 'OPEN_SESSION';
        for (var i = 0; i < distro.length; i++) {
            distro[i].emit('broadcast', 'OPEN_SESSION');
        }
    };

    /* Remove Client: Happens when a client actually intentionally leaves a session or is kicked.
     * It simply overwrites the parties object with an Open Client flag so it will be skipped over in all client logic
     * It then broadcasts the session info to the still connected clients to update their session on their side.
     * The next connecting client will take the first available Open Client flagged slot
     * Params:
     *      sindex: Integer - index of session from session array
     *      cindex: Integer - index of client from sessions client array
     * */
    util.removeClient = function(sindex, cindex) {
        var clientID = sessions[sindex].clients[cindex].id;
        sessions[sindex].clients[cindex] = 'OPEN_CLIENT';
        this.updateSession(sindex, io.sockets.sockets[clientID]);
    };

    /* Disconnect: Happens if client redirects or closes browser without actually leaving session
     * It will find the disconnecting party and flag them as disconnected to prevent them from recieving broadcasts
     * The disconnect flag will be overwritten by a socket ID when they reconnect
     * Params:
     *      index: Object - {ofSession: <index of session>, ofClient: <index of client or 'host' if host>}
     * */
    util.disconnect = function(index) {
        if (index.ofClient === 'host') {
            sessions[index.ofSession].host.id = 'DISCONNECTED';
        } else {
            sessions[index.ofSession].clients[index.ofClient].id = 'DISCONNECTED';
        }
    };

    return util;
};