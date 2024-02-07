import { Pawn, Cell } from "./Game.js"

export enum PlayerStates {
    waiting,
    selecting,
    moving,
}


export default class Player {
    private color: string
    private pawnList: Pawn[]
    private selected: Pawn
    private canMove: boolean = true
    private moved: boolean = false
    private movTo?: Cell = undefined
    private state: PlayerStates

    constructor(color: string, pawnList: Pawn[]) {
        this.color = color
        this.pawnList = pawnList
        this.selected = pawnList[0]
        this.state = (color === 'white') ? PlayerStates.selecting : PlayerStates.waiting
    }

    setQueue() {

    }

    CanMove() {
        return this.canMove
    }

    Color() {
        return this.color
    }

    setState(state: number) {
        this.state = state
    }

    State() {
        return this.state
    }
}

export class AIPlayer extends Player {
    constructor(color: string, pawnList: Pawn[]) {
        super(color, pawnList)
    }

    setQueue(): void {
        
    }
}

export {}