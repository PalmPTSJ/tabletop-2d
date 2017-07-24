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
heroPrefab.addComponent(new RPG_ComponentHealth());
heroPrefab.addComponent(new RPG_ComponentAttack());
heroPrefab.addComponent(new RPG_ComponentPlayerControllable());

socket.emit('createPrefab',heroPrefab.toJSON());



var enemyPrefab = new EmptyPrefab("RPG - Enemy");
enemyPrefab.addComponent(new ComponentTransformTween());
enemyPrefab.addComponent(new ComponentNetwork());
enemyPrefab.addComponent(new ComponentTabletopObject());
enemyPrefab.addComponent(new ComponentCursorCollider());
enemyPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:-1},
    size    : {width:40,height:60}
});
enemyPrefab.addComponent((new ComponentRectRenderer()).fromJSON({
    color : "#AA0000"
}));
enemyPrefab.addComponent(new RPG_ComponentHealth());
enemyPrefab.addComponent(new RPG_ComponentAttack());
enemyPrefab.addComponent(new RPG_ComponentEnemy());
socket.emit('createPrefab',enemyPrefab.toJSON());