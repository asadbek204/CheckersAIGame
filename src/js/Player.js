export default class Player {
    constructor(color, pawnList) {
        this.canMove = true;
        this.moved = false;
        this.movTo = undefined;
        this.state = 0;
        this.color = color;
        this.pawnList = pawnList;
        this.selected = pawnList[0];
    }
    setQueue() {
    }
    CanMove() {
        return this.canMove;
    }
    Color() {
        return this.color;
    }
    setState(state) {
        this.state = state;
    }
    State() {
        return this.state;
    }
}
export class AIPlayer extends Player {
    constructor(color, pawnList) {
        super(color, pawnList);
    }
    setQueue() {
    }
}
