class ComponentTransform extends Component {
    constructor() {
        super("transform");
        this.parent = null;
        this.pos = {x:0,y:0,z:0};
        this.size = {width:0,height:0};
        this.rotation = 0; // CW
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            pos         : this.pos,
            size        : this.size,
            parentId    : this.parent==null?null:this.parent.getGameObject().id,
            rotation    : this.rotation
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.pos !== undefined) {
            if(data.pos.z != this.pos.z) { // force re-sort object
                sortObjectList();
            }
            this.pos = data.pos;
        }
        if(data.size !== undefined) this.size = data.size;
        this.parent = data.parentId==null?null:objectList[data.parentId];
        if(data.rotation !== undefined) this.rotation = data.rotation;
        return this;
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        return true;
    }
    
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 'q'.charCodeAt(0)) { // (Q) = Rotate 15 CCW
            this.rotation -= 15;
        }
        if(key == 'e'.charCodeAt(0)) { // (E) = Rotate 15 CW
            this.rotation += 15;
        }
        if(this.rotation < 0) this.rotation += 360;
        if(this.rotation >= 360) this.rotation -= 360;
    }
    
    getAbsolutePos() {
        if(this.parent != null) {
            let pos = this.parent.getAbsolutePos();
            return {x:pos.x+this.pos.x,y:pos.y+this.pos.y,z:pos.z + this.pos.z};
        }
        else return this.pos;
    }
    
    setupCanvas() { // set canvas to match this (position , rotation)
        if(this.parent != null) this.parent.getComponent(ComponentTransform).setupCanvas(); // setup from parent first
        ctx.translate(this.pos.x,this.pos.y);
        ctx.rotate(this.rotation*Math.PI/180);
    }
}

classList["ComponentTransform"] = ComponentTransform;