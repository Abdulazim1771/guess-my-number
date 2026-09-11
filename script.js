'use strict';

// State
const getRandomNumber = () => Math.trunc(Math.random() * 20) + 1;
let secretNumber = getRandomNumber();
let score = 20;
let highscore = 0;

// DOM Elements
const bodyEl = document.querySelector('body');
const numberEl = document.querySelector('.number');
const guessEl = document.querySelector('.guess');
const scoreEl = document.querySelector('.score');
const highscoreEl = document.querySelector('.highscore');
const messageEl = document.querySelector('.message');
const checkBtn = document.querySelector('.check');
const againBtn = document.querySelector('.again');

// Helpers
const displayMessage = function (message) {
  messageEl.textContent = message;
};

// Game Logic
const checkGuess = function () {
  if (score <= 0 || numberEl.textContent !== '?') return;

  const guess = Number(guessEl.value);

  // When there is no input
  if (!guess) {
    displayMessage('⛔ No number!');

    // When player wins
  } else if (guess === secretNumber) {
    displayMessage('🎉 Correct Number!');
    numberEl.textContent = secretNumber;
    bodyEl.style.backgroundColor = '#60b347';
    numberEl.style.width = '30rem';

    if (score > highscore) {
      highscore = score;
      highscoreEl.textContent = highscore;
    }

    // When guess is wrong
  } else {
    if (score > 1) {
      displayMessage(guess > secretNumber ? '📈 Too high!' : '📉 Too low!');
      score--;
      scoreEl.textContent = score;
    } else {
      displayMessage('💥 You lost the game!');
      score = 0;
      scoreEl.textContent = 0;
    }
  }
};

const resetGame = function () {
  score = 20;
  secretNumber = getRandomNumber();

  displayMessage('Start guessing...');
  scoreEl.textContent = score;
  numberEl.textContent = '?';
  guessEl.value = '';

  bodyEl.style.backgroundColor = '#222';
  numberEl.style.width = '15rem';
};

// Event Listeners
checkBtn.addEventListener('click', checkGuess);
againBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    if (e.target.tagName === 'BUTTON') return;
    checkGuess();
  }
});
