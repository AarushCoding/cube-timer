let timerInterval;
let startTime;
let running = false;
let solves = [];

const timerDisplay = document.getElementById('timer');
const scrambleDisplay = document.getElementById('scramble');
const solveListDisplay = document.getElementById('solve-list');
const eventSelect = document.getElementById('event-select');

// Simple Scramble Generator
function generateScramble() {
    const moves = ["U", "D", "L", "R", "F", "B"];
    const modifiers = ["", "'", "2"];
    let scramble = [];
    let lastMove = "";

    for (let i = 0; i < 20; i++) {
        let move = moves[Math.floor(Math.random() * moves.length)];
        while (move === lastMove) move = moves[Math.floor(Math.random() * moves.length)];
        scramble.push(move + modifiers[Math.floor(Math.random() * modifiers.length)]);
        lastMove = move;
    }
    scrambleDisplay.innerText = scramble.join(" ");
}

// Timer Logic
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const time = (Date.now() - startTime) / 1000;
        timerDisplay.innerText = time.toFixed(2);
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
    const finalTime = timerDisplay.innerText;
    solves.unshift(finalTime);
    updateSolveList();
    generateScramble();
}

function updateSolveList() {
    solveListDisplay.innerHTML = solves
        .map((s, i) => `<div class="solve-item">#${solves.length - i}: <strong>${s}</strong></div>`)
        .join("");
}

// Handle Inputs
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!running) {
            timerDisplay.style.color = "#ff5252"; // Red when ready
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        if (!running) {
            timerDisplay.style.color = "var(--accent-color)";
            startTimer();
            running = true;
        } else {
            stopTimer();
            running = false;
        }
    }
});

// Init
generateScramble();
