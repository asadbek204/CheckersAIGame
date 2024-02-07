import {Cell, Color, Pawn} from "./Game.js"

export enum PlayerStates {
    waiting,
    selecting,
    moving,
}

export default class Player {
    readonly color: Color
    private pawnList: Pawn[] = []
    private selected?: Pawn = undefined
    private canMove: boolean = true
    private moved: boolean = false
    private movTo?: Cell = undefined
    private state: PlayerStates

    constructor(color: Color) {
        this.color = color
        this.state = (color === 'white') ? PlayerStates.selecting : PlayerStates.waiting
    }

    setPawnList(): void {
        
    }

    setQueue(): void {

    }

    CanMove(): boolean {
        return this.canMove
    }

    setState(state: number): void {
        this.state = state
    }

    State(): PlayerStates {
        return this.state
    }
}

export {}