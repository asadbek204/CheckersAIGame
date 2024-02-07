import Game, { createBoard, Board } from './Game.js';
import Player from './Player.js';
function main() {
    let [rows, whitePawns, blackPawns] = createBoard('board');
    let whitePlayer = new Player('white', whitePawns);
    let blackPlayer = new Player('dark', blackPawns);
    let board = new Board(whitePawns, blackPawns, rows);
    let game = new Game(whitePlayer, blackPlayer, board);
    // game.start()
}
main();
