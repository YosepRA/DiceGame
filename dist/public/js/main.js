let diceBoxes = document.querySelectorAll('.dice');
let rollButtons = document.querySelectorAll('.dice-roll button');
let rollButtonsArray = Array.from(rollButtons);

let diceGame = {
  players: [{ rollResult: 0, isRolled: false }, { rollResult: 0, isRolled: false }],
  status: 'playing'
};

rollButtons.forEach(roll => {
  roll.addEventListener('click', diceRoll);
});

function diceRoll(event) {
  let rollButton = event.target;
  let playerIndex = rollButtonsArray.indexOf(rollButton);

  // Check game status and player's roll status.
  if (diceGame.players[playerIndex].isRolled) return;

  let diceResult = rollButton.parentElement.previousElementSibling;
  // Pick a random number.
  let randNum = randSix();

  // Update model.
  updateModel(playerIndex, randNum);

  // Game Logic
  let winner;
  if (diceGame.status === 'finished') {
    winner = checkGame(randNum);
  }

  // Update view.
  updateView(diceResult, randNum, winner);
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

function updateView(diceResult, randNum, winner) {
  // Assign it to dice result.
  diceResult.textContent = randNum;

  // Update view based on what's being returned by the game logic.
  // If undefined → all players haven't rolled their dice.
  // If code → the game is finished and the winner or a tie game has been decided.
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
      dialogBox.textContent += ' win';
    }
  }
}

function randSix() {
  return Math.floor(Math.random() * 6 + 1);
}
