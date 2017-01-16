class ComponentTabletopObject extends Component {
    constructor(name) {
        super("tabletopObject");
    }
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 46) { // delete
            socket.emit("deleteObject",this.gameObject.id);
        }
        if(key == 104) { // (H) = Put in/out hand
            var comp = this.gameObject.getComponent(ComponentObjectInHand);
            if(comp && playerInfo.id == comp.player) {
                this.gameObject.deleteComponent(comp);
            }
            else if(!comp) {
                this.gameObject.addComponent((new ComponentObjectInHand()).fromJSON({
                    player : playerInfo.id
                }));
            }
        }
    }
}

classList["ComponentTabletopObject"] = ComponentTabletopObject;