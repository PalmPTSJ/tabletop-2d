class Client_KeyboardInput extends Component {
    constructor(name) {
        super();
        this.canvas = null;
        this.ctx = null;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            canvas : this.canvas,
            ctx : this.ctx
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.canvas !== undefined) this.canvas = data.canvas;
        if(data.ctx !== undefined) this.ctx = data.ctx; 
        return this;
    }
    onStart() {
        
    }
    onDestroy() {
        
    }

}

canvas.addEventListener("keydown",function (e) {
    e = e || window.event; 
    var charCode = e.charCode || e.keyCode;
    isKeyDown[charCode] = true;
});
canvas.addEventListener("keyup",function (e) {
    e = e || window.event; 
    var charCode = e.charCode || e.keyCode;
    isKeyDown[charCode] = false;
});
canvas.addEventListener("keypress",function (e) {
    e = e || window.event; 
    var charCode = e.charCode || e.keyCode;
    for(var obj of selectingObject) {
        obj.onKeyPress(charCode);
    }
});

classList["Client_KeyboardInput"] = Client_KeyboardInput;

