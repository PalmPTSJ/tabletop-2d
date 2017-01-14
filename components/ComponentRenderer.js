// Base class for any renderer class

class ComponentRenderer extends Component {
    constructor() {
        super("renderer");
        this.enabled = true;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            enabled : this.enabled,
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.enabled !== undefined) this.enabled = data.enabled;
        return this;
    }
    
    onUpdate(timestamp) {
        super.onUpdate(timestamp);
        // render if enabled
        if(this.enabled) this.render();
    }
    
    render() {} // (Abstract: Every renderer have to implement this function)
    
}

classList["ComponentRenderer"] = ComponentRenderer;