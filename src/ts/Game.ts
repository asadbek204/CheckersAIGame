import Player, {PlayerStates} from "./Player.js"

export enum Color {
    black = 'black',
    white = 'white'
}

class CellNode {
    x: number
    y: number
    color: string
    el: HTMLDivElement

    constructor(x: number, y: number, color: string, el: HTMLDivElement) {
        this.x = x
        this.y = y
        this.color = color
        this.el = el
    }
}

export class Cell {
    previous?: CellNode
    current: CellNode
    next?: CellNode
    
    constructor(current: CellNode, previous?: CellNode, next?: CellNode) {
        this.previous = previous
        this.current = current
        this.next = next
    }
}

export class Pawn {
    color: string
    pawn: HTMLDivElement
    cell: Cell

    constructor(color: string, cell: Cell) {
        this.color = color
        let pawn = document.createElement('div')
        pawn.className = 'pawn-simple'
        pawn.id = `pawn-${cell.current.x}-${cell.current.y}`
        pawn.style.width = '100%'
        pawn.style.height = '100%'
        pawn.style.backgroundImage = `url('src/img/${this.color}-pawn.png')`
        pawn.style.backgroundPosition = 'center'
        pawn.style.backgroundSize = 'cover'
        pawn.style.borderRadius = '50%'
        this.pawn = pawn
        this.cell = cell
        this.cell.current.el.appendChild(this.pawn)
    }

    setCell(cell: Cell) {
        this.pawn.remove()
        cell.current.el.appendChild(this.pawn)
        cell.previous = this.cell.previous
        cell.next = this.cell.next
        this.cell = cell
    }
}
class Board {
    whitePawns: Pawn[]
    blackPawns: Pawn[]
    rows: Cell[][]

    constructor(whitePawns: Pawn[], blackPawns: Pawn[], rows: Cell[][]) {
        this.whitePawns = whitePawns
        this.blackPawns = blackPawns
        this.rows = rows
    }
}

type GameParams = {
    board: string
    Player1?: Player 
    Player2?: Player
}

export default class Game {
    currentPlayer: Player
    nextPlayer: Player
    waiting: boolean
    board: Board

    constructor({board, Player1, Player2}: GameParams) {
        if (Player1.Color() === Player2.Color())
            throw Error(`you cann't declare to ${Player1.Color()} players`)
        this.currentPlayer = Player1
        this.nextPlayer = Player2
        if (Player1.Color() === 'black')
            [this.currentPlayer, this.nextPlayer] = [this.nextPlayer, this.currentPlayer]
        this.waiting = true
        this.board = this.createBoard(board)
    }

    start() {
        this.mainLoop()
    }

    changePlayer() {
        [this.currentPlayer, this.nextPlayer] = [this.nextPlayer, this.currentPlayer]
    }

    mainLoop() {
        if (this.board.whitePawns.length === 0 || this.board.blackPawns.length === 0) {
            this.over(this.nextPlayer.Color())
            return
        }
        if (!this.currentPlayer.CanMove()){
            this.over(this.nextPlayer.Color())
            return
        }
        this.waiting = true
        // this.currentPlayer.move()
    }

    move(pawn: Pawn, to: Cell) {
    }

    over(winner: string) {alert(`${winner} wins!!!`)}

    createBoard(id: string): Board {
        let rows: Cell[][] = []
        let whitePawns: Pawn[] = []
        let blackPawns: Pawn[] = []
        let boardEl = document.getElementById(id)
        if (boardEl === null)
            throw Error(`board not found in html havn't element with id ${id}`)
        boardEl.className = id
        for (let i = 0; i < 8; i++) {
            let row = document.createElement('div')
            let rowStep: Cell[] = []
            row.className = 'row'
            for (let j = 0; j < 8; j++) {
                let col = document.createElement('div')
                let className = 'col'
                let cell: Cell = new Cell(new CellNode(i, j, 'white', col))
                if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0 )){
                    className += ' black'
                    cell = new Cell(new CellNode(i, j, 'black', col))
                    if (i < 3)
                        whitePawns.push(new Pawn('white', cell))
                    else if (i > 4)
                        blackPawns.push(new Pawn('dark', cell))
                }
                col.className = className
                rowStep.push(cell)
                row.appendChild(col)
            }
            rows.push(rowStep)
            boardEl.appendChild(row)
        }
        return new Board(whitePawns, blackPawns, rows)
    }
}

export {}