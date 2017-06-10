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
        if(data.url) this.applyImage(data.url);
        return this;
    }
    
    render() {
        if(!this.gameObject.getComponent(ComponentTransform)) {
            //console.log("[ImageRenderer] can't find transform");
            return;
        }
        if(!this.url || !this.img) {
            //console.log("[ImageRenderer] can't load image");
            return;
        }
        var transform = this.gameObject.getComponent(ComponentTransform);
        if(this.img.complete) {
            //console.log(this.img)
            ctx.save();
            transform.setupCanvas();
            ctx.drawImage(this.img,0,0,transform.size.width,transform.size.height);
            ctx.restore();
        }
    }
    
    applyImage(url) {
        this.url = url;
        if(isServer) return;
        this.img = new Image;
        if(this.url) this.img.src = this.url;
        
    }
}

classList["ComponentImageRenderer"] = ComponentImageRenderer;