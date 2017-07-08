// Minesweeper by PalmPTSJ

class Minesweeper_ComponentCell extends Component {
    constructor(name) {
        super(name);
        this.boardId = null;
        this.state = "?"; // ? = Unknown , F = Flag , 0-8 = Opened , X = Mine
        this.isMine = false;
        this.cellPos = {x:0,y:0};
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            boardId : this.boardId,
            state : this.state,
            isMine : this.isMine,
            cellPos : Object.assign({},this.cellPos)
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.boardId !== undefined) this.boardId = data.boardId;
        if(data.state !== undefined) this.state = data.state;
        if(data.isMine !== undefined) this.isMine = data.isMine;
        if(data.cellPos !== undefined) this.cellPos = {x : data.cellPos.x, y : data.cellPos.y};
        
        return this;
    }
    
    setBoard(boardId) {
        this.boardId = boardId;
    }
    
    setCellPos(cellPos) {
        if(cellPos.x !== undefined) this.cellPos.x = cellPos.x;
        if(cellPos.y !== undefined) this.cellPos.y = cellPos.y;
    }
    
    onDestroy() {
        
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;

        return true;
    }
    
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        
        return true;
    }
    
    RPC_open(params) { // [Server]
        if(!isServer) return;
        let board = getObjectFromId(this.boardId);
        board.getEnabledComponent(Minesweeper_ComponentBoard).cellOpen(this.cellPos);
    }
    
    RPC_flag(params) { // [Server]
        if(!isServer) return;
        let board = getObjectFromId(this.boardId);
        board.getEnabledComponent(Minesweeper_ComponentBoard).cellFlag(this.cellPos);
    }
    
    onKeyPress(key) {
        super.onKeyPress(key);
        
        if(key == 'o'.charCodeAt(0)) { // (O) = Open
            this.callRPC('RPC_open',{});
        }
        if(key == 'p'.charCodeAt(0)) { // (P) = Put Flag
            this.callRPC('RPC_flag',{});
        }
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);
        
        builder.addTextField("Board ID",builder.autoEvent({ get:()=>{return this.boardId}, set:(val)=>{this.boardId = val} }));
        
        builder.addTextField("State",builder.autoEvent({ get:()=>{return this.state}, set:(val)=>{this.state = val} }));
        builder.addTextField("isMine",builder.autoEvent({ get:()=>{return this.isMine?1:0}, set:(val)=>{this.isMine = (val==1?true:false)} }));
    }  
}

classList["Minesweeper_ComponentCell"] = Minesweeper_ComponentCell;