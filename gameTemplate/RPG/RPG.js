/** Tabletop2d template for RPG
How to use  : Copy and paste this code into console
Author      : PalmPTSJ
**/

var imageData = {
    
}

// Create prefab
var heroPrefab = new EmptyPrefab("RPG - Hero");
heroPrefab.addComponent(new ComponentTransformTween());
heroPrefab.addComponent(new ComponentNetwork());
heroPrefab.addComponent(new ComponentTabletopObject());
heroPrefab.addComponent(new ComponentCursorCollider());

heroPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:-1},
    size    : {width:40,height:60}
});
heroPrefab.addComponent((new ComponentRectRenderer()).fromJSON({
    color : "#00AA00"
}));

heroPrefab.addComponent((new RPG_ComponentHero()));

socket.emit('createPrefab',heroPrefab.toJSON());
