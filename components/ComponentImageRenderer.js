class ComponentImageRenderer extends ComponentRenderer { // This component render object's image
    constructor() {
        super("imageRenderer");
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            url : this.url,
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.url = data.url;
        
        this.img = new Image;
        if(this.url) this.img.src = this.url;
        
        return this;
    }
    
    onUpdate(timestamp) {
        super.onUpdate(timestamp);
    }
    
    render() {
        if(!this.gameObject.getComponent(ComponentTransform)) {
            console.log("[ImageRenderer] can't find transform");
            return;
        }
        if(!this.img) {
            console.log("[ImageRenderer] can't load image");
            return;
        }
        var transform = this.gameObject.getComponent(ComponentTransform);
        var pos = transform.getAbsolutePos();
        ctx.drawImage(this.img,pos.x,pos.y,transform.size.width,transform.size.height);
    }
}

classList["ComponentImageRenderer"] = ComponentImageRenderer;