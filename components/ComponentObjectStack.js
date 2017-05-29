class ComponentObjectStack extends Component {
    constructor(name) {
        super("objectStack");
        this.stackList = []; // stack object id
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            stackList : this.stackList
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.stackList !== undefined) this.player = data.stackList;

        return this;
    }
    
    update(timestamp) {
        if(!super.update(timestamp)) return false;
        
        // render top item on stack
    }
    
    addToStack(objList) {
        for(var objId in objList) {
            this.stackList.push(objId);
        }
    }
    
    shuffle() {
        
    }
    
    onKeyPress(key) {
        super.onKeyPress(key);
        
    }
}

classList["ComponentObjectInHand"] = ComponentObjectInHand;