io = require('socket.io')(8080);
console.log("Server started");

function log(data) {
	console.log(data);
	io.emit('log',data);
}
function getDebugName(socket) { return "["+socket.name+":"+socket.id+"]"; }

var objectList = {};
var prefabList = {};

var objectId = 0;
var prefabId = 0;


io.on('connection',function (socket) {
	console.log("New connection from : "+socket);
    
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
		var id = prefabId++;
		prefab.id = id;
		prefabList[id] = prefab;
		io.emit('newPrefab',prefab);
	});
	
	socket.on('createObject',function (obj) {
        console.log("New object created");
		// create object from prefab
		var id = objectId++;
        obj.id = id;
		objectList[id] = obj;
		io.emit('newObject',obj);
	});
    
    socket.on('updateObject',function (obj) {
        objectList[obj.id] = obj;
        socket.broadcast.emit('updateObject',obj); // broadcast to everyone except sender
    });
    
    socket.on('deleteObject',function (id) {
        delete objectList[id];
        io.emit('deleteObject',id);
    });
	
})