"use strict"
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

app.listen( 8080 );
console.log("Server started");

function handler (req, res) {
    if(req.url == '/') req.url = '/client.html';
    //console.log("[HTTP] Request "+(__dirname + req.url));
    fs.readFile(__dirname + req.url,
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading '+req.url);
        }

        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.writeHead(200);
        res.end(data);
    });
}

function log(data) {
	console.log(data);
	io.emit('log',data);
}
function getDebugName(socket) { return "["+socket.name+":"+socket.id+"]"; }

var objectList = {};
var prefabList = {};

var objectIdGenerator = 0;
var prefabIdGenerator = 0;
var playerIdGenerator = 0;

/// Copy client's requirement
global.isServer = true;
var components = require('./server_components.js')(global);
for(var comp in global.classList) {
    global[comp] = global.classList[comp];
}
global.getObjectFromId = function(id) {
    return objectList[id];
}
global.Image = class {
    constructor() {this.src = undefined;}
};
console.log("READY !");
io.on('connection',function (socket) {
	log("New connection from "+socket.request.connection.remoteAddress);
    
    socket.emit('playerInfo',{
        id : playerIdGenerator++
    });
    
    // send all object and prefab
    for(var prefab in prefabList) {
        socket.emit('newPrefab',prefabList[prefab]);
    }
    for(var obj in objectList) {
        socket.emit('newObject',objectList[obj]);
    }
    
	socket.on('setName',function (name) {
		socket.name = name; 
		log("New name : "+name);
	});
	socket.on('disconnect',function () {
		log("Player disconnected : "+getDebugName(socket));
	});
	
	socket.on('createPrefab',function (prefab) {
        console.log("New prefab created");
		var id = "SP_"+(prefabIdGenerator++);
		prefab.id = id;
		prefabList[id] = prefab;
		io.emit('newPrefab',prefab);
	});
	
	socket.on('createObject',function (data) {
        var id = "SO_"+(objectIdGenerator++);
        console.log("New object id "+id+" created");
        var obj = new GameObject();
		// create object from prefab
        data.id = id;
        obj.fromJSON(data);
		objectList[id] = obj;
		io.emit('newObject',data);
	});
    
    socket.on('updateObject',function (data) {
        //console.log("Object "+data.id+" updated");
        objectList[data.id].getComponent(ComponentNetwork).onNetworkUpdate(data);
        socket.broadcast.emit('updateObject',data); // broadcast to everyone except sender
    });
    
    socket.on('callRPC',function(data) {
        var obj = objectList[data.objId];
        if(obj === undefined) return;
        for(var comp of obj.components) {
            if(comp.id == data.compId) {
                comp.callRPC(data.func,data.params);
                break;
            }
        }
    });
    
    socket.on('deleteObject',function (id) {
        objectList[id].destroy();
        delete objectList[id];
        io.emit('deleteObject',id);
    });
	
});
global.socket = io;
function update() {
    var timestamp = Date.now();
    for(var id in objectList) {
        objectList[id].serverUpdate(timestamp);
    }
}

var gameInterval = setInterval(update,1000/60);