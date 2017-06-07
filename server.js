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
	
	socket.on('createObject',function (obj) {
        console.log("New object created");
		// create object from prefab
		var id = "SO_"+(objectIdGenerator++);
        obj.id = id;
		objectList[id] = obj;
		io.emit('newObject',obj);
	});
    
    socket.on('updateObject',function (obj) {
        objectList[obj.id] = obj;
        console.log("Object "+obj.id+" updated");
        socket.broadcast.emit('updateObject',obj); // broadcast to everyone except sender
    });
    
    socket.on('deleteObject',function (id) {
        delete objectList[id];
        io.emit('deleteObject',id);
    });
	
})