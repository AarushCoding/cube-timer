let database = {};
let isDataLoaded = false;

fetch('algs.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        isDataLoaded = true;
    });

function openSet(category) {
    if (!isDataLoaded) return;

    const list = document.getElementById('alg-full-list');
    const categoryData = database[category];
    
    if (!categoryData) return;

    document.getElementById('view-title').innerText = category.toUpperCase();
    
    // Use a simpler API URL construction to prevent breaking
    const config = categoryData.viewConfig || "view=plan";
    const stage = categoryData.stage || "";

    list.innerHTML = categoryData.cases.map(item => {
        // Build URL: removed complex coloring to test stability first
        const baseUrl = "http://visualcube.hk/visualcube.php";
        const params = `fmt=svg&size=200&bg=t&${config}&stage=${stage}&case=${encodeURIComponent(item.setup)}`;
        const cubeUrl = `${baseUrl}?${params}`;

        return `
            <div class="alg-row" data-name="${item.name.toLowerCase()}">
                <div class="alg-img">
                    <img src="${cubeUrl}" alt="cube" loading="lazy">
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

    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('set-view').classList.remove('hidden');
    window.scrollTo(0, 0);
}

function filterAlgs() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.alg-row');
    rows.forEach(row => {
        row.style.display = row.dataset.name.includes(query) ? 'grid' : 'none';
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const btn = event.target;
    btn.innerText = "COPIED";
    setTimeout(() => btn.innerText = "COPY", 1000);
}

function showHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('set-view').classList.add('hidden');
}
