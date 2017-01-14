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

classList["ComponentCursorCollider"] = ComponentCursorCollider;