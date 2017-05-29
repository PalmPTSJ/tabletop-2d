class ComponentCursorCollider extends Component { // This component allow cursor to click this object
    constructor() {
        super("cursorCollider");
    }
    isOver(cursorPos) {
        // check hit with point
        var transform = this.gameObject.getComponent(ComponentTransform);
        var pos = transform.getAbsolutePos();
        // rotate point back
        var dx = cursorPos.x - pos.x;
        var dy = cursorPos.y - pos.y;
        
        var newDx = Math.cos(transform.rotation * Math.PI / 180)*dx + Math.sin(transform.rotation * Math.PI / 180)*dy;
        var newDy = - Math.sin(transform.rotation * Math.PI / 180)*dx + Math.cos(transform.rotation * Math.PI / 180)*dy;
        
        /*if( pos.x <= cursorPos.x && cursorPos.x <= pos.x + transform.size.width &&
            pos.y <= cursorPos.y && cursorPos.y <= pos.y + transform.size.height) {
            return true;
        }*/
        if(newDx >= 0 && newDx <= transform.size.width && newDy >= 0 && newDy <= transform.size.height) return true;
        return false;
    }
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        if(selectingObject.has(this.gameObject)) {
            // draw outline
            var transform = this.gameObject.getComponent(ComponentTransform);
            ctx.save();
            transform.setupCanvas();
            ctx.strokeStyle = "#8CF";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(0,0,transform.size.width,transform.size.height);
            ctx.stroke();
            ctx.restore();
        }
        return true;
    }
}

classList["ComponentCursorCollider"] = ComponentCursorCollider;