/** Tabletop2d template for checkers
How to use  : Copy and paste this code into console
Author      : PalmPTSJ
**/

var imageData = {
    gameMat : "http://vignette2.wikia.nocookie.net/yugioh/images/d/dd/Link_Summon_Mat.png/revision/latest?cb=20170321140116",
    card_decodeTalker : "http://pm1.narvii.com/6379/e5086f2b604fe9e85eef289bc3cf0124f82c698a_hq.jpg",
    cardBack : "https://s-media-cache-ak0.pinimg.com/736x/ed/b7/02/edb702c8400d4b0c806d964380b03b6a.jpg"
}

// Create prefab
var matPrefab = new Prefab("Mat");
matPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:-1},
    size    : {width:800,height:600}
});
matPrefab.addComponent((new ComponentImageRenderer()).fromJSON({
    url     : imageData.gameMat
}));
matPrefab.addComponent((new ComponentTextRenderer()).fromJSON({
    text : "Welcome to tabletop 2d! Let's play Yu-Gi-Oh!"
}));

var card_decodeTalker_prefab = new Prefab("Card - Decode Talker");
card_decodeTalker_prefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:0},
    size    : {width:60,height:100}
});
card_decodeTalker_prefab.addComponent((new ComponentImageRendererMulti()).fromJSON({
    faces : [imageData.card_decodeTalker,imageData.cardBack]
}));
card_decodeTalker_prefab.addComponent(new ComponentCursorCollider());

// create object
socket.emit('createPrefab',matPrefab.toJSON());
socket.emit('createPrefab',card_decodeTalker_prefab.toJSON());