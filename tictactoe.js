document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Tic Tac Toe JS loaded!');  // check if script runs

  let currentPlayer = 'X';
  let cells = document.querySelectorAll('.cell');
  let statusText = document.getElementById('status');

  console.log('Number of cells found:', cells.length); // should print 9

  cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
  });

  function handleClick(e) {
    const cell = e.target;
    if (cell.textContent === '') {
      cell.textContent = currentPlayer;
      if (checkWinner()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        endGame();
      } else if (isDraw()) {
        statusText.textContent = "It's a draw!";
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
      }
    }
  }

  function checkWinner() {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern =>
      pattern.every(i => cells[i].textContent === currentPlayer)
    );
  }

  function isDraw() {
    return [...cells].every(cell => cell.textContent !== '');
  }

  function endGame() {
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
  }

  function resetGame() {
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.addEventListener('click', handleClick));
  }

  document.querySelector('button').addEventListener('click', resetGame);
});
