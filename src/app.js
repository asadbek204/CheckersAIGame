class Position {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
}

class Player {

    constructor(color, pawnList) {
        this.color = color
        this.pawnList = pawnList
        this.selected = pawnList[0]
        this.canMove = true
        this.moved = false
        this.movTo = Position()
    }

    move() {
        if (!this.canMove)
            return
        while(this.moved) {}
        this.moved = false
        
    }
}

class Pawn {

    constructor(color, position) {
        this.color = color
        this.position = position
        let pawn = document.createElement('div')
        pawn.class = 'pawn-simple'
        pawn.id = `pawn-${position.x}-${position.y}`
        pawn.style.width = '100%'
        pawn.style.height = '100%'
        pawn.style.backgroundImage = `url('src/${this.color}-pawn')`
        pawn.style.backgroundPosition = 'center'
        pawn.style.backgroundSize = 'cover'
        this.pawn = pawn
    }

    move(callback) {
        this.pawn.onclick = callback
    }
}

class Board {

    constructor(whitePawns, blackPawns, rows) {
        this.whitePawns = whitePawns
        this.blackPawns = blackPawns
        this.rows = rows
        whitePawns.forEach(this.mount)
        blackPawns.forEach(this.mount)
    }

    mount(pawn) {
        this.rows[this.position[0]][this.position[1]].appendChield(pawn)
    }

    unmount(pawn) {
        pawn.remove()
    }

    clear() {
        this.whitePawns.forEach(this.unmount)
        this.blackPawns.forEach(this.unmount)
    }
}

class Game {

    constructor(whitePlayer, blackPlayer, board) {
        this.currentPlayer = whitePlayer
        this.nextPlyer = blackPlayer
        this.waiting = true
        this.board = board
    }

    start() {

        this.mainLoop()
    }

    changePlayer() {
        [this.currentPlayer, this.nextPlyer] = [this.nextPlyer, this.currentPlayer]
    }

    mainLoop() {
        while (true) {
            this.waiting = true
            while(this.waiting){
                this.currentPlayer.move(this.move)
            }
            if (this.whitePawns.length === 0 || this.blackPawns.length === 0)
                break
            if (this.currentPlayer.canMove){
                this.over(this.nextPlyer.color)
                return
            }
        }
        this.over((this.whitePawns.length === 0) ? 'black' : 'white')
    }

    move() {
        
        this.waiting = false
    }

    over(winner) {
        alert(`${winner} wins!!!`)
    }
}

let rows = document.getElementsByClassName('row').children

rows = rows.map(e => e.children)

let whitePawns = Array(12)
let blackPawns = Array(12)

whitePawns = whitePawns.map(e => new Pawn('white', new Position()))
blackPawns = blackPawns.map(e => new Pawn('dark', new Position()))

let whitePlayer = new Player('white')
let blackPlayer = new Player('dark')


let board = new Board(whitePawns, blackPawns, rows)

let game = new Game(whitePlayer, blackPlayer, board)

game.start()
