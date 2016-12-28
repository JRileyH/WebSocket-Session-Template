//packet001
//Host Connection packet

module.exports = function(me){
    var _p = {};
    _p.serve = function(data){
        var sessionIndex = null;
        var sessionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
        var createSession = true;
        for(var i in global.sessions){
            if(global.sessions[i].host===me){
                sessionIndex = i;
                createSession = false;
                break;
            }else if(global.sessions[i].id===sessionID){
                sessionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
                i=-1;continue;
            }
        }
        if(createSession){
            console.log(me + " connected as Host for Session "+ sessionID);
            global.sessions.push({
                host:me,
                id:sessionID,
                clients:[]
            });
            var packet = {index:sessionIndex};
        }else{
            console.log("Host "+me+" already connected for Session "+global.session[sessionIndex].id);
        }
        console.log(global.sessions);
    }
    _p.respond = function(){

    }
    return _p;
};
