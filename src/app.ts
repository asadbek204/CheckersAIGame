
class Position {
    x: number
    y: number
    private cell: HTMLDivElement

    constructor(x = 0, y = 0, cell: HTMLDivElement) {
        this.x = x
        this.y = y
        this.cell = cell
    }

    set Cell(cell: HTMLDivElement) {
        if (!cell.classList.contains('black'))
            throw Error('')
        this.cell = cell
    }

    get Cell() {
        return this.cell
    }
}

class Player {
    color: string
    pawnList: Pawn[]
    selected: Pawn
    canMove: boolean = true
    moved: boolean = false
    movTo?: Position = undefined
    private state: number

    constructor(color: string, pawnList: Pawn[]) {
        this.color = color
        this.pawnList = pawnList
        this.selected = pawnList[0]
    }

    move(pawn: Pawn) {
        if (!this.pawnList.includes(pawn))
            throw Error()

    }

    set State(state: number) {
        this.state = state
    }

    get State() {
        return this.State
    }
}

class Pawn {
    color: string
    position: Position
    pawn: HTMLDivElement

    constructor(color: string, position: Position) {
        this.color = color
        this.position = position
        let pawn = document.createElement('div')
        pawn.className = 'pawn-simple'
        pawn.id = `pawn-${position.x}-${position.y}`
        pawn.style.width = '100%'
        pawn.style.height = '100%'
        pawn.style.backgroundImage = `url('src/img/${this.color}-pawn.png')`
        pawn.style.backgroundPosition = 'center'
        pawn.style.backgroundSize = 'cover'
        pawn.style.borderRadius = '50%'
        this.pawn = pawn
        this.position.Cell.appendChild(this.pawn)
    }

    private move(position: Position){
        this.pawn.remove()
        position.Cell.appendChild(this.pawn)
        this.position = position
    }

    set Position(position: Position) {

        this.position = position
    }
}

class Board {
    whitePawns: Pawn[]
    blackPawns: Pawn[]
    rows: HTMLDivElement[][]

    constructor(whitePawns: Pawn[], blackPawns: Pawn[], rows: HTMLDivElement[][]) {
        this.whitePawns = whitePawns
        this.blackPawns = blackPawns
        this.rows = rows
    }
}

class Game {
    currentPlayer: Player
    nextPlayer: Player
    waiting: boolean
    board: Board

    constructor(whitePlayer: Player, blackPlayer: Player, board: Board) {
        this.currentPlayer = whitePlayer
        this.nextPlayer = blackPlayer
        this.waiting = true
        this.board = board
    }

    start() {
        this.mainLoop()
    }

    changePlayer() {
        [this.currentPlayer, this.nextPlayer] = [this.nextPlayer, this.currentPlayer]
    }

    mainLoop() {
        if (this.board.whitePawns.length === 0 || this.board.blackPawns.length === 0) {
            this.over(this.nextPlayer.color)
            return
        }
        if (!this.currentPlayer.canMove){
            this.over(this.nextPlayer.color)
            return
        }
        this.waiting = true
        // this.currentPlayer.move()
    }

    move(pawn: Pawn, to: Position) {
    }

    over(winner: string) {alert(`${winner} wins!!!`)}
}

const createBoard = (id: string): [HTMLDivElement[][], Pawn[], Pawn[]] => {
    let rows: HTMLDivElement[][] = []
    let whitePawns: Pawn[] = []
    let blackPawns: Pawn[] = []
    let boardEl = document.getElementById(id)
    if (boardEl === null)
        throw Error(`board not found in html havn't element with id ${id}`)
    boardEl.className = id
    for (let i = 0; i < 8; i++) {
        let row = document.createElement('div')
        let rowStep: Array<HTMLDivElement> = []
        row.className = 'row'
        for (let j = 0; j < 8; j++) {
            let col = document.createElement('div')
            let className = 'col'
            if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0 )){
                className += ' black'
                if (i < 3)
                    whitePawns.push(new Pawn('white', new Position(i, j, col)))
                else if (i > 4)
                    blackPawns.push(new Pawn('dark', new Position(i, j, col)))
            }
            col.className = className
            rowStep.push(col)
            row.appendChild(col)
        }
        rows.push(rowStep)
        boardEl.appendChild(row)
    }
    return [rows, whitePawns, blackPawns]
}

// const main = () => {
    let [rows, whitePawns, blackPawns] = createBoard('board')
    let whitePlayer = new Player('white', whitePawns)
    let blackPlayer = new Player('dark', blackPawns)

    let board = new Board(whitePawns, blackPawns, rows)

    let game = new Game(whitePlayer, blackPlayer, board)
    // game.start()
// }

// while (true){
    // main()
// }
