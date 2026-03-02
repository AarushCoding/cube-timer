let database = {};

// 1. Fetch the massive JSON file
fetch('algs.json')
    .then(response => response.json())
    .then(data => {
        database = data;
    })
    .catch(error => console.error('Error loading algorithms:', error));

// 2. Open a specific set (F2L, OLL, etc.)
function openSet(category) {
    const home = document.getElementById('home-view');
    const setView = document.getElementById('set-view');
    const list = document.getElementById('alg-full-list');
    const title = document.getElementById('view-title');
    const searchInput = document.getElementById('search-input');

    // Clear search input when opening a new set
    if (searchInput) searchInput.value = '';

    const categoryData = database[category];
    if (!categoryData) return;

    title.innerText = category.replace('_', ' ').toUpperCase();
    
    // Extract the smart config
    const config = categoryData.viewConfig || "view=plan";
    const stage = categoryData.stage || "";
    const cases = categoryData.cases;

    // Map through the cases and build the HTML
    list.innerHTML = cases.map(item => {
        // Build the VisualCube API URL
        // stage=f2l or stage=oll highlights the relevant pieces
        const cubeParams = `fmt=svg&size=150&bg=t&sch=black,white,orange,red,green,blue&stage=${stage}&${config}&case=${encodeURIComponent(item.setup)}`;
        const cubeUrl = `http://visualcube.hk/visualcube.php?${cubeParams}`;

        return `
            <div class="alg-row" data-name="${item.name.toLowerCase()}">
                <div class="alg-img">
                    <img src="${cubeUrl}" alt="${item.name}" loading="lazy">
                </div>
                <div class="alg-info">
                    <div class="alg-name">${item.name}</div>
                    <div class="alg-moves">${item.alg}</div>
                    <div class="alg-setup">Setup: ${item.setup}</div>
                </div>
                <button class="copy-btn" onclick="copyToClipboard('${item.alg}')">Copy</button>
            </div>
        `;
    }).join("");

    home.classList.add('hidden');
    setView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// 3. Search / Filter Logic
function filterAlgs() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.alg-row');

    rows.forEach(row => {
        const name = row.getAttribute('data-name');
        if (name.includes(query)) {
            row.style.display = 'grid';
        } else {
            row.style.display = 'none';
        }
    });
}

// 4. Utility Functions
function showHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('set-view').classList.add('hidden');
    document.getElementById('view-title').innerText = "Algorithm Library";
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Algorithm copied!');
    });
}
