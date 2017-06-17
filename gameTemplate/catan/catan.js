/** Tabletop2d template for catan
How to use  : Copy and paste this code into console
Author      : PalmPTSJ
**/

var imageData = {
    board : "https://opinionatedgamers.files.wordpress.com/2015/07/catan-game-board.jpg",
    
    house_blue : "http://www.clker.com/cliparts/F/t/X/o/S/p/simple-blue-house-hi.png",
    house_red : "http://www.clker.com/cliparts/p/T/f/e/A/F/small-house-red-hi.png",
    house_green : "http://www.clker.com/cliparts/0/V/W/v/h/2/simple-green-house-md.png",
    house_yellow : "http://www.clker.com/cliparts/O/i/x/Y/q/P/yellow-house-hi.png",
    
    city_red : "https://cdn.iconscout.com/public/images/icon/premium/png-512/city-house-home-building-structure-architecture-construction-33e6ccf79bf5e44c-512x512.png",
    city_blue : "https://cdn4.iconfinder.com/data/icons/ios7-active-2/512/Company.png",
    city_green : "http://individual.icons-land.com/IconsPreview/POI/PNG/Plain/256x256/City_Plain_Green.png",
    city_yellow : "http://individual.icons-land.com/IconsPreview/POI/PNG/Plain/256x256/City_Plain_Orange.png",
    
    resourceGuide : "http://www.starlitcitadel.com/games/media//IMG_1372_1.jpg",
    
    res_brick : "http://www.clker.com/cliparts/y/D/l/y/y/O/brick-icon-md.png",
    res_wood : "https://cdn2.iconfinder.com/data/icons/food-icons-6/200/farm_wood-512.png",
    res_wheat : "https://www.iconexperience.com/_img/g_collection_png/standard/512x512/wheat.png",
    res_stone : "https://vignette4.wikia.nocookie.net/farmville/images/7/73/Star_Rock-icon.png/revision/latest?cb=20130113145753",
    res_sheep : "https://cdn4.iconfinder.com/data/icons/spring/500/Spring_sheep-512.png",
    
    thief : "https://vignette4.wikia.nocookie.net/payday/images/5/5f/Russian_Cloaker.png/revision/latest?cb=20161207110538",
    
    dice1 : "http://kfo.ath.cx/dice/120px-Dice-1.png",
    dice2 : "http://kfo.ath.cx/dice/120px-Dice-2.png",
    dice3 : "http://kfo.ath.cx/dice/120px-Dice-3.png",
    dice4 : "http://kfo.ath.cx/dice/120px-Dice-4.png",
    dice5 : "http://kfo.ath.cx/dice/120px-Dice-5.png",
    dice6 : "http://kfo.ath.cx/dice/120px-Dice-6.png",

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

// C9 cards
createCardPrefab('http://untitled-palmptsj.c9.io:8080/gameTemplate/yugioh/resources/backupSecretary.png','Card - Backup Secretary');
createCardPrefab('http://untitled-palmptsj.c9.io:8080/gameTemplate/yugioh/resources/cyberseAnnihilation.png','Card - Cyberse Annihilation');
createCardPrefab('http://untitled-palmptsj.c9.io:8080/gameTemplate/yugioh/resources/cyberseBeacon.png','Card - Cyberse Beacon');
createCardPrefab('http://untitled-palmptsj.c9.io:8080/gameTemplate/yugioh/resources/cyberseWizard.png','Card - Cyberse Wizard');
createCardPrefab('http://untitled-palmptsj.c9.io:8080/gameTemplate/yugioh/resources/stackReviver.png','Card - Stack Reviver');
createCardPrefab('http://untitled-palmptsj.c9.io:8080/gameTemplate/yugioh/resources/threeStrikesBarrier.png','Card - Three Strikes Barrier');

