<h1>Checkers Game</h1>

**Open Source Project**

---

- You can just clone and run it 
- Project writen in typescript

- You can integrate this project codes in your own ts project very simply for this you should import class Game and invoke object from this class. 

```typescript

import Game, {Color} from './Game'

let game = new Game({board: 'board'}) // board is a id of div element from index.html

game.start() // starts the game

```

- **Quick start**:
  - clone the repository
  - open it in your favorite code editor
  - and compile it with:
  - ```bash
    tsc -p tsconfig.json
    ```
  - install **server** for *serving* the project
  - ```bash
    npm install -g serve
    ```
  - and run project
  - ```bash
    serve
    ```
    *or*
  - ```bash
    serve -l 8080
    ```
    - expected output: <br> 
    -  <pre>
       ┌───────────────────────────────────────────┐
       │                                           │
       │   Serving!                                │
       │                                           │
       │   - Local:    http://localhost:3000       │
       │   - Network:  http://192.168.0.1:3000     │
       │                                           │
       │   Copied local address to clipboard!      │
       │                                           │
       └───────────────────────────────────────────┘
      </pre>
---

- **class Player**
  -

  - fields 
  - ```typescript
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
    ```

- **class Game**
  -
  
    - fields: <br> **currentPlayer** and **nextPlayer** are checkers players (instance of Player) <br>
      **board** will be automatically created using the div id you provided (the one we gave to the Game constructor).
      - ```typescript
        export default class Game {
            currentPlayer: Player // the player ready to move checkers pawn
            nextPlayer: Player    // the player waiting for his turn
            board: Board          // to keep the cells inside
        
            // etc.
        }
        ```
        
    - ```typescript
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
      ```