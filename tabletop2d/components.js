class Component extends Base {
    constructor(name) {
        super();
        this.componentName = name;
    }
    onStart() {
        
    }
    onKeyPress(key) {
        
    }
    onUpdate(timestamp) {
        
    }
}

class ComponentBoardGameController extends Component {
    constructor(name) {
        super("boardGameController");
    }
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 46) {
            // delete
            socket.emit("deleteObject",this.gameObject.id);
        }
    }
}

class ComponentTransform extends Component {
    constructor() {
        super("transform");
        this.parent = null;
        this.pos = {x:0,y:0,z:0};
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            pos : this.pos,
            parentId : this.parent==null?null:this.parent.getGameObject().id
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.pos = data.pos;
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
        this.width = 0;
        this.height = 0;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            width : this.width,
            height : this.height
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.width = data.width;
        this.height = data.height;
        return this;
    }
    isOver(cursorPos) {
        // check hit with point
        var pos = this.gameObject.getComponent("transform").getAbsolutePos();
        if( pos.x <= cursorPos.x && cursorPos.x <= pos.x + this.width &&
            pos.y <= cursorPos.y && cursorPos.y <= pos.y + this.height) {
            return true;
        }
        return false;
    }
    onUpdate(timestamp) {
        super.onUpdate(timestamp);
        if(selectingObject.has(this.gameObject)) {
            // draw outline
            var pos = this.gameObject.getComponent("transform").getAbsolutePos();
            ctx.strokeStyle = "#8CF";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(pos.x,pos.y,this.width,this.height);
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
        if(this.lastTimestamp == null || timestamp-this.lastTimestamp >= 50) { // update every 50 ms
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
            width : this.width,
            height : this.height
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.url = data.url;
        this.width = data.width;
        this.height = data.height;
        
        this.img = new Image;
        if(this.url) this.img.src = this.url;
        
        return this;
    }
    
    onUpdate(timestamp) {
        super.onUpdate(timestamp);
        // draw this object !
        if(!this.gameObject.getComponent("transform")) {
            console.log("[ImageRenderer] can't find transform");
            return;
        }
        if(!this.img) {
            console.log("[ImageRenderer] can't load image");
            return;
        }
        var transform = this.gameObject.getComponent("transform");
        var pos = transform.getAbsolutePos();
        ctx.drawImage(this.img,pos.x,pos.y,this.width,this.height);
    }
}

class ComponentRectRenderer extends Component { // Render rectangle
    constructor() {
        super("rectRenderer");
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            width : this.width,
            height : this.height,
            color : this.color
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.width = data.width;
        this.height = data.height;
        this.color = data.color;
        return this;
    }
    
    onUpdate(timestamp) {
        super.onUpdate(timestamp);
        // draw this object !
        if(!this.gameObject.getComponent("transform")) {
            console.log("[RectRenderer] can't find transform");
            return;
        }
        var transform = this.gameObject.getComponent("transform");
        var pos = transform.getAbsolutePos();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(pos.x,pos.y,this.width,this.height);
        ctx.fill();
    }
}