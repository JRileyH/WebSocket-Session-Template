var fs = require('fs');

//===___HTML HANDLERS___===\\
//handles serving the landing page served before client role is set
var landingHandler = function(req, res, cb){
    fs.readFile(__dirname + '/pages/landing.html', function(err, data){
        if(err){
            res.writeHead(500);
            console.error(err);
            return res.end("ERROR: Failed to load landing page");
        }else{
            res.writeHead(200);
            res.end(data);
        }
    });
};
//handles serving the host page once client has selected host role
var hostHandler = function(req, res){
    fs.readFile(__dirname + '/pages/host.html', function(err, data){
        if(err){
            res.writeHead(500);
            console.error(err);
            return res.end("ERROR: Failed to load host page");
        }else{
            res.writeHead(200);
            res.send(data);
        }
    });
};
//handles serving the client page once client has selected client role
var clientHandler = function(req, res){
    fs.readFile(__dirname + '/pages/client.html', function(err, data){
        if(err){
            res.writeHead(500);
            console.error(err);
            return res.end("ERROR: Failed to load client page");
        }else{
            res.writeHead(200);
            res.send(data);
        }
    });
};

module.exports = {
    landing: landingHandler,
    host: hostHandler,
    client: clientHandler
}