const Gameboard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => board;
    const setMark = (index, mark) => {
        if (!board[index]) {
            board[index] = mark;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        board = Array(9).fill(null);
    };

    return { getBoard, setMark, resetBoard };
})();

const createPlayer = (name, marker) => {
    return { name, marker };
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let isGameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [createPlayer(player1Name || "Player 1", 'X'), createPlayer(player2Name || "Player 2", 'O')];
        currentPlayerIndex = 0;
        isGameOver = false;
        Gameboard.resetBoard();
        DisplayController.updateMessage(`${players[0].name}'s turn`);
        DisplayController.renderBoard();
    };

    const playTurn = (index) => {
        if (isGameOver || !Gameboard.setMark(index, players[currentPlayerIndex].marker)) return;

        if (checkWin()) {
            isGameOver = true;
            DisplayController.updateMessage(`${players[currentPlayerIndex].name} wins!`);
        } else if (Gameboard.getBoard().every(cell => cell !== null)) {
            isGameOver = true;
            DisplayController.updateMessage("It's a tie!");
        } else {
            currentPlayerIndex = 1 - currentPlayerIndex;
            DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn`);
        }
        DisplayController.renderBoard();
    };

    const checkWin = () => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winningCombinations.some(combination =>
            combination.every(index => Gameboard.getBoard()[index] === players[currentPlayerIndex].marker)
        );
    };

    return { startGame, playTurn };
})();

const DisplayController = (() => {
    const boardDivs = [];

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        const gameboardDiv = document.getElementById('gameboard');
        gameboardDiv.innerHTML = '';
        board.forEach((mark, index) => {
            const cell = document.createElement('div');
            cell.textContent = mark;
            cell.addEventListener('click', () => Game.playTurn(index));
            gameboardDiv.appendChild(cell);
            boardDivs.push(cell);
        });
    };

    const updateMessage = (message) => {
        document.getElementById('message').textContent = message;
    };

    document.getElementById('start-game').addEventListener('click', () => {
        const player1Name = document.getElementById('player1-name').value;
        const player2Name = document.getElementById('player2-name').value;
        Game.startGame(player1Name, player2Name);
    });

    document.getElementById('restart').addEventListener('click', () => {
        Game.startGame("Player 1", "Player 2");
    });

    return { renderBoard, updateMessage };
})();

// Start the game with default names initially
Game.startGame("Player 1", "Player 2");
