// script.js

document.addEventListener('DOMContentLoaded', function() {
    var gameBoard = document.getElementById('game-board');
    var boardSize = 19;
    var turn = 'black'; // black goes first
    var boardState = Array(boardSize).fill().map(() => Array(boardSize).fill(''));

    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            var cell = document.createElement('div');
            cell.className = 'cell';
  
            gameBoard.appendChild(cell);
          

            cell.addEventListener('click', function() {
                var index = Array.from(this.parentNode.children).indexOf(this);
                var row = Math.floor(index / boardSize);
                var col = index % boardSize;
                var validMove = true;

                // Check for suicide move
                if (turn === 'black') {
                    if (isSuicideMove(row, col, 'black', 'white')) {
                        validMove = false;
                    }
                } else {
                    if (isSuicideMove(row, col, 'white', 'black')) {
                        validMove = false;
                    }
                }

                if (validMove && !this.classList.contains('black') && !this.classList.contains('white')) {
                    this.classList.add(turn);
                    boardState[row][col] = turn;
                    checkCapture(row, col, turn);
                    turn = (turn === 'black') ? 'white' : 'black'; // switch turns
                }
            });
        }
    }

    function isSuicideMove(row, col, self, opponent) {
        // Check all four directions
        var directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (var i = 0; i < directions.length; i++) {
            var newRow = row + directions[i][0];
            var newCol = col + directions[i][1];
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (boardState[newRow][newCol] !== opponent) {
                    // If one of the adjacent cells is not an opponent, it's not a suicide move
                    return false;
                }
            }
        }
        // If all the adjacent cells are opponents, it's a suicide move
        return true;
    }

    function checkCapture(row, col, color) {
        var opponent = (color === 'black') ? 'white' : 'black';
        var directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (var i = 0; i < directions.length; i++) {
            var newRow = row + directions[i][0];
            var newCol = col + directions[i][1];
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (boardState[newRow][newCol] === opponent) {
                    var group = [];
                    if (isCaptured(newRow, newCol, opponent, group)) {
                        for (var j = 0; j < group.length; j++) {
                            var cell = group[j];
                            boardState[cell[0]][cell[1]] = '';
                            var element = gameBoard.children[cell[0]*boardSize + cell[1]];
                            element.className = 'cell';
                        }
                    }
                }
            }
        }
    }

    function isCaptured(row, col, color, group) {
        group.push([row, col]);
        var directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (var i = 0; i < directions.length; i++) {
            var newRow = row + directions[i][0];
            var newCol = col + directions[i][1];
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (boardState[newRow][newCol] === '') {
                    return false;
                } else if (boardState[newRow][newCol] === color && !group.some(function(cell) { return cell[0] === newRow && cell[1] === newCol; })) {
                    if (!isCaptured(newRow, newCol, color, group)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
});
