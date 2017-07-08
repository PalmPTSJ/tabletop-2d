/** Tabletop2d template for minesweeper
How to use  : Copy and paste this code into console
Author      : PalmPTSJ
**/

var imageData = {
    
}

// Create prefab
var boardPrefab = new Prefab("");
boardPrefab.addComponent(new ComponentCursorCollider());
boardPrefab.addComponent(new Minesweeper_ComponentBoard());

boardPrefab.name = "Minesweeper - Board Tiny"
boardPrefab.getComponent(Minesweeper_ComponentBoard).fromJSON({
    boardSize : {width:5,height:5},
    mineCount : 5
})
boardPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:200,height:200}
});
socket.emit('createPrefab',boardPrefab.toJSON());

boardPrefab.name = "Minesweeper - Board Small"
boardPrefab.getComponent(Minesweeper_ComponentBoard).fromJSON({
    boardSize : {width:9,height:9},
    mineCount : 10
})
boardPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:360,height:360}
});

socket.emit('createPrefab',boardPrefab.toJSON());

boardPrefab.name = "Minesweeper - Board Normal"
boardPrefab.getComponent(Minesweeper_ComponentBoard).fromJSON({
    boardSize : {width:16,height:16},
    mineCount : 40
})
boardPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:640,height:640}
});
socket.emit('createPrefab',boardPrefab.toJSON());

boardPrefab.name = "Minesweeper - Board Big"
boardPrefab.getComponent(Minesweeper_ComponentBoard).fromJSON({
    boardSize : {width:30,height:16},
    mineCount : 99
})
boardPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:1200,height:640}
});
socket.emit('createPrefab',boardPrefab.toJSON());