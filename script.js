let timerInterval;
let startTime;
let running = false;
let solves = JSON.parse(localStorage.getItem('cubesolves')) || [];

const timerDisplay = document.getElementById('timer');
const scrambleDisplay = document.getElementById('scramble');
const solveListDisplay = document.getElementById('solve-list');
const eventSelect = document.getElementById('event-select');

// 1. Scramble Logic per Event
const scrambleRules = {
    "333": { moves: ["U", "D", "L", "R", "F", "B"], length: 20 },
    "222": { moves: ["U", "R", "F"], length: 9 },
    "444": { moves: ["U", "D", "L", "R", "F", "B", "Uw", "Dw", "Lw", "Rw", "Fw", "Bw"], length: 40 },
    "pyram": { moves: ["U", "L", "R", "B"], length: 12, tips: ["u", "l", "r", "b"] }
};

function generateScramble() {
    const event = eventSelect.value;
    const rules = scrambleRules[event];
    let scramble = [];
    let lastMove = "";

    for (let i = 0; i < rules.length; i++) {
        let move = rules.moves[Math.floor(Math.random() * rules.moves.length)];
        while (move[0] === lastMove[0]) {
            move = rules.moves[Math.floor(Math.random() * rules.moves.length)];
        }
        const mod = ["", "'", "2"][Math.floor(Math.random() * 3)];
        scramble.push(move + mod);
        lastMove = move;
    }

    if (event === "pyram") {
        rules.tips.forEach(tip => {
            if (Math.random() > 0.5) {
                const mod = Math.random() > 0.5 ? "" : "'";
                scramble.push(tip + mod);
            }
        });
    }

    scrambleDisplay.innerText = scramble.join(" ");
}

// 2. Storage Options
function saveSolves() {
    localStorage.setItem('cubesolves', JSON.stringify(solves));
    updateUI();
}

function updateUI() {
    solveListDisplay.innerHTML = solves.map((s, i) => `
        <div class="solve-item">
            <span>#${solves.length - i}</span>
            <strong>${s}</strong>
        </div>
    `).join("");
    // Calculate Averages (Simplified for demo)
    document.getElementById('ao5').innerText = calculateAverage(5);
    document.getElementById('ao12').innerText = calculateAverage(12);
}

function calculateAverage(n) {
    if (solves.length < n) return "N/A";
    const lastN = solves.slice(0, n).map(parseFloat);
    lastN.sort((a, b) => a - b);
    lastN.pop(); lastN.shift(); // Remove best/worst
    const sum = lastN.reduce((a, b) => a + b, 0);
    return (sum / (n - 2)).toFixed(2);
}

// 3. Timer Controls
function toggleTimer() {
    if (!running) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            timerDisplay.innerText = ((Date.now() - startTime) / 1000).toFixed(2);
        }, 10);
        running = true;
    } else {
        clearInterval(timerInterval);
        solves.unshift(timerDisplay.innerText);
        saveSolves();
        generateScramble();
        running = false;
    }
}

// Inputs
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!running) timerDisplay.style.color = "var(--error)";
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        timerDisplay.style.color = "white";
        toggleTimer();
    }
});

document.getElementById('clear-btn').onclick = () => {
    if(confirm("Delete all solves?")) {
        solves = [];
        saveSolves();
    }
};

eventSelect.onchange = generateScramble;
generateScramble();
updateUI();
