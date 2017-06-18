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
    
    road_red : "http://www.colorcombos.com/images/colors/FF0000.png",
    road_green : "http://www.colorcombos.com/images/colors/00FF00.png",
    road_blue : "http://www.colorcombos.com/images/colors/0000FF.png",
    road_yellow : "http://www.colorcombos.com/images/colors/FFFF00.png",
    
    resourceGuide : "http://www.starlitcitadel.com/games/media//IMG_1372_1.jpg",
    
    res_brick : "http://www.clker.com/cliparts/y/D/l/y/y/O/brick-icon-md.png",
    res_wood : "https://cdn2.iconfinder.com/data/icons/food-icons-6/200/farm_wood-512.png",
    res_wheat : "https://www.iconexperience.com/_img/g_collection_png/standard/512x512/wheat.png",
    res_stone : "https://vignette4.wikia.nocookie.net/farmville/images/7/73/Star_Rock-icon.png/revision/latest?cb=20130113145753",
    res_sheep : "https://cdn4.iconfinder.com/data/icons/spring/500/Spring_sheep-512.png",
    
    res_back : "https://s-media-cache-ak0.pinimg.com/originals/1c/a7/06/1ca706c19999f30fbd97eb3a625c2edc.jpg",
    
    thief : "https://vignette4.wikia.nocookie.net/payday/images/5/5f/Russian_Cloaker.png/revision/latest?cb=20161207110538",
    
    devCard_knight : "http://www.catan.com/files/styles/large/public/gallery/cfe-knight.jpg?itok=P7fl-O1I",
    devCard_road : "https://i2.wp.com/www.boardgameanalysis.com/wp-content/uploads/2017/04/CatanCard_RoadBuilding.jpg?resize=202%2C300&ssl=1",
    devCard_monopoly : "https://www.boardgameanalysis.com/wp-content/uploads/2017/04/CatanCard_Monopoly-201x300.jpg",
    devCard_vp : "https://i0.wp.com/www.boardgameanalysis.com/wp-content/uploads/2017/04/CatanCard_VictoryPoint.jpg?resize=203%2C300&ssl=1",
    devCard_yearOfPlenty : "https://i2.wp.com/www.boardgameanalysis.com/wp-content/uploads/2017/04/CatanCard_YearOfPlenty.jpg?resize=197%2C300&ssl=1",
    
    devCard_back : "https://s-media-cache-ak0.pinimg.com/736x/ed/b7/02/edb702c8400d4b0c806d964380b03b6a.jpg",
    
    dice1 : "https://www.csee.umbc.edu/courses/undergraduate/104/fall09/ordonez/projects/die-images/Die-1.gif",
    dice2 : "https://www.csee.umbc.edu/courses/undergraduate/104/fall09/ordonez/projects/die-images/Die-2.gif",
    dice3 : "https://www.csee.umbc.edu/courses/undergraduate/104/fall09/ordonez/projects/die-images/Die-3.gif",
    dice4 : "https://www.csee.umbc.edu/courses/undergraduate/104/fall09/ordonez/projects/die-images/Die-4.gif",
    dice5 : "https://www.csee.umbc.edu/courses/undergraduate/104/fall09/ordonez/projects/die-images/Die-5.gif",
    dice6 : "https://www.csee.umbc.edu/courses/undergraduate/104/fall09/ordonez/projects/die-images/Die-6.gif",

}

// Create prefab
var boardPrefab = new Prefab("Board");
boardPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:-1},
    size    : {width:800,height:800}
});
boardPrefab.addComponent((new ComponentImageRenderer()).fromJSON({
    url     : imageData.board
}));
socket.emit('createPrefab',boardPrefab.toJSON());



var housePrefab = new Prefab("House");
housePrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:50,height:50}
});
housePrefab.addComponent((new ComponentImageRendererMulti()).fromJSON({
    faces : [imageData.house_red,imageData.house_green,imageData.house_blue,imageData.house_yellow]
}));
housePrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',housePrefab.toJSON());



var cityPrefab = new Prefab("City");
cityPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:50,height:50}
});
cityPrefab.addComponent((new ComponentImageRendererMulti()).fromJSON({
    faces : [imageData.city_red,imageData.city_green,imageData.city_blue,imageData.city_yellow]
}));
cityPrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',cityPrefab.toJSON());



var roadPrefab = new Prefab("Road");
roadPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:50,height:6}
});
roadPrefab.addComponent((new ComponentImageRendererMulti()).fromJSON({
    faces : [imageData.road_red,imageData.road_green,imageData.road_blue,imageData.road_yellow]
}));
roadPrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',roadPrefab.toJSON());



var resourceGuidePrefab = new Prefab("Resource Guide");
resourceGuidePrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:2},
    size    : {width:500,height:500}
});
resourceGuidePrefab.addComponent((new ComponentImageRenderer()).fromJSON({
    url : imageData.resourceGuide
}));
resourceGuidePrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',resourceGuidePrefab.toJSON());



var thiefPrefab = new Prefab("Thief");
thiefPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:50,height:50}
});
thiefPrefab.addComponent((new ComponentImageRenderer()).fromJSON({
    url : imageData.thief
}));
thiefPrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',thiefPrefab.toJSON());



var dicePrefab = new Prefab("Dice");
dicePrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:2},
    size    : {width:100,height:100}
});
dicePrefab.addComponent((new ComponentImageRendererMulti()).fromJSON({
    faces : [imageData.dice1,imageData.dice2,imageData.dice3,imageData.dice4,imageData.dice5,imageData.dice6]
}));
dicePrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',dicePrefab.toJSON());



var resourcePrefab = new Prefab("Resource");
resourcePrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:60,height:60}
});
resourcePrefab.addComponent((new ComponentImageRendererMulti()).fromJSON({
    faces : [imageData.res_brick,imageData.res_sheep,imageData.res_stone,imageData.res_wood,imageData.res_wheat]
}));
resourcePrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',resourcePrefab.toJSON());



function createDevPrefab(cardImg,cardName) {
    var card = new Prefab("Dev card - "+cardName);
    card.getComponent(ComponentTransform).fromJSON({
        pos     : {x:0,y:0,z:0},
        size    : {width:60,height:100}
    });
    card.addComponent((new ComponentImageRendererMulti()).fromJSON({
        faces : [cardImg,imageData.devCard_back]
    }));
    card.addComponent(new ComponentCursorCollider());
    socket.emit('createPrefab',card.toJSON());
    return card;
}
createDevPrefab(imageData.devCard_knight,"Knight");
createDevPrefab(imageData.devCard_vp,"Market");
createDevPrefab(imageData.devCard_road,"Road");
createDevPrefab(imageData.devCard_monopoly,"Monopoly");
createDevPrefab(imageData.devCard_yearOfPlenty,"Year of Plenty");

var deckPrefab = new Prefab("Dev Deck Holder");
deckPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:0},
    size    : {width:60,height:100}
});
deckPrefab.addComponent(new ComponentObjectStack());
deckPrefab.addComponent(new ComponentCursorCollider());
socket.emit('createPrefab',deckPrefab.toJSON());
