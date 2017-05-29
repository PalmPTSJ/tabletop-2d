class ComponentImageRendererMulti extends ComponentImageRenderer {
    constructor(name) {
        super("imageSwapper");
        this.faces = [];
        this.currentFaceIndex = 0;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            faces : this.faces,
            currentFaceIndex : this.currentFaceIndex
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.faces !== undefined) this.faces = data.faces;
        if(data.currentFaceIndex !== undefined) this.applyFace(data.currentFaceIndex);
        else this.applyFace(this.currentFaceIndex);
        
        return this;
    }
    onStart() {
        super.onStart();
        this.applyFace(this.currentFaceIndex);
    }
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 102) { // (F) : Swap face
            if(this.faces.length) {
                this.applyFace((this.currentFaceIndex+1) % this.faces.length);
            }
        }
    }
    
    applyFace(i) {
        this.currentFaceIndex = i;
        this.applyImage(this.faces[this.currentFaceIndex]);
    }
}

classList["ComponentImageRendererMulti"] = ComponentImageRendererMulti;