class ComponentObjectInHand extends Component {
    constructor(name) {
        super("objectInHand");
        this.player = 0;
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            player : this.player
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.player !== undefined) this.player = data.player

        return this;
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        if(playerInfo.id != this.player) {
            // disable renderer and cursor collider
            if(this.gameObject.getComponent(ComponentRenderer))
                this.gameObject.getComponent(ComponentRenderer).disableForThisFrame();
            if(this.gameObject.getComponent(ComponentCursorCollider))
                this.gameObject.getComponent(ComponentCursorCollider).disableForThisFrame();
        }
        
        // draw highlight
        if(playerInfo.id == this.player) ctx.fillStyle = "#8FF";
        else ctx.fillStyle = "#FA0";
        
        var transform = this.gameObject.getComponent(ComponentTransform);
        var pos = transform.getAbsolutePos();
        ctx.globalAlpha = 0.2;
        ctx.fillRect(pos.x,pos.y,transform.size.width,transform.size.height);
        ctx.globalAlpha = 1;
        
        return true;
    }
    
    onKeyPress(key) {
        super.onKeyPress(key);
        
    }
}

classList["ComponentObjectInHand"] = ComponentObjectInHand;