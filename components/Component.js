class Component extends Base {
    constructor(name) {
        super();
        this.componentName = name;
        this.enabled = true;
        this.enabledThisFrame = true;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            id : this.id,
            enabled : this.enabled
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.id) this.id = data.id;
        if(data.enabled) this.enabled = data.enabled;
        return this;
    }
    onStart() {
        
    }
    onKeyPress(key) {
        
    }
    onUpdate(timestamp) {
        if(this.enabled && this.enabledThisFrame) return true;
        this.enabledThisFrame = true;
        return false;
    }
    
    disableForThisFrame() {
        // disable this component for this frame
        this.enabledThisFrame = false;
    }
}
classList["Component"] = Component;