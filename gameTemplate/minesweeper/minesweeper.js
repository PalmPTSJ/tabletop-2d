/** Tabletop2d template for minesweeper
How to use  : Copy and paste this code into console
Author      : PalmPTSJ
**/

// Create prefab
var boardPrefab = new PrefabTabletop("???");
boardPrefab.addComponent(new Minesweeper_ComponentBoard());

// Board Tiny : 5x5 , 5 mines
boardPrefab.name = "Minesweeper - Board Tiny";
boardPrefab.getComponent(Minesweeper_ComponentBoard).fromJSON({
    boardSize : {width:5,height:5},
    mineCount : 5
})
boardPrefab.getComponent(ComponentTransform).fromJSON({
    size    : {width:200,height:200}
});
socket.emit('createPrefab',boardPrefab.toJSON());

// Board small : 9x9 , 10 mines
boardPrefab.name = "Minesweeper - Board Small";
boardPrefab.getComponent(Minesweeper_ComponentBoard).fromJSON({
    boardSize : {width:9,height:9},
    mineCount : 10
})
boardPrefab.getComponent(ComponentTransform).fromJSON({
    size    : {width:360,height:360}
});
socket.emit('createPrefab',boardPrefab.toJSON());

// Board normal : 16x16 , 40 mines
boardPrefab.name = "Minesweeper - Board Normal";
boardPrefab.getComponent(Minesweeper_ComponentBoard).fromJSON({
    boardSize : {width:16,height:16},
    mineCount : 40
})
boardPrefab.getComponent(ComponentTransform).fromJSON({
    size    : {width:640,height:640}
});
socket.emit('createPrefab',boardPrefab.toJSON());

// Board big : 30x16 , 99 mines
boardPrefab.name = "Minesweeper - Board Big"
boardPrefab.getComponent(Minesweeper_ComponentBoard).fromJSON({
    boardSize : {width:30,height:16},
    mineCount : 99
})
boardPrefab.getComponent(ComponentTransform).fromJSON({
    size    : {width:1200,height:640}
});
socket.emit('createPrefab',boardPrefab.toJSON());