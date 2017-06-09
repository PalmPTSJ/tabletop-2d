/** Tabletop2d template for checkers
How to use  : Copy and paste this code into console
Author      : PalmPTSJ
**/

var imageData = {
    gameMat : "http://vignette2.wikia.nocookie.net/yugioh/images/d/dd/Link_Summon_Mat.png/revision/latest?cb=20170321140116",
    card_decodeTalker : "https://pre12.deviantart.net/460b/th/pre/f/2017/049/5/d/decode_talker_yugioh_by_yeidenex-dazisnk.png",
    card_linkSpider : "http://orig03.deviantart.net/cbd2/f/2017/049/7/b/link_spider_yugioh_by_yeidenex-dazj7fm.png",
    card_proxyDragon : "http://orig14.deviantart.net/2d1e/f/2017/096/2/b/proxy_dragon_yugioh_ocg_by_yeidenex-db4wuux.png",

    card_scapegoat : "http://vignette1.wikia.nocookie.net/yugioh/images/2/24/Scapegoat-LDK2-EN-C-1E.png/revision/latest?cb=20161007083843",
    card_mirrorForce : "http://vignette4.wikia.nocookie.net/yugioh/images/0/0a/MirrorForce-SDMY-EN-C-1E.png/revision/latest?cb=20161021200533",
    
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
socket.emit('createPrefab',matPrefab.toJSON());

var deckPrefab = new Prefab("Deck Holder");
deckPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:0},
    size    : {width:60,height:100}
});
deckPrefab.addComponent(new ComponentObjectStack());
deckPrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',deckPrefab.toJSON());

function createCardPrefab(cardImg,cardName) {
    var card = new Prefab(cardName);
    card.getComponent(ComponentTransform).fromJSON({
        pos     : {x:0,y:0,z:0},
        size    : {width:60,height:100}
    });
    card.addComponent((new ComponentImageRendererMulti()).fromJSON({
        faces : [cardImg,imageData.cardBack]
    }));
    card.addComponent(new ComponentCursorCollider());
    socket.emit('createPrefab',card.toJSON());
    return card;
}

// create object
createCardPrefab(imageData.card_decodeTalker,"Card - Decode Talker");
createCardPrefab(imageData.card_linkSpider,"Card - Link Spider");
createCardPrefab(imageData.card_proxyDragon,"Card - Proxy Dragon");

createCardPrefab(imageData.card_scapegoat,"Card - Scapegoat");
createCardPrefab(imageData.card_mirrorForce,"Card - Mirror Force");

createCardPrefab('https://vignette2.wikia.nocookie.net/yugioh/images/8/8c/Bitron-ST17-JP-NPR.png/revision/latest?cb=20170324150258','Card - Bitron');
createCardPrefab('http://orig00.deviantart.net/ae4c/f/2017/137/2/8/draconnet_by_alanmac95-db3e2ue.png','Card - Draconnet');
createCardPrefab('http://pre00.deviantart.net/7e68/th/pre/f/2017/052/4/7/link_slayer_yugioh_by_yeidenex-dazw4a5.png','Card - Link Slayer');
