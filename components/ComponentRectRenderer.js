class ComponentRectRenderer extends ComponentRenderer { // Render rectangle
    constructor() {
        super("rectRenderer");
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            color : this.color
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.color = data.color;
        return this;
    }
    
    render() {
        if(!this.gameObject.getComponent(ComponentTransform)) {
            console.log("[RectRenderer] can't find transform");
            return;
        }
        var transform = this.gameObject.getComponent(ComponentTransform);
        var pos = transform.getAbsolutePos();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(pos.x,pos.y,transform.size.width,transform.size.height);
        ctx.fill();
    }
}

classList["ComponentRectRenderer"] = ComponentRectRenderer;