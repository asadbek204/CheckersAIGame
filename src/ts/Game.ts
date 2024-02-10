import Player from "./Player.js"

export type Mover = (fromTo: CellList, selected: Pawn) => void
type showMessage = (message: string, color: Color | 'red') => void

export enum Color {
    black = 'black',
    white = 'white'
}

type parsedCellAttrs = {
    x: number
    y: number
    color: string
    el: HTMLDivElement
    showMessage: showMessage
}

export class CellNode {
    previous?: CellNode
    next?: CellNode
    x: number
    y: number
    color: string
    el: HTMLDivElement
    readonly showMessage: showMessage
    private eventHandler: (e: MouseEvent) => void | undefined
    
    constructor(cell: parsedCellAttrs) {
        this.x = cell.x
        this.y = cell.y
        this.color = cell.color
        this.el = cell.el
        this.showMessage = cell.showMessage
    }
    
    existsEl(): boolean {
        return this.el.childElementCount === 1
    }
    
    onclick(callback: (position: CellNode) => void) {
        this.eventHandler = () => {
            try {
                callback(this)
            }
            catch (e) {
                this.showMessage(e, "red")
            }
        }
        this.el.onclick = this.eventHandler
    }
    
    removeOnclick() {
        if (!this.eventHandler) return
        this.el.removeEventListener('click',  this.eventHandler)
        this.eventHandler = undefined
    }
    
    toString(): string {
        return `{[${this.x}, ${this.y}]<${this.color}>}`
    }
}

export class CellList {
    current: CellNode
    private lastNode: CellNode
    
    constructor(current: CellNode) {
        this.current = current
        this.lastNode = this.current
    }
    
    add(newNode: CellNode): void {
        let last = this.last()
        last.next = newNode
        newNode.previous = last
        this.lastNode = newNode
    }
    
    last(): CellNode {
        if (!this.lastNode.next) return this.lastNode
        let cur = this.lastNode
        while (cur.next !== undefined) {
            cur = cur.next
        }
        return cur
    }
    
    length(): number {
        let i = 1
        let cur = this.current
        while (cur.next) {
            cur = cur.next
            i++
        }
        return i
    }
    
    toString(): string {
        let result = '[ '
        let cur = this.current
        while (cur.next !== undefined) {
            result += `{${cur}}, `
            cur = cur.next
        }
        return result + "\b\b ]"
    }
}

export class Pawn {
    color: Color
    pawn: HTMLDivElement
    cell: CellNode
    private eventHandler: (e: MouseEvent) => void | undefined
    private queen: boolean = false
    readonly showMessage: showMessage
    private readonly queenRow: number
    
    constructor(color: Color, cell: CellNode, showMessage: showMessage) {
        this.color = color
        this.cell = cell
        this.pawn = this.createPawn()
        this.cell.el.appendChild(this.pawn)
        this.queenRow = (color === Color.white) ? 8 : 1
        this.showMessage = showMessage
    }
    
    private createPawn() {
        let pawn = document.createElement('div')
        pawn.className = 'pawn simple'
        pawn.id = `pawn-${this.cell.x}-${this.cell.y}`
        pawn.style.color = this.color
        pawn.style.width = '100%'
        pawn.style.height = '100%'
        pawn.style.backgroundImage = `url('src/img/${this.color}-pawn.png')`
        pawn.style.backgroundPosition = 'center'
        pawn.style.backgroundSize = 'cover'
        pawn.style.borderRadius = '50%'
        return pawn
    }
    
    toString(): string {
        return `{${this.color} - ${this.cell} - ${this.pawn.classList[1]}}`
    }
    
    private makeQueen() {
        if (this.queen) return
        this.queen = true
        this.pawn.classList.replace('simple', 'queen')
        this.pawn.style.backgroundImage = `url('src/img/${this.color}-queen.png')`
    }
    
    isQueen() {
        return this.queen
    }

    setCell(cell: CellNode) {
        this.pawn.remove()
        cell.el.appendChild(this.pawn)
        this.cell = cell
        if (cell.y !== this.queenRow) return
        this.makeQueen()
    }
    
    onclick(callback: (pawn: Pawn) => void) {
        this.eventHandler = () => {
            try {
                callback(this)
            }
            catch (e) {
                this.showMessage(e, 'red')
            }
        }
        this.pawn.onclick = this.eventHandler
    }
    
    removeOnclick() {
        if (!this.eventHandler) return
        this.pawn.removeEventListener('click',  this.eventHandler)
        this.eventHandler = undefined
    }
}

class Board {
    whitePawns: Pawn[]
    blackPawns: Pawn[]
    rows: CellNode[][]

    constructor(whitePawns: Pawn[], blackPawns: Pawn[], rows: CellNode[][]) {
        this.whitePawns = whitePawns
        this.blackPawns = blackPawns
        this.rows = rows
    }
}

export type board = Board

type GameParams = {
    board: HTMLDivElement
    messageBox: HTMLDivElement
    Player1?: Player
    Player2?: Player
}

export default class Game {
    private currentPlayer: Player = new Player(Color.white)
    private nextPlayer: Player = new Player(Color.black)
    private board?: Board
    private readonly boardEl: HTMLDivElement
    private messageBox: HTMLDivElement
    private readonly gameOverCallback: (color: Color) => void

    constructor({board, messageBox, Player1, Player2}: GameParams, gameOverCallback: (color: Color) => void) {
        if (Player1 !== undefined && Player2 !== undefined) {
            if (Player1.color === Player2.color) throw new Error(`you can't declare to ${Player1.color} players`)
            this.currentPlayer = Player1
            this.nextPlayer = Player2
        }
        this.gameOverCallback = gameOverCallback
        this.boardEl = board
        this.messageBox = messageBox
    }
    
    private select(pawnList: Pawn[], toDisable: Pawn[]) {
        pawnList.forEach(e => {e.pawn.style.opacity = '100%'})
        toDisable.forEach(e => {e.pawn.style.opacity = '80%'})
    }
    start = () => {
        console.log(this)
        this.boardEl.className = 'board'
        this.board = this.createBoard(this.boardEl)
        this.currentPlayer.pawns = this.board.whitePawns
        this.nextPlayer.pawns = this.board.blackPawns
        this.mainLoop()
    }
    
    private showMessage: showMessage = (message, color) => {
        this.messageBox.innerText = message
        this.messageBox.style.color = color
    }

    private changePlayer() {
        let step = this.currentPlayer
        this.currentPlayer = this.nextPlayer
        this.nextPlayer = step
    }
    
    private mainLoop() {
        this.currentPlayer.setQueue(this.board, this.move)
        this.select(this.currentPlayer.pawns, this.nextPlayer.pawns)
        if (this.currentPlayer.pawns.length === 0) return this.over(this.nextPlayer.color)
        if (!this.currentPlayer.canMove()) {
            if (!this.nextPlayer.canMove()) {
                return this.over(
                  (this.currentPlayer.pawns.length >= this.nextPlayer.pawns.length) ?
                    this.currentPlayer.color : this.nextPlayer.color
                )
            }
            return this.over(this.nextPlayer.color)
        }
        this.showMessage(`${this.currentPlayer.color} player's turn`, this.currentPlayer.color)
    }
    
    private move: Mover = (fromTo, selected) => {
        let toEat: CellNode | undefined
        let generator: Generator<CellNode> = this.moveByStep(fromTo)
        while(true) {
            try {
                let cell = generator.next().value
                if (cell.existsEl()) {
                    // if (toEat) return this.showMessage('unexpected error', 'red')
                    toEat = cell
                    continue
                }
                if (toEat) {
                    this.nextPlayer.removePawn(toEat)
                    cell.el.style.opacity = '1'
                }
                selected.setCell(new CellNode(cell))
            } catch {
                this.changePlayer()
                this.mainLoop()
                break
            }
        }
    }
    
    private *moveByStep(list: CellList): Generator<CellNode> {
        let current = list.current
        while (current.next !== undefined) {
            current = current.next
            yield current
        }
        throw new Error('no more steps!')
    }

    private over(winner: Color) {
        try {
            // @ts-ignore
            html2canvas(document.body).then(
              canvas => {
                  console.log('worked')
                  const url = canvas.toDataURL('image/png')
                  const a = document.createElement('a')
                  a.setAttribute('download', 'imageName.png')
                  a.setAttribute('href', url)
                  a.click()
              }
            )
        }
        catch {}
        setTimeout(() => {
            this.boardEl.remove()
            this.messageBox.remove()
            this.gameOverCallback(winner)
        }, 100)
    }
    
    private createBoard(boardEl: HTMLDivElement): Board {
        let rows: CellNode[][] = []
        let whitePawns: Pawn[] = []
        let blackPawns: Pawn[] = []
        for (let i = 1; i <= 8; i++) {
            let row = document.createElement('div')
            let rowStep: CellNode[] = []
            row.className = 'row'
            for (let j = 1; j <= 8; j++) {
                let col = document.createElement('div')
                let className = 'col'
                let cell: CellNode = new CellNode({x: j, y: i, color: Color.white, el: col, showMessage: this.showMessage})
                if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0 )){
                    className += ' black'
                    cell = new CellNode({x: j, y: i, color: Color.black, el: col, showMessage: this.showMessage})
                    if (i < 4)
                        whitePawns.push(new Pawn(Color.white, cell, this.showMessage))
                    else if (i > 5)
                        blackPawns.push(new Pawn(Color.black, cell, this.showMessage))
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