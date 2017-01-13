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

class ComponentTabletopObject extends Component {
    constructor(name) {
        super("tabletopObject");
    }
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 46) { // delete
            socket.emit("deleteObject",this.gameObject.id);
        }
    }
}

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
        this.pos = data.pos;
        this.size = data.size;
        this.parent = data.parentId==null?null:objectList[data.parentId];
        return this;
    }
    
    getAbsolutePos() {
        if(this.parent != null) {
            let pos = this.parent.getAbsolutePos();
            return {x:pos.x+this.pos.x,y:pos.y+this.pos.y};
        }
        else return this.pos;
    }
}

class ComponentCursorCollider extends Component { // This component allow cursor to click this object
    constructor() {
        super("cursorCollider");
    }
    toJSON() {
        return super.toJSON();
    }
    fromJSON(data) {
        super.fromJSON(data);
        return this;
    }
    isOver(cursorPos) {
        // check hit with point
        var transform = this.gameObject.getComponent(ComponentTransform);
        var pos = transform.getAbsolutePos();
        if( pos.x <= cursorPos.x && cursorPos.x <= pos.x + transform.size.width &&
            pos.y <= cursorPos.y && cursorPos.y <= pos.y + transform.size.height) {
            return true;
        }
        return false;
    }
    onUpdate(timestamp) {
        super.onUpdate(timestamp);
        if(selectingObject.has(this.gameObject)) {
            // draw outline
            var transform = this.gameObject.getComponent(ComponentTransform);
            var pos = transform.getAbsolutePos();
            ctx.strokeStyle = "#8CF";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(pos.x,pos.y,transform.size.width,transform.size.height);
            ctx.stroke();
        }
    }
}

class ComponentNetwork extends Component {
    constructor() {
        super("network");
        this.lastJSON = "";
        this.lastTimestamp = null;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{});
    }
    fromJSON(data) {
        super.fromJSON(data);
        return this;
    }
    onStart() {
        this.lastJSON = JSON.stringify(this.gameObject.toJSON());
    }
    onUpdate(timestamp) {
        super.onUpdate(timestamp);
        if(this.lastTimestamp == null || timestamp-this.lastTimestamp >= 100) { // update every 50 ms
            var nowJSON = JSON.stringify(this.gameObject.toJSON());
            if(nowJSON != this.lastJSON) {
                this.lastJSON = nowJSON;
                // sync gameObject
                socket.emit('updateObject',this.gameObject.toJSON());
            }
            this.lastTimestamp = timestamp;
        }
        
    }
}

class ComponentImageRenderer extends Component { // This component render object's image
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
        // draw this object !
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

class ComponentRectRenderer extends Component { // Render rectangle
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
    
    onUpdate(timestamp) {
        super.onUpdate(timestamp);
        // draw this object !
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