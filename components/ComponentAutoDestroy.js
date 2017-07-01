class ComponentAutoDestroy extends Component {
    constructor(name) {
        super(name);
        this.countdown = 100;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        return this;
    }
    
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        this.countdown--;
        if(this.countdown <= 0) {
            // destroy
            server_deleteObject(this.gameObject.id);
        }
    }
}

classList["ComponentAutoDestroy"] = ComponentAutoDestroy;