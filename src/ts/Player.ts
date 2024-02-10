import {board, CellList, CellNode, Color, Mover, Pawn} from "./Game.js"

class SelectError extends Error {
    pawn?: Pawn
    constructor(message: string, pawn?: Pawn) {
        super(message)
        this.pawn = pawn
        Object.setPrototypeOf(this, SelectError.prototype)
    }
    
    toString() {
        return `${this.message}, ${this.pawn}`
    }
}

enum PlayerState {
    waiting,
    selecting,
    moving,
}

enum Direction {
    up = -1,
    down = 1
}

export default class Player {
    readonly color: Color
    private selected?: Pawn
    private moveTo?: CellList
    private state: PlayerState
    private mover?: Mover
    pawns: Pawn[]
    private readonly direction: Direction
    private board: board
    
    constructor(color: Color) {
        this.color = color
        this.state = PlayerState.waiting
        this.direction = (this.color === Color.white) ? Direction.down : Direction.up
    }
    
    removePawn(cell: CellNode): boolean {
        let pawnIndex = this.pawns.findIndex((p) => p.cell.x === cell.x && p.cell.y === cell.y)
        let check = pawnIndex !== -1
        if (check) {
            this.pawns.splice(pawnIndex, 1)
            cell.el.innerHTML = ''
        }
        return check
    }
    
    canMove() {
        const checkCanMove = (el: CellNode, direction: number) => {
            if (!el) return false
            if (el.existsEl()) {
                this.checkWaitForEat(el, direction)
            }
            else return true
        }
        for(let pawn of this.pawns) {
            let i = pawn.cell.y + this.direction - 1
            let j = pawn.cell.x - 1
            let list = this.board.rows[i]
            if (list) {
                let el = list[j - 1]
                if (checkCanMove(el, -1)) return true
                el = list[j + 1]
                if (checkCanMove(el, -3)) return true
            }
        }
        return false
    }

    setQueue(board: board, callback: Mover): void {
        if (this.state === PlayerState.selecting) return
        this.mover = callback
        this.pawns.forEach(e => e.onclick(this.select.bind(this)))
        this.board = board
        this.state = PlayerState.selecting
        console.log(this)
    }
    
    private eat(position: CellNode): boolean {
        let i = position.y - this.direction
        let j = position.x + ((position.x > this.moveTo.last().x) ? -1 : 1)
        let eatCell: CellNode = this.board.rows[i-1][j-1]
        if (!eatCell.existsEl()) throw new Error('you cannot pass more than one cell')
        let el = eatCell.el.firstElementChild as HTMLDivElement
        if (el.style.color === this.color) throw new Error('you can\'t eat your own pawns')
        this.moveTo.add(new CellNode(eatCell))
        this.moveTo.add(new CellNode(position))
        return true
    }
    
    private moveQueen(position: CellNode) {
        if (Math.abs(this.moveTo.last().x - position.x) === (this.moveTo.last().y - position.y) * this.direction) throw new Error('you can\'t move to this position')
        let start = position.y - this.direction
        let reserveList = this.moveTo
        let havePawn: boolean
        this.resetMoveTo(this.moveTo.last())
        for (let i = start + 1; i < position.x; i++) {
            let row = this.board.rows[i + 1]
            for (let j = i; j < position.y; i += ((position.x > this.moveTo.last().x) ? -1 : 1)) {
                if (row[j].existsEl()) {
                    if (havePawn) {
                        this.moveTo = reserveList
                        throw new Error('you can\'t eat more than 1 pawns in one jump')
                    }
                    havePawn = true
                    continue
                }
                havePawn = false
                if (row[j - 1].existsEl()) this.eat(row[j])
            }
        }
        let movedTo = this.moveTo
        this.moveTo = reserveList
        movedTo.current.previous = this.moveTo.last()
        this.moveTo.last().next = movedTo.current
        if (
          this.board.rows[this.moveTo.last().x + 1][this.moveTo.last().y + 1].existsEl()
          &&
          this.board.rows[this.moveTo.last().x - 1][this.moveTo.last().y - 1].existsEl()
          &&
          this.board.rows[this.moveTo.last().x + 1][this.moveTo.last().y - 1].existsEl()
          &&
          this.board.rows[this.moveTo.last().x - 1][this.moveTo.last().y + 1].existsEl()
        ) this.move()
    }
    
    private checkX(position: CellNode, step: number): boolean {return Math.abs(position.x - this.moveTo.last().x) === step}
    private checkY(position: CellNode, step: number): boolean {return (position.y - this.moveTo.last().y) === this.direction * step}
    
    private checkWaitForEat(el: CellNode | undefined, direction: number): boolean {
        if (!el) return false
        if (!el.existsEl()) return false
        let pawn = el.el.firstElementChild as HTMLDivElement
        if (pawn.style.color === this.color) return false
        let elList = this.board.rows[el.y + this.direction - 1]
        if (!elList) return false
        el = elList[el.x - direction - 3]
        if (!el) return false
        return !el.existsEl()
    }
    
    setMove(position: CellNode) {
        let error = new Error('you can\'t move to this position')
        if (this.state !== PlayerState.moving) throw new Error('you must select one of this your pawns to move')
        if (position.existsEl()) {
            if ((position.el.firstElementChild as HTMLDivElement).style.color !== this.color)
                throw new Error('this cell is busy')
            return
        }
        if (this.selected.isQueen()) this.moveQueen(position)
        if (!this.checkX(position, 1)) {
            if (this.moveTo.last().x === position.x && this.moveTo.last().y === position.y) return this.move()
            if (!this.checkX(position, 2)) throw error
            if (!this.checkY(position, 2)) throw error
            if (this.eat(position)) {
                let i = position.y + this.direction
                let j = position.x - 1
                let elList = this.board.rows[i - 1]
                if (elList) {
                    let el = elList[j - 1]
                    if (this.checkWaitForEat(el, -1)) return position.el.style.opacity = '.5'
                    el = elList[j + 1]
                    if (this.checkWaitForEat(el, -3)) return position.el.style.opacity = '.5'
                }
            }
        } else {
            if (!this.checkY(position, 1) || this.moveTo.length() !== 1) throw new Error('you can\'t move to this position')
            this.moveTo.add(new CellNode(position))
        }
        this.move()
    }
    
    resetMoveTo(cell: CellNode) {
        this.moveTo = new CellList(new CellNode(cell))
    }
    
    select(pawn: Pawn) {
        if (this.state === PlayerState.waiting) throw new SelectError('wait your turn')
        if (pawn.color !== this.color) throw new SelectError('you can\'t select this pawn', pawn)
        if (this.state === PlayerState.moving) {
            if (this.moveTo.length() > 1) {
                let step = this.moveTo.current
                while (step.next) {
                    if (step.existsEl())
                        step.el.style.opacity = '1'
                    step = step.next
                }
            }
            this.selected = pawn
            this.resetMoveTo(pawn.cell)
        }
        else {
            this.state = PlayerState.moving
            this.selected = pawn
            this.resetMoveTo(pawn.cell)
            this.board.rows.forEach(e => e.forEach(cell => (!cell.existsEl() && cell.color === Color.black) ? cell.onclick(this.setMove.bind(this)) : undefined))
        }
    }
    
    move() {
        this.pawns.forEach(e => e.removeOnclick())
        this.board.rows.forEach(e => e.forEach(cell => cell.removeOnclick()))
        this.state = PlayerState.waiting
        this.mover(this.moveTo, this.selected)
        this.selected = undefined
        this.moveTo = undefined
        this.mover = undefined
    }
}

export {}