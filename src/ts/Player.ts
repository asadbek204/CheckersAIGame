import { Color, Pawn, Cell } from "./Game.js"

export enum PlayerStates {
    waiting,
    selecting,
    moving,
}

export default class Player {
    private color: Color
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

    Color(): Color {
        return this.color
    }

    setState(state: number): void {
        this.state = state
    }

    State(): PlayerStates {
        return this.state
    }
}

export {}