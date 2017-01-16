class ComponentNetwork extends Component {
    constructor() {
        super("network");
        this.lastJSON = "";
        this.lastTimestamp = null;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{});
    }
    fromJSON(data) {
        super.fromJSON(data);
        return this;
    }
    onNetworkUpdate(data) {
        this.gameObject.fromJSON(data);
        this.lastJSON = JSON.stringify(this.gameObject.toJSON()); // force sync
    }
    onStart() {
        this.lastJSON = JSON.stringify(this.gameObject.toJSON());
    }
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        if(this.lastTimestamp == null || timestamp-this.lastTimestamp >= 100) { // update every 100 ms
            var nowJSON = JSON.stringify(this.gameObject.toJSON());
            if(nowJSON != this.lastJSON) {
                this.lastJSON = nowJSON;
                socket.emit('updateObject',this.gameObject.toJSON()); // sync gameObject
            }
            this.lastTimestamp = timestamp;
        }
        return true;
    }
}

classList["ComponentNetwork"] = ComponentNetwork;