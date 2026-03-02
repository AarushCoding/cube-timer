const database = {
    pll: [
        { name: "T-Perm", alg: "R U R' U' R' F R2 U' R' U' R U R' F'", setup: "R2 U R U R' U' R' U' R' U R'" },
        { name: "Y-Perm", alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", setup: "F R' F' R U R U' R' F R U' R' U' R U R' F'" },
        { name: "Ua-Perm", alg: "M2 U M U2 M' U M2", setup: "M2 U' M U2 M' U' M2" },
        { name: "Ub-Perm", alg: "M2 U' M U2 M' U' M2", setup: "M2 U M U2 M' U M2" },
        { name: "H-Perm", alg: "M2 U M2 U2 M2 U M2", setup: "M2 U M2 U2 M2 U M2" },
        { name: "Z-Perm", alg: "M' U M2 U M2 U M' U2 M2", setup: "M2 U2 M' U' M2 U' M2 U' M'" }
    ],
    oll: [
        { name: "Sune", alg: "R U R' U R U2 R'", setup: "R U2 R' U' R U' R'" },
        { name: "Anti-Sune", alg: "R U2 R' U' R U' R'", setup: "R U R' U R U2 R'" }
    ],
    f2l: [
        { name: "Case 1", alg: "U R U' R'", setup: "R U R' U'" }
    ]
};

function openSet(category) {
    const home = document.getElementById('home-view');
    const setView = document.getElementById('set-view');
    const list = document.getElementById('alg-full-list');
    const title = document.getElementById('view-title');

    title.innerText = category.toUpperCase() + " SET";
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
