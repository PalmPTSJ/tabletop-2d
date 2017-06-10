class ComponentObjectStack extends Component {
    constructor(name) {
        super("objectStack");
        this.stackListId = []; // stack object id (0 = top)
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            stackListId : this.stackListId
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.stackListId !== undefined) {
            this.stackListId = data.stackListId;
        }
        
        return this;
    }
    
    RPC_breakStack(params) {
        // break into square
        let colCount = Math.ceil(Math.sqrt(this.stackListId.length));
        console.log("Break stack into "+colCount);
        let i = 0;
        let transform = this.gameObject.getComponent(ComponentTransform);
        for(let id of this.stackListId) {
            let obj = getObjectFromId(id);
            if(obj.getComponent(ComponentTransform)) {
                obj.getComponent(ComponentTransform).pos = {
                    x : transform.pos.x + (transform.size.width+10)*((i%colCount) + 1),
                    y : transform.pos.y + (transform.size.height+10)*(Math.floor(i/colCount)),
                    z : transform.pos.z
                }
                obj.getComponent(ComponentTransform).rotation = transform.rotation;
                obj.getComponent(ComponentTransform).size = transform.size;
            }
            i++;
        }
        this.stackListId = [];
    }
    
    onDestroy() {
        if(isServer) {
            this.RPC_breakStack();
        }
    }
    
    updateTopOfStack() {
        if(this.stackListId.length > 0) {
            let transform = this.gameObject.getComponent(ComponentTransform);
            let obj = getObjectFromId(this.stackListId[0]);
            if(obj.getComponent(ComponentTransform)) {
                obj.getComponent(ComponentTransform).pos = {
                    x : transform.pos.x,
                    y : transform.pos.y,
                    z : transform.pos.z-1
                }
                obj.getComponent(ComponentTransform).rotation = transform.rotation;
                obj.getComponent(ComponentTransform).size = transform.size;
            
            }
        }
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        // remove invalid id
        let newStackListId = [];
        for(let id of this.stackListId) {
            if(getObjectFromId(id) !== undefined) newStackListId.push(id);
        }
        this.stackListId = newStackListId;
        //this.updateTopOfStack();
        
        let transform = this.gameObject.getComponent(ComponentTransform);
        
        for(let id of this.stackListId) {
            let obj = getObjectFromId(id);
            if(obj.getComponent(ComponentCursorCollider) !== undefined) {
                obj.getComponent(ComponentCursorCollider).disableForThisFrame(timestamp);
            }
            if(id != this.stackListId[0]) { // disable renderer of item below top stack
                obj.getComponents(ComponentRenderer).forEach((renderer)=>{
                    renderer.disableForThisFrame(timestamp);
                });
            }
        }
        
        ctx.save();
        transform.setupCanvas();
        
        ctx.fillStyle = "#0F0";
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0,0,transform.size.width,transform.size.height);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = "#000";
        ctx.fillText("Stack : "+this.stackListId.length,0,-10);
        
        ctx.restore();
        
    }
    
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        this.updateTopOfStack();
        return true;
    }
    
    addToStack(obj) {
        // put object on top of stack
        console.log("Add to stack "+obj.id);
        obj.getComponent
        this.stackListId.splice(0,0,obj.id);
    }
    
    shuffle() {
        for (let i = this.stackListId.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            var tmp = this.stackListId[j];
            this.stackListId[j] = this.stackListId[i - 1];
            this.stackListId[i - 1] = tmp;
        }
    }
    
    onObjectDrop(objectList) {
        console.log("Object drop on stack");
        for(let obj of objectList) {
            this.addToStack(obj);
        }
    }
    
    RPC_draw(params) {
        if(this.stackListId.length == 0) return;
        let obj = getObjectFromId(this.stackListId[0]);
        let transform = this.gameObject.getComponent(ComponentTransform);
        if(obj.getComponent(ComponentTransform)) {
            obj.getComponent(ComponentTransform).pos = {
                x : transform.pos.x+transform.size.width+10,
                y : transform.pos.y,
                z : transform.pos.z+1
            }
        }
        this.stackListId.splice(0, 1);
        this.updateTopOfStack();
    }
    
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 'd'.charCodeAt(0)) { // (D) = Draw , Slice object 0 out of stack 
            this.callRPC('RPC_draw',{});
        }
        if(key == 'b'.charCodeAt(0)) { // (B) = Break deck
            this.callRPC('RPC_breakStack',{});
        }
        if(key == 's'.charCodeAt(0)) { // (S) = Shuffle
            this.shuffle();
            log("Stack shuffled")
        }
    }
}

classList["ComponentObjectStack"] = ComponentObjectStack;