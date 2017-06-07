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
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        // remove invalid id
        let newStackListId = [];
        for(let id of this.stackListId) {
            if(getObjectFromId(id) !== undefined) newStackListId.push(id);
        }
        this.stackListId = newStackListId;
        
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
            else { // move top of stack to here
                obj.getComponent(ComponentTransform).pos = {
                    x : transform.pos.x,
                    y : transform.pos.y,
                    z : transform.pos.z-1
                }
                obj.getComponent(ComponentTransform).rotation = transform.rotation;
                obj.getComponent(ComponentTransform).size = transform.size;
            }
        }
        
        ctx.save();
        transform.setupCanvas();
        
        ctx.strokeStyle = "#0F0";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(0,0,transform.size.width,transform.size.height);
        ctx.stroke();
        
        ctx.fillStyle = "#000";
        ctx.fillText("Stack : "+this.stackListId.length,0,-10);
        
        ctx.restore();
        
    }
    
    addToStack(obj) {
        // put object under stack
        let transform = this.gameObject.getComponent(ComponentTransform);
        this.stackListId.push(obj.id);
    }
    
    shuffle() {
        for (let i = this.stackListId.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [this.stackListId[i - 1], this.stackListId[j]] = [this.stackListId[j], this.stackListId[i - 1]];
        }
    }
    
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 'd'.charCodeAt(0)) { // (D) = Draw , Slice object 0 out of stack 
            if(this.stackListId.length > 0) {
                // Put that object beside of the stack
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
            }
        }
        if(key == 's'.charCodeAt(0)) { // (S) = Stack , Stack every selecting object
            for(let obj of selectingObject) {
                if(obj == this.gameObject) continue;
                this.addToStack(obj);
            }
            selectingObject.clear();
        }
    }
}

classList["ComponentObjectStack"] = ComponentObjectStack;