class Component extends Base {
    constructor(name) {
        super();
        this.componentName = name;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            id : this.id
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.id) this.id = data.id;
        return this;
    }
    onStart() {
        
    }
    onKeyPress(key) {
        
    }
    onUpdate(timestamp) {
        
    }
}
classList["Component"] = Component;