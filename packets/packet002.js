//packet002
//Client Connection packet

module.exports = function(me) {
    var _p = {};
    _p.construct = function(data) {
        var sessionIndex = null;
        var joinSession = false;
        for(var i in sessions){
            if(sessions[i].id===data.sessionID){
                sessionIndex = i;
                var inSession = false;
                for(var j in sessions[i].clients){
                    if(sessions[i].clients[j]===me){
                        inSession=true;
                        break;
                    }
                }
                joinSession=!inSession;
                break;
            }
        }
        if(joinSession){
            sessions[sessionIndex].clients.push(me);
            var packet = {index:sessionIndex};
            //redirect to client page
        }else{
            console.log("No Session "+data.sessionID+" found or "+me+" already connected as client");
        }
        console.log(sessions);
    }
    _p.emit = function(){

    }
    return _p;
};