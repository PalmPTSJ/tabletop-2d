class ComponentTransform extends Component {
    constructor() {
        super("transform");
        this.parent = null;
        this.pos = {x:0,y:0,z:0};
        this.size = {width:0,height:0};
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            pos         : this.pos,
            size        : this.size,
            parentId    : this.parent==null?null:this.parent.getGameObject().id
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.pos) this.pos = data.pos;
        this.size = data.size;
        this.parent = data.parentId==null?null:objectList[data.parentId];
        return this;
    }
    
    getAbsolutePos() {
        if(this.parent != null) {
            let pos = this.parent.getAbsolutePos();
            return {x:pos.x+this.pos.x,y:pos.y+this.pos.y,z:pos.z + this.pos.z};
        }
        else return this.pos;
    }
}

classList["ComponentTransform"] = ComponentTransform;