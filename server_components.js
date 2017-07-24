var fs = require('fs');
var vm = require("vm");
var ctx;
function importFile(file) { // Read and eval library
    var filedata = fs.readFileSync(file,'utf8');
    console.log("[server_components.js] Importing file "+file);
    vm.runInNewContext(filedata, ctx, '.');
}
// Import js file
module.exports = function(context) {
    ctx = context;
    importFile("gameObject.js");

    importFile("components/Component.js");
    importFile("components/ComponentTransform.js");
    importFile("components/ComponentTransformTween.js")
    importFile("components/ComponentNetwork.js");

    importFile("components/ComponentTabletopObject.js");
    importFile("components/ComponentObjectInHand.js");
    importFile("components/ComponentObjectStack.js");

    importFile("components/ComponentCursorCollider.js");

    importFile("components/ComponentRenderer.js");
    importFile("components/ComponentImageRenderer.js");
    importFile("components/ComponentRectRenderer.js");
    importFile("components/ComponentTextRenderer.js");
    importFile("components/ComponentImageRendererMulti.js");
    
    importFile("components/ComponentAutoDestroy.js");
    
    importFile("components/YugiohRPG/RPG_ComponentHealth.js");
    importFile("components/YugiohRPG/RPG_ComponentAttack.js");
    importFile("components/YugiohRPG/RPG_ComponentEnemy.js");
    importFile("components/YugiohRPG/RPG_ComponentPlayerControllable.js");
    importFile("components/YugiohRPG/RPG_ComponentDropTable.js");
    
    importFile("components/minesweeper/Minesweeper_ComponentCell.js");
    importFile("components/minesweeper/Minesweeper_ComponentCellRenderer.js");
    importFile("components/minesweeper/Minesweeper_ComponentBoard.js");
    
    
    return context;
}