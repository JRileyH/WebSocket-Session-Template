//packet002
//Client Connection packet

module.exports = function(me) {
    var _p = {};
    _p.serve = function(data) {
        var sessionIndex = null;
        var joinSession = false;
        for(var i in sessions){
            if(sessions[i].id===data.sessionID){
                sessionIndex = i;
                var inSession = false;
                for(var j in sessions[i].clients){
                    if(sessions[i].clients[j].ip===me.ip){
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
        }else{
            console.log("No Session "+data.sessionID+" found or "+me.ip+" already connected as client");
        }
        console.log(sessions);
    }
    _p.respond = function(){

    }
    return _p;
};