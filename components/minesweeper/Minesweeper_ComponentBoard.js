// Minesweeper by PalmPTSJ

class Minesweeper_ComponentBoard extends Component {
    constructor(name) {
        super(name);
        this.gameState = "Idle"; // Idle , First (Started, no mine for first click) , Playing , Lose , Win
        this.boardSize = {width : 16,height : 16};
        this.mineCount = 40;
        this.cellIdList = [[]];
        
        this.flagCount = 0;
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            gameState : this.gameState,
            boardSize : Object.assign({},this.boardSize),
            mineCount : this.mineCount,
            cellIdList : this.cellIdList,
            flagCount : this.flagCount
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.gameState !== undefined) this.gameState = data.gameState;
        if(data.boardSize !== undefined) this.boardSize = {width : data.boardSize.width , height : data.boardSize.height};
        if(data.mineCount !== undefined) this.mineCount = data.mineCount;
        if(data.cellIdList !== undefined) this.cellIdList = data.cellIdList;
        if(data.flagCount !== undefined) this.flagCount = data.flagCount;
        
        return this;
    }
    
    onDestroy() {
        if(isServer) {
            for(let row of this.cellIdList) {
                for(let id of row) {
                    server_deleteObject(id);
                }
            }
        }
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        let transform = this.gameObject.getEnabledComponent(ComponentTransform);

        // draw rect outline
        ctx.save();
        transform.setupCanvas();
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#AA9922";
        
        ctx.fillRect(0,0,transform.size.width,transform.size.height); 
        
        ctx.font = "32px Arial";
        ctx.fillText(this.gameState + " | (Flag/Mine) : "+this.flagCount+"/"+this.mineCount,0,-10);
        
        ctx.restore();
        
        return true;
        
    }
    
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        
        return true;
    }
    
    RPC_start(params) {
        if(!isServer) return;
        // remove old cell
        for(let row of this.cellIdList) {
            for(let id of row) {
                server_deleteObject(id);
            }
        }
        this.cellIdList = [];
        // create new cell
        let transform = this.gameObject.getEnabledComponent(ComponentTransform);
        for(let i = 0;i < this.boardSize.height;i++) {
            this.cellIdList.push([]);
            for(let j = 0;j < this.boardSize.width;j++) {
                let obj = Minesweeper_ComponentBoard.CellPrefab.instantiate();
                let objTransform = obj.getEnabledComponent(ComponentTransform);
                objTransform.size = {
                    width : (transform.size.width - 30) / this.boardSize.width - 3 , 
                    height : (transform.size.height - 30) / this.boardSize.height - 3
                };
                objTransform.setPos({
                    x : transform.pos.x + j*(objTransform.size.width+3) + 15,
                    y : transform.pos.y + i*(objTransform.size.height+3) + 15,
                    z : transform.pos.z + 1
                });
                
                obj.getEnabledComponent(Minesweeper_ComponentCell).setBoard(this.gameObject.id);
                obj.getEnabledComponent(Minesweeper_ComponentCell).setCellPos({x:j, y:i});
                this.cellIdList[i].push(server_createObject(obj.toJSON()));
            }
        }
        this.gameState = "First";
        this.flagCount = 0;
    }
    
    cellOpen(cellPos) { // [Server]
        if(!isServer) return;
        let cell = getObjectFromId(this.cellIdList[cellPos.y][cellPos.x]).getEnabledComponent(Minesweeper_ComponentCell);
        if(cell.state != '?') return;
        if(this.gameState == "Idle" || this.gameState == "Lose" || this.gameState == "Win") return;
        
        if(this.gameState == "First") {
            // generate mine
            let candidate = [];
            for(let x = 0;x < this.boardSize.width;x++) {
                for(let y = 0;y < this.boardSize.height;y++) {
                    if(Math.abs(x - cellPos.x) <= 1 && Math.abs(y - cellPos.y) <= 1) continue; // no mine in 3x3 range around first click
                    candidate.push({x:x,y:y});
                }
            }
            for(let i = 0;i < this.mineCount;i++) {
                if(candidate.length == 0) break;
                // randomly choose from candidate
                let idx = Math.floor(Math.random()*candidate.length);
                // set mine there
                let target = candidate[idx];
                candidate.splice(idx,1);
                getObjectFromId(this.cellIdList[target.y][target.x]).getEnabledComponent(Minesweeper_ComponentCell).isMine = true;
            }
            this.gameState = "Playing";
        }
        // open cell
        
        if(cell.isMine) {
            cell.state = 'X';
            this.gameState = "Lose";
            this.showGameLose();
        }
        else {
            // count cell around
            let mineAround = 0;
            for(let dx = -1;dx <= 1;dx++) {
                for(let dy = -1;dy <= 1;dy++) {
                    if(dx == 0 && dy == 0) continue;
                    if(cellPos.x + dx < 0 || cellPos.x + dx >= this.boardSize.width || cellPos.y + dy < 0 || cellPos.y + dy >= this.boardSize.height) continue;
                    let targetCell = getObjectFromId(this.cellIdList[cellPos.y + dy][cellPos.x + dx]).getEnabledComponent(Minesweeper_ComponentCell)
                    if(targetCell.isMine) mineAround++;
                }
            }
            cell.state = ''+mineAround;
            if(mineAround == 0) {
                // open around (4 dir)
                for(let dx = -1;dx <= 1;dx++) {
                    for(let dy = -1;dy <= 1;dy++) {
                        if(dx == 0 && dy == 0) continue;
                        if(cellPos.x + dx < 0 || cellPos.x + dx >= this.boardSize.width || cellPos.y + dy < 0 || cellPos.y + dy >= this.boardSize.height) continue;
                        this.cellOpen({
                            x : cellPos.x + dx,
                            y : cellPos.y + dy
                        });
                    }
                }
            }
        }
    }
    
    cellFlag(cellPos) { // [Server]
        if(!isServer) return;
        let cell = getObjectFromId(this.cellIdList[cellPos.y][cellPos.x]).getEnabledComponent(Minesweeper_ComponentCell);
        if(cell.state != '?' && cell.state != 'F') return;
        if(this.gameState == "Idle" || this.gameState == "First" || this.gameState == "Lose" || this.gameState == "Win") return;
        
        if(cell.state == '?') { cell.state = 'F'; this.flagCount++; }
        else if(cell.state == 'F') { cell.state = '?'; this.flagCount--; }
        
        // check all flag
        if(this.flagCount == this.mineCount) {
            this.checkWin();
        }
    }
    
    checkWin() { // [Server]
        if(!isServer) return;
        for(let y = 0;y < this.boardSize.height;y++) {
            for(let x = 0;x < this.boardSize.width;x++) {
                let cell = getObjectFromId(this.cellIdList[y][x]).getEnabledComponent(Minesweeper_ComponentCell);
                if(cell.state == '?') {
                    this.cellOpen({x:x,y:y});
                }
            }
        }
        
        if(this.gameState == "Playing") {
            // ok !
            this.gameState = "Win";
        }
    }
    
    showGameLose() { // [Server]
        if(!isServer) return;
        for(let y = 0;y < this.boardSize.height;y++) {
            for(let x = 0;x < this.boardSize.width;x++) {
                let cell = getObjectFromId(this.cellIdList[y][x]).getEnabledComponent(Minesweeper_ComponentCell);
                if(cell.isMine) {
                    cell.state = 'X';
                }
            }
        }
    }
    
    
    onKeyPress(key) {
        super.onKeyPress(key);
        
        if(key == 's'.charCodeAt(0)) { // (S) = Start / Restart
            this.callRPC('RPC_start',{});
            // deselect
            if(selectingObject.has(this.gameObject)) selectingObject.delete(this.gameObject);
        }
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);
        
        builder.addTextField("Game State",builder.autoEvent({ get:()=>{return this.gameState}, set:(val)=>{this.gameState = val} }));
        
        builder.addTextField("Board Width",builder.autoEvent({ get:()=>{return this.boardSize.width}, set:(val)=>{this.boardSize.width = parseInt(val)} }));
        builder.addTextField("Board Height",builder.autoEvent({ get:()=>{return this.boardSize.height}, set:(val)=>{this.boardSize.height = parseInt(val)} }));
        
        builder.addTextField("Mine Count",builder.autoEvent({ get:()=>{return this.mineCount}, set:(val)=>{this.mineCount = parseInt(val)} }));
    }  
}

// Static variable
if(isServer) {
    Minesweeper_ComponentBoard.CellPrefab = new Prefab("Minesweeper Cell");
    Minesweeper_ComponentBoard.CellPrefab.addComponent(new Minesweeper_ComponentCell());
    Minesweeper_ComponentBoard.CellPrefab.addComponent(new Minesweeper_ComponentCellRenderer());
    Minesweeper_ComponentBoard.CellPrefab.addComponent(new ComponentCursorCollider());
}

classList["Minesweeper_ComponentBoard"] = Minesweeper_ComponentBoard;