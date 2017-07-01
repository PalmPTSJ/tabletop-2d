// RPG Expansion (for testing) by PalmPTSJ
// Require Component : ComponentTransformTween

class RPG_ComponentHero extends Component {
    constructor(name) {
        super(name);
        this.HP = this.maxHP = 500;
        this.attackSpeed = 1;
        this.attack = {min:30,max:50};
        this.attackRange = 100;
        this.attackTargetId = null;
        this.attackTarget = null;
        this.attackCooldown = 0;
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            HP : this.HP,
            maxHP : this.maxHP,
            attackSpeed : this.attackSpeed,
            attackRange : this.attackRange,
            attackTargetId : this.attackTargetId
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.HP !== undefined) this.HP = data.HP;
        if(data.maxHP !== undefined) this.maxHP = data.maxHP;
        if(data.attackSpeed !== undefined) this.attackSpeed = data.attackSpeed;
        if(data.attackRange !== undefined) this.attackRange = data.attackRange;
        if(data.attackTargetId !== undefined) {
            this.attackTargetId = data.attackTargetId;
            if(this.attackTargetId == null) this.attackTarget = null;
            else this.attackTarget = getObjectFromId(this.attackTargetId);
        }
        return this;
    }
    
    onDestroy() {
        
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        if(this.attackTarget != null) {
            let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
            let targetPos = this.attackTarget.getEnabledComponent(ComponentTransform).pos;
            // draw attack target line
            ctx.save();
            //transform.setupCanvas();
            
            ctx.strokeStyle = "#F00";
            ctx.globalAlpha = 0.4;
            
            ctx.beginPath();
            ctx.moveTo(myPos.x,myPos.y);
            ctx.lineTo(targetPos.x,targetPos.y);
            ctx.stroke();
            
            ctx.restore();
        }
        return true;
        
    }
    
    takeDamage(dmg) {
        if(!isServer) return;
        
        this.HP -= dmg;
        // create damage text
        let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
        let obj = RPG_ComponentHero.DamageTextPrefab.instantiate();
        obj.getEnabledComponent(ComponentTransformTween).moveSpeed = 3;
        obj.getEnabledComponent(ComponentTransformTween).setPos({
            x : myPos.x,
            y : myPos.y-10
        });
        obj.getEnabledComponent(ComponentTransformTween).setTargetPos({
            x : myPos.x,
            y : myPos.y-200
        });
        
        obj.getEnabledComponent(ComponentTextRenderer).text = ""+dmg;
        
        obj.addComponent(new ComponentAutoDestroy());
        obj.getEnabledComponent(ComponentAutoDestroy).countdown = 100;
        
        server_createObject(obj.toJSON());
        
    }
    
    RPC_setAttackTarget(params) {
        this.attackTargetId = params.id;
        if(params.id == null) this.attackTarget = null;
        else this.attackTarget = getObjectFromId(this.attackTargetId);
    }
    
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        // if attacking
        if(this.attackCooldown > 0) this.attackCooldown--;
        if(this.attackTarget != null) {
            // if close enough
            let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
            let targetPos = this.attackTarget.getEnabledComponent(ComponentTransform).pos;
            if(Math.hypot(myPos.x-targetPos.x,myPos.y-targetPos.y) <= this.attackRange) {
                this.gameObject.getEnabledComponent(ComponentTransformTween).setPos(myPos); // stop walking
                // try to attack if cooldown ok
                if(this.attackCooldown <= 0) {
                    // attack
                    let dmg = Math.floor(Math.random()*(this.attack.max-this.attack.min+1)) + this.attack.min;
                    console.log("Attack "+dmg);
                    this.attackTarget.getEnabledComponent(RPG_ComponentHero).takeDamage(dmg);
                    
                    this.attackCooldown = Math.round(120/this.attackSpeed);
                }
            }
            else {
                // walk there
                this.gameObject.getEnabledComponent(ComponentTransformTween).setTargetPos(targetPos);
            }
        }
        return true;
    }

    onKeyPress(key) {
        super.onKeyPress(key);
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);

        builder.addTextField("HP",builder.autoEvent({ get:()=>{return this.HP}, set:(val)=>{this.HP = parseInt(val)} }));
        builder.addTextField("Max HP",builder.autoEvent({ get:()=>{return this.maxHP}, set:(val)=>{this.maxHP = parseInt(val)} }));
        
        builder.addTextField("Attack Speed",builder.autoEvent({ get:()=>{return this.attackSpeed}, set:(val)=>{this.attackSpeed = parseFloat(val)} }));

        builder.addTextField("Attack Min",builder.autoEvent({ get:()=>{return this.attack.min}, set:(val)=>{this.attack.min = parseInt(val)} }));
        builder.addTextField("Attack Max",builder.autoEvent({ get:()=>{return this.attack.max}, set:(val)=>{this.attack.max = parseInt(val)} }));
    }  
}

// Static variable
if(isServer) {
    RPG_ComponentHero.DamageTextPrefab = new EmptyPrefab("Damage Text");
    RPG_ComponentHero.DamageTextPrefab.addComponent(new ComponentTransformTween());
    RPG_ComponentHero.DamageTextPrefab.addComponent(new ComponentNetwork());
    RPG_ComponentHero.DamageTextPrefab.addComponent(new ComponentTextRenderer());
}

classList["RPG_ComponentHero"] = RPG_ComponentHero;

if(!isServer) {
    // bind right click action
    $("#gameCanvas").contextmenu(function(e) {
        var clickPos = {
            x : canvasX + canvas.width/2 + ((e.pageX - $(canvas).offset().left)-canvas.width/2)/canvasScale,
            y : canvasY + canvas.height/2 + ((e.pageY - $(canvas).offset().top)-canvas.height/2)/canvasScale
        }
        let isAttackCmd = false;
        for(var i = objectList.length-1;i >= 0;i--) { // Select from high Z to low Z item
            var obj = objectList[i];
            if(selectingObject.has(obj)) continue;
            if(obj.getEnabledComponent(ComponentCursorCollider) && obj.getEnabledComponent(ComponentCursorCollider).isOver(clickPos)) {
                // attack that target
                for(var selObj of selectingObject) {
                    if(selObj.getEnabledComponent(RPG_ComponentHero) != null) {
                        selObj.getEnabledComponent(RPG_ComponentHero).callRPC('RPC_setAttackTarget',{id:obj.id});
                    }
                }
                isAttackCmd = true;
                break;
            }
        }
        if(!isAttackCmd) {
            // move command
            for(var obj of selectingObject) {
                if(obj.getEnabledComponent(RPG_ComponentHero) != null) {
                    obj.getEnabledComponent(RPG_ComponentHero).callRPC('RPC_setAttackTarget',{id:null});
                }
                if(obj.getEnabledComponent(ComponentTransformTween) != null) {
                    obj.getEnabledComponent(ComponentTransformTween).callRPC('RPC_setTargetPos',{newPos : clickPos});
                }
            }
        }
        return false;
    });
}