// Minesweeper expansion by PalmPTSJ

class Minesweeper_ComponentCellRenderer extends ComponentRenderer {
    constructor(name) {
        super(name);
        this.font = "30px Arial";
        
        if(!isServer) {
            this.flagImg = new Image;
            this.flagImg.src = "http://minesweeperonline.com/flag.png";
            
            this.mineImg = new Image;
            this.mineImg.src = "https://images-na.ssl-images-amazon.com/images/I/61M9vdL-xjL.png";
        }
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            font : this.font
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.font !== undefined) this.font = data.font;
        return this;
    }

    render() {
        if(!this.gameObject.getEnabledComponent(ComponentTransform)) {
            console.log("[Minesweeper_ComponentCellRenderer] can't find transform");
            return;
        }
        let transform = this.gameObject.getEnabledComponent(ComponentTransform);
        let cell = this.gameObject.getEnabledComponent(Minesweeper_ComponentCell);
        
        if(!this.mineImg.complete || !this.flagImg.complete) return;
        
        ctx.save();
        transform.setupCanvas();
        
        // draw background
        ctx.fillStyle = (cell.state=='?' || cell.state=='F')?"#888888":"#CCCCCC";
        ctx.beginPath();
        ctx.rect(0,0,transform.size.width,transform.size.height);
        ctx.fill();
        
        // draw outline
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(0,0,transform.size.width,transform.size.height);
        ctx.stroke();
        
        if(cell.state == '?') {}
        else if(cell.state == 'F') { // flag
            ctx.drawImage(this.flagImg,5,5,transform.size.width-10,transform.size.height-10);
        }
        else if(cell.state == 'X') { // mine
            ctx.drawImage(this.mineImg,5,5,transform.size.width-10,transform.size.height-10);
        }
        else { // number
            if(cell.state != '0') {
                ctx.textBaseline="top"; 
                ctx.fillStyle = "#000000";
                ctx.font = this.font;
                ctx.fillText(cell.state,5,5);
            }
        }
        ctx.restore();
    }
}

classList["Minesweeper_ComponentCellRenderer"] = Minesweeper_ComponentCellRenderer;