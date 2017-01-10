class Base {
    constructor () {
        this.id = null;
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

class Prefab extends Base {
    constructor (name) {
        super();
        this.components = {};
        this.name = name;
        // default for this application, attach transform and network to everything
        this.addComponent(new ComponentTransform());
        this.addComponent(new ComponentNetwork());
        this.addComponent(new ComponentBoardGameController());
    }
    getComponent(name) {
        return this.components[name];
    }
    addComponent(comp) {
        this.components[comp.componentName] = comp;
    }
    toJSON() {
        // compress this prefab into object
        var obj = Object.assign(super.toJSON(),{
            name : this.name,
            id : this.id,
            components : []
        });
        for(var compName in this.components) {
            obj.components.push(this.components[compName].toJSON());
        }
        return obj;
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.name = data.name;
        this.id = data.id;
        for(var comp of data.components) {
            var newComp = new (classList[comp.className])();
            newComp.fromJSON(comp);
            this.addComponent(newComp);
        }
        return this;
    }
    instantiate() {
        var object = new GameObject();
        for(var name in this.components) {
            var comp = this.components[name];
            // clone component
            var newComp = new (comp.constructor)();
            newComp.fromJSON(comp);
            newComp.gameObject = object;
            object.addComponent(newComp);
        }
        return object;
    }
}

class GameObject extends Base {
    constructor() {
        super();
        this.name = "";
        this.components = {};
    }
    update(timestamp) {
        for(var name in this.components) {
            this.components[name].onUpdate(timestamp);
        }
    }
    toJSON() {
        // compress this gameObject
        var obj = Object.assign(super.toJSON(),{
            name : this.name,
            id : this.id,
            components : []
        });
        for(var compName in this.components) {
            obj.components.push(this.components[compName].toJSON());
        }
        return obj;
    }
    fromJSON(data) {
        super.fromJSON(data);
        // uncompress prefab data
        this.name = data.name;
        this.id = data.id;
        for(var comp of data.components) {
            if(this.getComponent(comp.componentName)) {
                // exists !
                this.getComponent(comp.componentName).fromJSON(comp);
            }
            else {
                var newComp = new classList[comp.className]();
                newComp.fromJSON(comp);
                newComp.gameObject = this;
                this.addComponent(newComp);
            }
        }
        return this;
    }
    
    getComponent(name) {
        return this.components[name];
    }
    addComponent(comp) {
        this.components[comp.componentName] = comp;
        comp.onStart();
    }
}