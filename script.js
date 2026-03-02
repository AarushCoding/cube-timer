let database = {};
let isDataLoaded = false;

// 1. Fetch the JSON file
fetch('algs.json')
    .then(response => {
        if (!response.ok) throw new Error("JSON not found");
        return response.json();
    })
    .then(data => {
        database = data;
        isDataLoaded = true;
        console.log("Cube.app data ready.");
    })
    .catch(error => console.error('Error:', error));

// 2. Open Category
function openSet(category) {
    if (!isDataLoaded) return;

    const home = document.getElementById('home-view');
    const setView = document.getElementById('set-view');
    const list = document.getElementById('alg-full-list');
    const title = document.getElementById('view-title');

    const categoryData = database[category];
    if (!categoryData || !categoryData.cases) return;

    title.innerText = category.replace('_', ' ').toUpperCase();
    
    // Get settings for this specific set
    const config = categoryData.viewConfig || "view=plan";
    const stage = categoryData.stage || "";
    const cases = categoryData.cases;

    // 3. Generate HTML
    list.innerHTML = cases.map(item => {
        // Build a stable VisualCube URL
        // We use 'stage' to highlight only relevant pieces (e.g., top layer for OLL)
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

// 4. Search Filter
function filterAlgs() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.alg-row');

    rows.forEach(row => {
        const name = row.getAttribute('data-name');
        row.style.display = name.includes(query) ? 'grid' : 'none';
    });
}

// 5. Navigation
function showHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('set-view').classList.add('hidden');
    document.getElementById('view-title').innerText = "CUBE.APP";
}

// 6. Copy with Button Feedback
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "SAVED";
        btn.style.borderColor = "#2ecc71";
        btn.style.color = "#2ecc71";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.borderColor = "";
            btn.style.color = "";
        }, 1000);
    });
}
