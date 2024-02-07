export class CellNode {
    constructor(x, y, color, el) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.el = el;
    }
}
export class Cell {
    constructor(current, previous, next) {
        this.previous = previous;
        this.current = current;
        this.next = next;
    }
}
export class Pawn {
    constructor(color, cell) {
        this.color = color;
        let pawn = document.createElement('div');
        pawn.className = 'pawn-simple';
        pawn.id = `pawn-${cell.current.x}-${cell.current.y}`;
        pawn.style.width = '100%';
        pawn.style.height = '100%';
        pawn.style.backgroundImage = `url('src/img/${this.color}-pawn.png')`;
        pawn.style.backgroundPosition = 'center';
        pawn.style.backgroundSize = 'cover';
        pawn.style.borderRadius = '50%';
        this.pawn = pawn;
        this.cell = cell;
        this.cell.current.el.appendChild(this.pawn);
    }
    setCell(cell) {
        this.pawn.remove();
        cell.current.el.appendChild(this.pawn);
        cell.previous = this.cell.previous;
        cell.next = this.cell.next;
        this.cell = cell;
    }
}
export class Board {
    constructor(whitePawns, blackPawns, rows) {
        this.whitePawns = whitePawns;
        this.blackPawns = blackPawns;
        this.rows = rows;
    }
}
export default class Game {
    constructor(whitePlayer, blackPlayer, board) {
        this.currentPlayer = whitePlayer;
        this.nextPlayer = blackPlayer;
        this.waiting = true;
        this.board = board;
    }
    start() {
        this.mainLoop();
    }
    changePlayer() {
        [this.currentPlayer, this.nextPlayer] = [this.nextPlayer, this.currentPlayer];
    }
    mainLoop() {
        if (this.board.whitePawns.length === 0 || this.board.blackPawns.length === 0) {
            this.over(this.nextPlayer.Color());
            return;
        }
        if (!this.currentPlayer.CanMove()) {
            this.over(this.nextPlayer.Color());
            return;
        }
        this.waiting = true;
        // this.currentPlayer.move()
    }
    move(pawn, to) {
    }
    over(winner) { alert(`${winner} wins!!!`); }
}
export function createBoard(id) {
    let rows = [];
    let whitePawns = [];
    let blackPawns = [];
    let boardEl = document.getElementById(id);
    if (boardEl === null)
        throw Error(`board not found in html havn't element with id ${id}`);
    boardEl.className = id;
    for (let i = 0; i < 8; i++) {
        let row = document.createElement('div');
        let rowStep = [];
        row.className = 'row';
        for (let j = 0; j < 8; j++) {
            let col = document.createElement('div');
            let className = 'col';
            let cell = new Cell(new CellNode(i, j, 'white', col));
            if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0)) {
                className += ' black';
                cell = new Cell(new CellNode(i, j, 'black', col));
                if (i < 3)
                    whitePawns.push(new Pawn('white', cell));
                else if (i > 4)
                    blackPawns.push(new Pawn('dark', cell));
            }
            col.className = className;
            rowStep.push(cell);
            row.appendChild(col);
        }
        rows.push(rowStep);
        boardEl.appendChild(row);
    }
    return [rows, whitePawns, blackPawns];
}
