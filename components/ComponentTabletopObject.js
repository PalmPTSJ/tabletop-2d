class ComponentTabletopObject extends Component {
    constructor(name) {
        super("tabletopObject");
    }
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 46) { // delete
            socket.emit("deleteObject",this.gameObject.id);
        }
    }
}

classList["ComponentTabletopObject"] = ComponentTabletopObject;