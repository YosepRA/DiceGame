let diceBoxes = document.querySelectorAll('.dice');
let rollButtons = document.querySelectorAll('.dice-roll button');
let rollButtonsArray = Array.from(rollButtons);
let restartBtn = document.querySelector('.separator-restart');

let diceGame = {
  players: [{ rollResult: 0, isRolled: false }, { rollResult: 0, isRolled: false }],
  status: 'playing'
};

function diceRoll(event) {
  let rollButton = event.target;
  let playerIndex = rollButtonsArray.indexOf(rollButton);
  // Check game status and player's roll status.
  if (diceGame.players[playerIndex].isRolled) return;
  let randNum = randSix();
  updateModel(playerIndex, randNum);
  // Game Logic
  let winner;
  if (diceGame.status === 'finished') winner = checkGame(randNum);
  updateView(rollButton, randNum, winner);
}

function updateModel(playerIndex, randNum) {
  diceGame.players[playerIndex] = Object.assign({}, { rollResult: randNum, isRolled: true });

  // Check both players isRolled status.
  if (diceGame.players.every(p => p.isRolled)) {
    diceGame = Object.assign(diceGame, { status: 'finished' });
  }
}

function checkGame(randNum) {
  // Check tie.
  if (diceGame.players.every(p => p.rollResult === randNum)) {
    return 0;
  } else {
    // Check which are bigger than the other.
    let winner = diceGame.players.reduce(
      (winner, currentPlayer) => {
        return currentPlayer.rollResult > winner.rollResult ? currentPlayer : winner;
      },
      { rollResult: -Infinity }
    );
    // Return the player's number.
    return diceGame.players.indexOf(winner) + 1;
  }
}

function updateView(rollButton, randNum, winner) {
  let diceResult = rollButton.parentElement.previousElementSibling;
  rollButton.parentElement.style.visibility = 'hidden';
  // Assign it to dice result.
  diceResult.textContent = randNum;

  // Update view based on what's being returned by the game logic.
  // If undefined → all players haven't rolled their dice.
  // If number → the game is finished and the winner or a tie game has been decided.
  if (winner != undefined) {
    if (winner === 0) {
      // Tie game
      for (const diceBox of diceBoxes) {
        let dialogBox = diceBox.firstElementChild;
        dialogBox.textContent = 'TIE GAME';
      }
    } else {
      // There's a winner.
      let winnerBox = diceBoxes[winner - 1];
      let dialogBox = winnerBox.firstElementChild;

      winnerBox.classList.add('win');
      dialogBox.textContent += ' win';
    }
  }
}

function randSix() {
  return Math.floor(Math.random() * 6 + 1);
}

function restart() {
  // Reset model.
  diceGame.players = diceGame.players.map(() => {
    return { rollResult: 0, isRolled: false };
  });
  diceGame = Object.assign(diceGame, { status: 'playing' });

  // Reset view.
  for (let i = 0; i < diceBoxes.length; i++) {
    let diceBox = diceBoxes[i];
    let dialogBox = diceBox.children[0];
    let diceResult = diceBox.children[1];
    let rollButton = diceBox.children[2];

    diceBox.classList.remove('win');
    dialogBox.textContent = `Player ${i + 1}`;
    diceResult.textContent = '0';
    rollButton.style.visibility = 'visible';
  }
}

function init() {
  rollButtons.forEach(roll => {
    roll.addEventListener('click', diceRoll);
  });
  restartBtn.addEventListener('click', restart);
}

init();
