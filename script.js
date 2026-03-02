let database = {};
let isDataLoaded = false;

// 1. Fetch the JSON file
fetch('algs.json')
    .then(response => {
        if (!response.ok) throw new Error("Failed to load algs.json");
        return response.json();
    })
    .then(data => {
        database = data;
        isDataLoaded = true;
        console.log("Cube data loaded successfully.");
    })
    .catch(error => {
        console.error('Error loading algorithms:', error);
    });

// 2. Open a specific set (F2L, OLL, etc.)
function openSet(category) {
    if (!isDataLoaded) return;

    const home = document.getElementById('home-view');
    const setView = document.getElementById('set-view');
    const list = document.getElementById('alg-full-list');
    const title = document.getElementById('view-title');
    const searchInput = document.getElementById('search-input');

    if (searchInput) searchInput.value = '';

    const categoryData = database[category];
    
    // FIX: We must check for categoryData.cases because the JSON structure changed
    if (!categoryData || !categoryData.cases) {
        console.error("Invalid category or missing 'cases' array:", category);
        return;
    }

    title.innerText = category.replace('_', ' ').toUpperCase();
    
    const config = categoryData.viewConfig || "view=plan";
    const stage = categoryData.stage || "";
    const cases = categoryData.cases; // This is the actual array we need to map

    // 3. Map through the 'cases' array
    list.innerHTML = cases.map(item => {
        const cubeParams = `fmt=svg&size=150&bg=t&sch=black,white,orange,red,green,blue&stage=${stage}&${config}&case=${encodeURIComponent(item.setup)}`;
        const cubeUrl = `http://visualcube.hk/visualcube.php?${cubeParams}`;

        return `
            <div class="alg-row" data-name="${item.name.toLowerCase()}">
                <div class="alg-img">
                    <img src="${cubeUrl}" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Cube'">
                </div>
                <div class="alg-info">
                    <div class="alg-name">${item.name}</div>
                    <div class="alg-moves">${item.alg}</div>
                    <div class="alg-setup">Setup: ${item.setup}</div>
                </div>
                <button class="copy-btn" onclick="copyToClipboard('${item.alg.replace(/'/g, "\\'")}')">Copy</button>
            </div>
        `;
    }).join("");

    home.classList.add('hidden');
    setView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// 4. Search / Filter Logic
function filterAlgs() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.alg-row');

    rows.forEach(row => {
        const name = row.getAttribute('data-name');
        row.style.display = name.includes(query) ? 'grid' : 'none';
    });
}

// 5. Navigation & Utils
function showHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('set-view').classList.add('hidden');
    document.getElementById('view-title').innerText = "Algorithm Library";
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Find the button that was clicked using the event
        const btn = window.event.target;
        const originalText = btn.innerText;
        btn.innerText = "Saved!";
        setTimeout(() => { btn.innerText = originalText; }, 1500);
    });
}
