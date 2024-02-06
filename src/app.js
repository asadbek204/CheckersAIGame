var Position = /** @class */ (function () {
    function Position(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Position;
}());
var Player = /** @class */ (function () {
    function Player(color, pawnList) {
        this.color = color;
        this.pawnList = pawnList;
        this.selected = pawnList[0];
        this.canMove = true;
        this.moved = false;
        this.movTo = new Position();
    }
    Player.prototype.move = function (callback) {
        if (!this.canMove)
            return;
        while (this.moved) { }
        this.moved = false;
    };
    return Player;
}());
var Pawn = /** @class */ (function () {
    function Pawn(color, position) {
        this.color = color;
        this.position = position;
        var pawn = document.createElement('div');
        pawn.className = 'pawn-simple';
        pawn.id = "pawn-".concat(position.x, "-").concat(position.y);
        pawn.style.width = '100%';
        pawn.style.height = '100%';
        pawn.style.backgroundImage = "url('src/img/".concat(this.color, "-pawn.png')");
        pawn.style.backgroundPosition = 'center';
        pawn.style.backgroundSize = 'cover';
        pawn.style.borderRadius = '50%';
        this.pawn = pawn;
    }
    Pawn.prototype.move = function (callback) {
        this.pawn.onclick = callback;
    };
    return Pawn;
}());
var Board = /** @class */ (function () {
    function Board(whitePawns, blackPawns, rows) {
        this.whitePawns = whitePawns;
        this.blackPawns = blackPawns;
        this.rows = rows;
        whitePawns.forEach(this.mount);
        blackPawns.forEach(this.mount);
    }
    Board.prototype.mount = function (pawn) {
        console.log(this.rows[pawn.position.x][pawn.position.y]);
        this.rows[pawn.position.x][pawn.position.y].appendChild(pawn.pawn);
    };
    Board.prototype.unmount = function (pawn) {
        pawn.pawn.remove();
    };
    Board.prototype.clear = function () {
        this.whitePawns.forEach(this.unmount);
        this.blackPawns.forEach(this.unmount);
    };
    return Board;
}());
var Game = /** @class */ (function () {
    function Game(whitePlayer, blackPlayer, board) {
        this.currentPlayer = whitePlayer;
        this.nextPlayer = blackPlayer;
        this.waiting = true;
        this.board = board;
    }
    Game.prototype.start = function () {
        this.mainLoop();
    };
    Game.prototype.changePlayer = function () {
        var _a;
        _a = [this.nextPlayer, this.currentPlayer], this.currentPlayer = _a[0], this.nextPlayer = _a[1];
    };
    Game.prototype.mainLoop = function () {
        if (this.board.whitePawns.length === 0 || this.board.blackPawns.length === 0) {
            this.over(this.nextPlayer.color);
            return;
        }
        if (!this.currentPlayer.canMove) {
            this.over(this.nextPlayer.color);
            return;
        }
        this.waiting = true;
        this.currentPlayer.move(this.move);
    };
    Game.prototype.move = function (pawn, to) {
        this.waiting = false;
    };
    Game.prototype.over = function (winner) {
        alert("".concat(winner, " wins!!!"));
    };
    return Game;
}());
var createBoard = function (id) {
    var rows = [];
    var whitePawns = [];
    var blackPawns = [];
    var boardEl = document.getElementById(id);
    if (boardEl === null)
        throw Error("board not found in html havn't element with id ".concat(id));
    boardEl.className = id;
    for (var i = 0; i < 8; i++) {
        var row = document.createElement('div');
        var rowStep = [];
        row.className = 'row';
        for (var j = 0; j < 8; j++) {
            var className = 'col';
            if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0)) {
                className += ' black';
                if (i < 3)
                    whitePawns.push(new Pawn('white', new Position(i, j)));
                else if (i > 4)
                    blackPawns.push(new Pawn('dark', new Position(i, j)));
            }
            var col = document.createElement('div');
            col.className = className;
            rowStep.push(col);
            row.appendChild(col);
        }
        rows.push(rowStep);
        boardEl.appendChild(row);
    }
    return [rows, whitePawns, blackPawns];
};
// const main = () => {
var _a = createBoard('board'), rows = _a[0], whitePawns = _a[1], blackPawns = _a[2];
var whitePlayer = new Player('white', whitePawns);
var blackPlayer = new Player('dark', blackPawns);
var board = new Board(whitePawns, blackPawns, rows);
var game = new Game(whitePlayer, blackPlayer, board);
// game.start()
// }
// while (true){
// main()
// }
