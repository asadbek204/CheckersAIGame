import Game, {Color} from './Game.js'
import AIPlayer from './Ai.js'

function main() {
    let messageBox = document.getElementById('message') as HTMLDivElement
    let board = document.getElementById('board') as HTMLDivElement
    const gameOverCallback = (color: Color) => {
        let congratulationBox = document.createElement('div')
        congratulationBox.className = 'congratulations'
        congratulationBox.innerText = `${color} player wins`
        document.body.appendChild(congratulationBox)
    }
    let game = new Game({board: board, messageBox: messageBox}, gameOverCallback)
    let go = document.getElementById('go')
    let one = document.getElementById('one')
    let two = document.getElementById('two')
    let three = document.getElementById('three')
    three.classList.add('animate')
    setTimeout(() => {
        three.remove()
        two.classList.add('animate')
    }, 1000)
    setTimeout(() => {
        two.remove()
        one.classList.add('animate')
    }, 2000)
    setTimeout(() => {
        one.remove()
        go.classList.add('animate')
    }, 3000)
    setTimeout(() => {
        go.remove()
        game.start()
    }, 4000)
}

main()
