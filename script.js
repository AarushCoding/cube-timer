let database = {};

// Load the JSON data
async function initApp() {
    try {
        const response = await fetch('algs.json');
        database = await response.json();
        console.log("Database Loaded");
    } catch (error) {
        console.error("Error loading algorithms:", error);
    }
}

function openSet(category) {
    const home = document.getElementById('home-view');
    const setView = document.getElementById('set-view');
    const list = document.getElementById('alg-full-list');
    const title = document.getElementById('view-title');

    title.innerText = category.replace('_', ' ').toUpperCase();
    
    // Generate the rows
    list.innerHTML = database[category].map(item => `
        <div class="alg-row">
            <div class="alg-name">${item.name}</div>
            <div class="alg-moves">${item.alg}</div>
            <div class="alg-setup">Setup: ${item.setup}</div>
        </div>
    `).join("");

    home.classList.add('hidden');
    setView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function showHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('set-view').classList.add('hidden');
    document.getElementById('view-title').innerText = "Algorithm Library";
}

// Search Functionality
function filterAlgs() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.alg-row');
    
    rows.forEach(row => {
        const name = row.querySelector('.alg-name').innerText.toLowerCase();
        row.style.display = name.includes(input) ? "grid" : "none";
    });
}

// Start the app
initApp();
