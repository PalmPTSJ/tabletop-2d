/** Tabletop2d template for checkers
How to use  : Copy and paste this code into console
Author      : PalmPTSJ
**/

var imageData = {
    board : "http://www.sjgames.com/proteus/img/chessboard.jpg",
    blackPiece : "data:image/png;base64,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",
    blackKing : "data:image/png;base64,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",
    whitePiece : "data:image/png;base64,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",
    whiteKing : "data:image/png;base64,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"
}

// Create prefab
var boardPrefab = new PrefabStaticImage("Board",imageData.board);
boardPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:-1},
    size    : {width:600,height:600}
});

var blackPiecePrefab = new PrefabImageMulti("Black Piece",[imageData.blackPiece,imageData.blackKing]);
blackPiecePrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:0},
    size    : {width:40,height:40}
});

var whitePiecePrefab = new PrefabImageMulti("White Piece",[imageData.whitePiece,imageData.whiteKing]);
whitePiecePrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:0},
    size    : {width:40,height:40}
});

// create object
socket.emit('createPrefab',boardPrefab.toJSON());
socket.emit('createPrefab',blackPiecePrefab.toJSON());
socket.emit('createPrefab',whitePiecePrefab.toJSON());