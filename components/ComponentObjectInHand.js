class ComponentObjectInHand extends Component {
    constructor(name) {
        super("objectInHand");
        this.player = 0;
        this.handImg = new Image;
        this.handImg.src = "http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons/magic-marker-icons-people-things/115757-magic-marker-icon-people-things-hand22-sc48.png";
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
        ctx.globalAlpha = 0.4;
        ctx.fillRect(pos.x,pos.y,transform.size.width,transform.size.height);
        ctx.globalAlpha = 1;
        
        if(playerInfo.id != this.player) {
            ctx.drawImage(this.handImg,pos.x,pos.y,transform.size.width,transform.size.height);
        }
        
        return true;
    }
    
    onKeyPress(key) {
        super.onKeyPress(key);
        
    }
}

classList["ComponentObjectInHand"] = ComponentObjectInHand;