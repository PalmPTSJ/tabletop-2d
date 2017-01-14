class Base {
    constructor () {
        this.id = -1;
    }
    toJSON() {
        return {
            className:this.constructor.name
        };
    }
    fromJSON(data) {
        return this;
    }
}

class EmptyPrefab extends Base {
    constructor (name) {
        super();
        this.components = [];
        this.name = name;
        this.componentIdGenerator = 0;
    }
    toJSON() {
        // compress this prefab into object
        var obj = Object.assign(super.toJSON(),{
            name : this.name,
            id : this.id,
            componentIdGenerator : this.componentIdGenerator,
            components : []
        });
        for(var comp of this.components) {
            obj.components.push(comp.toJSON());
        }
        return obj;
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.name = data.name;
        this.id = data.id;
        for(var comp of data.components) {
            var updated = false;
            for(var myComp of this.components) {
                if(myComp.id == comp.id) {
                    // update
                    myComp.fromJSON(comp);
                    updated = true;
                    break;
                }
            }
            if(!updated) {
                // create new component
                var newComp = new (classList[comp.className])();
                newComp.fromJSON(comp);
                this.addComponent(newComp);
                newComp.id = comp.id;
            }
        }
        this.componentIdGenerator = data.componentIdGenerator;
        return this;
    }
    
    getComponent(clazz) {
        for(var comp of this.components) {
            if(comp instanceof clazz) return comp;
        }
        return undefined;
    }
    getComponents(clazz) {
        var toRet = [];
        for(var comp of this.components) {
            if(comp instanceof clazz) toRet.push(comp);
        }
        return toRet;
    }
    addComponent(comp) {
        if(!comp.id || comp.id == -1) comp.id = this.componentIdGenerator++;
        this.components.push(comp);
    }
    deleteComponent(comp) {
        if(this.components.indexOf(comp) != -1) this.components.splice(this.components.indexOf(comp),1);
    }
    
    instantiate() {
        var object = new GameObject();
        for(var name in this.components) {
            var comp = this.components[name];
            // clone component
            var newComp = new (comp.constructor)();
            newComp.fromJSON(comp);
            object.addComponent(newComp);
        }
        return object;
    }
}

class Prefab extends EmptyPrefab {
    constructor (name) {
        super(name);
        // default for this application, attach transform and network to everything
        this.addComponent(new ComponentTransform());
        this.addComponent(new ComponentNetwork());
        this.addComponent(new ComponentTabletopObject());
    }
}

class GameObject extends EmptyPrefab {
    constructor() {
        super("");
    }
    update(timestamp) {
        for(var comp of this.components) {
            comp.onUpdate(timestamp);
        }
    }
    
    addComponent(comp) {
        super.addComponent(comp);
        comp.gameObject = this;
    }
    
    onKeyPress(keycode) {
        for(var comp of this.components) {
            if(comp.onKeyPress) comp.onKeyPress(keycode);
        }
    }
}