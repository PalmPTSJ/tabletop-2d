class ComponentTextRenderer extends ComponentRenderer {
    constructor() {
        super("textRenderer");
        this.text = "";
        this.font = "30px Arial";
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            text : this.text,
            font : this.font
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.text !== undefined) this.text = data.text;
        return this;
    }

    render() {
        if(!this.gameObject.getComponent(ComponentTransform)) {
            console.log("[TextRenderer] can't find transform");
            return;
        }
        var transform = this.gameObject.getComponent(ComponentTransform);
        ctx.save();
        transform.setupCanvas();
        ctx.font = this.font;
        ctx.fillText(this.text,0,0);
        ctx.restore();
    }
}

classList["ComponentTextRenderer"] = ComponentTextRenderer;