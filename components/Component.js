class Component extends Base {
    constructor(name) {
        super();
        this.componentName = name;
        this.enabled = true;
        this.enabledThisFrame = true;
        this.disabledForAFrame = false;
        this.disabledTimestamp = 0;
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
    onDestroy() {
        
    }
    onKeyPress(key) {
        
    }
    onUpdate(timestamp) {
        if(!this.enabled || this.disabledForAFrame || this.disabledTimestamp == timestamp) {
            this.enabledThisFrame = false;
        }
        else {
            this.enabledThisFrame = true;
        }
        if(this.enabledThisFrame && this.disabledTimestamp != timestamp) return true;
        if(this.disabledTimestamp != timestamp) this.enabledThisFrame = true;
        return false;
    }
    
    disableForThisFrame(timestamp) {
        // disable this component for this frame
        this.disabledForAFrame = true;
        this.disabledTimestamp = timestamp;
        this.enabledThisFrame = false;
    }
    
    isEnabled() {
        return this.enabled && this.enabledThisFrame;
    }
}
classList["Component"] = Component;