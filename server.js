"use strict"
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

app.listen( 8080 );
console.log("Server started");

function handler (req, res) {
    if(req.url == '/') req.url = '/client.html';
    fs.readFile(__dirname + req.url,
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading '+req.url);
        }
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

var idGenerator = 0;

/// Copy client's requirement
global.objectList = objectList;
global.isServer = true;
global.generateNewId = function() {
    return "SERV_"+(idGenerator++);
}
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
global.socket = io;

console.log("Server ready !");

global.server_createObject = function(data) {
    //console.log("S_CREATE",data);
    if(data.id == null) {
        let id = "SO_"+(objectIdGenerator++);
        data.id = id;
    }
    console.log("New object "+data.id+" created");
    let obj = new GameObject();
    obj.fromJSON(data);
    objectList[data.id] = obj;
    
    io.emit('newObject',data);
}

global.server_deleteObject = function(id) {
    if(objectList[id] != undefined) {
        objectList[id].destroy();
        delete objectList[id];
        io.emit('deleteObject',id);
    }
}

io.on('connection',function (socket) {
	log("New connection from "+socket.request.connection.remoteAddress);
    
    socket.emit('playerInfo',{
        id : playerIdGenerator++
    });
    
    // send all object and prefab
    for(var id in prefabList) {
        socket.emit('newPrefab',prefabList[id]);
    }
    for(var id in objectList) {
        socket.emit('newObject',objectList[id]);
    }
    
	socket.on('setName',function (name) {
		socket.name = name; 
		log("New name : "+name);
	});
	socket.on('disconnect',function () {
		log("Player disconnected : "+getDebugName(socket));
	});
	
	socket.on('createPrefab',function (prefab) {
        if(prefab.id == null) {
            let id = "SP_"+(prefabIdGenerator++);
            prefab.id = id;
        }
        console.log("New prefab "+prefab.id+" created");
        prefabList[prefab.id] = prefab;
        
		io.emit('newPrefab',prefab);
	});
	
	socket.on('createObject',function (data) {
        //console.log("C_CREATE",data);
        
        if(data.id == null) {
            let id = "SO_"+(objectIdGenerator++);
            data.id = id;
        }
        console.log("New object "+data.id+" created");
        var obj = new GameObject();
        obj.fromJSON(data);
		objectList[data.id] = obj;
        
		io.emit('newObject',data);
	});
    
    socket.on('updateObject',function (data) {
        if(objectList[data.id] != undefined) {
            objectList[data.id].getEnabledComponent(ComponentNetwork).onNetworkUpdate(data);
            socket.broadcast.emit('updateObject',data); // broadcast to everyone except sender
        }
    });
    
    socket.on('callRPC',function(data) {
        var obj = objectList[data.objId];
        if(obj == undefined) return;
        for(var comp of obj.components) {
            if(comp.id == data.compId) {
                comp.callRPC(data.func,data.params);
                break;
            }
        }
    });
    
    socket.on('deleteObject',function (id) {
        if(objectList[id] != undefined) {
            objectList[id].destroy();
            delete objectList[id];
            io.emit('deleteObject',id);
        }
    });
});

function update() {
    var timestamp = Date.now();
    for(var id in objectList) {
        objectList[id].serverUpdate(timestamp);
    }
}

var gameInterval = setInterval(update,1000/60);