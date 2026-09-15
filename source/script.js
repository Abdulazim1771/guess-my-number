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

// Sound Effects (Synthesized via Web Audio API)
let audioCtx;
const initAudio = function () {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = function (freq, type, duration, delay = 0, volume = 0.1) {
  try {
    initAudio();
    const startTime = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch (e) {
    // AudioContext not allowed or unsupported
  }
};

// Retro defeat sound: dramatic descending 8-bit notes
const playDefeatSound = function () {
  playTone(293.66, 'sawtooth', 0.18, 0, 0.12);     // D4
  playTone(277.18, 'sawtooth', 0.18, 0.18, 0.12);  // C#4
  playTone(261.63, 'sawtooth', 0.22, 0.36, 0.12);  // C4
  playTone(196.00, 'sawtooth', 0.5, 0.58, 0.15);   // G3
};

// Retro victory fanfare: cheerful arpeggio
const playVictorySound = function () {
  playTone(261.63, 'triangle', 0.12, 0, 0.15);     // C4
  playTone(329.63, 'triangle', 0.12, 0.12, 0.15);  // E4
  playTone(392.00, 'triangle', 0.12, 0.24, 0.15);  // G4
  playTone(523.25, 'triangle', 0.35, 0.36, 0.2);   // C5
};

// Retro wrong guess blip
const playBlipSound = function () {
  playTone(160, 'square', 0.08, 0, 0.08);
};

// Helpers
const displayMessage = function (message) {
  messageEl.textContent = message;
};

const triggerShake = function () {
  bodyEl.classList.remove('shake');
  void bodyEl.offsetWidth; // Force reflow
  bodyEl.classList.add('shake');
};

// Game Logic
const checkGuess = function () {
  if (score <= 0 || numberEl.textContent !== '?' || guessEl.disabled) return;

  const guess = Number(guessEl.value);

  // When there is no input
  if (!guess) {
    displayMessage('⛔ No number!');

    // When player wins
  } else if (guess === secretNumber) {
    displayMessage('🎉 Correct Number!');
    numberEl.textContent = secretNumber;
    bodyEl.style.backgroundColor = '#60b347';
    numberEl.classList.add('expanded');

    guessEl.disabled = true;
    checkBtn.disabled = true;
    againBtn.classList.add('pulse-btn');

    playVictorySound();

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
      playBlipSound();
    } else {
      displayMessage(`💥 GAME OVER! The number was ${secretNumber}`);
      score = 0;
      scoreEl.textContent = 0;

      // Reveal secret number
      numberEl.textContent = secretNumber;
      numberEl.classList.add('expanded');

      // Visual defeat styling & shake
      bodyEl.style.backgroundColor = '#b83232';
      triggerShake();

      // Disable inputs and prompt restart
      guessEl.disabled = true;
      checkBtn.disabled = true;
      againBtn.classList.add('pulse-btn');

      // Play defeat sound
      playDefeatSound();
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

  guessEl.disabled = false;
  checkBtn.disabled = false;

  bodyEl.style.backgroundColor = '#222';
  bodyEl.classList.remove('shake');
  againBtn.classList.remove('pulse-btn');
  numberEl.classList.remove('expanded');
  numberEl.style.width = '';

  guessEl.focus();
};

// Event Listeners
checkBtn.addEventListener('click', checkGuess);
againBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    if (e.target.tagName === 'BUTTON' || guessEl.disabled) return;
    checkGuess();
  }
});

