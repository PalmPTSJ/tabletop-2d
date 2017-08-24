class Client extends Component {
    constructor(name) {
        super();
        this.canvas = null;
        this.ctx = null;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            canvas : this.canvas,
            ctx : this.ctx
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.canvas !== undefined) this.canvas = data.canvas;
        if(data.ctx !== undefined) this.ctx = data.ctx; 
        return this;
    }
    onStart() {
        
    }
    onDestroy() {
        
    }

}
classList["Client"] = Client;