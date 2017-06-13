class ComponentTabletopObject extends Component {
    constructor(name) {
        super("tabletopObject");
    }
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 46) { // (DEL) = Delete object
            socket.emit("deleteObject",this.gameObject.id);
        }
        if(key == 'h'.charCodeAt(0)) { // (H) = Put in/out hand
            var comp = this.gameObject.getEnabledComponent(ComponentObjectInHand);
            if(comp && playerInfo.id == comp.player) {
                this.gameObject.deleteComponent(comp);
            }
            else if(!comp) {
                this.gameObject.addComponent((new ComponentObjectInHand()).fromJSON({
                    player : playerInfo.id
                }));
            }
        }
        if(key == 'c'.charCodeAt(0)) { // (C) = Clone
            var objectJSON = this.gameObject.toJSON();
            objectJSON.id = null;
            socket.emit('createObject',objectJSON);
        }
    }
}

classList["ComponentTabletopObject"] = ComponentTabletopObject;