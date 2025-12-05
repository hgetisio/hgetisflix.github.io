// Load playlists
fetch("videos.json")
    .then(res => res.json())
    .then(data => {
        setupFeatured(data.featured);
        setupPlaylists(data.playlists);
    });

// -----------------------------
// Featured Section
// -----------------------------
function setupFeatured(featured) {
    const section = document.getElementById("featured");
    const title = document.getElementById("featured-title");

    section.style.backgroundImage = `url(${featured.thumbnail})`;
    title.textContent = featured.title;

    section.onclick = () => openPlayer(featured.id);
}

// -----------------------------
// Playlist Rows
// -----------------------------
function setupPlaylists(playlists) {
    const container = document.getElementById("playlists-container");

    playlists.forEach((pl, index) => {
        const playlistDiv = document.createElement("div");
        playlistDiv.className = "playlist";

        playlistDiv.innerHTML = `
            <h3>${pl.name}</h3>
            <div class="row">
                <div class="arrow left-arrow" data-index="${index}">&#10094;</div>
                <div class="row-inner" id="row-${index}"></div>
                <div class="arrow right-arrow" data-index="${index}">&#10095;</div>
            </div>
        `;

        container.appendChild(playlistDiv);

        const row = document.getElementById(`row-${index}`);

        pl.videos.forEach(video => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `<img src="${video.thumb}" alt="">`;
            card.onclick = () => openPlayer(video.id);

            row.appendChild(card);
        });
    });

    setupArrows();
}

// -----------------------------
// Arrow Scroll Logic
// -----------------------------
function setupArrows() {
    const arrows = document.querySelectorAll(".arrow");

    arrows.forEach(arrow => {
        arrow.onclick = () => {
            const idx = arrow.getAttribute("data-index");
            const row = document.getElementById(`row-${idx}`);
            const direction = arrow.classList.contains("right-arrow") ? 1 : -1;
            const scrollAmount = 220 * direction;

            row.scrollBy({
                left: scrollAmount,
                behavior: "smooth"
            });
        };
    });
}

// -----------------------------
// Modal Player
// -----------------------------
const modal = document.getElementById("playerModal");
const closeBtn = document.getElementById("closeBtn");
const player = document.getElementById("ytplayer");

function openPlayer(id) {
    player.src = `https://www.youtube.com/embed/${id}`;
    modal.style.display = "flex";
}

closeBtn.onclick = () => closePlayer();
modal.onclick = e => { if (e.target === modal) closePlayer(); };

function closePlayer() {
    modal.style.display = "none";
    player.src = "";
}