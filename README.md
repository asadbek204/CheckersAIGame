<h1>Checkers Game</h1>

**Open Source Project**

---

- You can just clone and run it 
- Project writen in typescript

- You can integrate this project codes in your own ts project very simply for this you should import class Game and invoke object from this class. 

```typescript

import Game, {Color} from './Game'

let game = new Game({board: 'board'}) // board is a id of div element from index.html

game.start() // startes game

```

- **Quick start**:
  - clone the repository
  - open it in your favorite code editor
  - and compile it with:
  - ```bash
    tsc -p tsconfig.json
    ```

***