function makeEl(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

async function loadAndRender() {
  try {
    const res = await fetch('videos.json', {cache:"no-store"});
    if(!res.ok) throw new Error(`Failed to load videos.json (${res.status})`);
    const data = await res.json();
    setupFeatured(data.featured || null);
    setupPlaylists(data.playlists || []);
  } catch(err) {
    console.error('Error loading videos.json:', err);
    document.getElementById('playlists-container').innerHTML =
      `<p style="color:#faa;padding:20px">Could not load videos.json — check console for details.</p>`;
  }
}

function setupFeatured(f) {
  const section = document.getElementById('featured');
  const titleEl = document.getElementById('featured-title');
  const playBtn = document.getElementById('featured-play');
  const imgEl = document.getElementById('featured-img');

  if(!f || !f.id){ section.style.display='none'; return; }

  titleEl.textContent = f.title || 'Featured';
  imgEl.src = f.thumbnailBase ? f.thumbnailBase+'/hqdefault.jpg' : `https://img.youtube.com/vi/${f.id}/hqdefault.jpg`;

  section.onclick = () => openPlayer(f.id);
  playBtn.onclick = e => { e.stopPropagation(); openPlayer(f.id); };
}

function setupPlaylists(playlists) {
  const container = document.getElementById('playlists-container');
  container.innerHTML = '';

  playlists.forEach((pl, idx) => {
    const plWrap = makeEl('section','playlist');
    const title = makeEl('h3'); title.textContent = pl.name || `Playlist ${idx+1}`;
    plWrap.appendChild(title);

    const row = makeEl('div','row');
    const left = makeEl('div','arrow left-arrow'); left.innerHTML='&#10094;'; left.dataset.index=idx;
    const right = makeEl('div','arrow right-arrow'); right.innerHTML='&#10095;'; right.dataset.index=idx;
    const inner = makeEl('div','row-inner'); inner.id=`row-${idx}`;

    row.appendChild(left);
    row.appendChild(inner);
    row.appendChild(right);
    plWrap.appendChild(row);
    container.appendChild(plWrap);

    (pl.videos||[]).forEach(video => {
      const card = makeEl('div','card');
      const img = makeEl('img');
      const titleEl = makeEl('div','card-title'); titleEl.textContent = video.title||'';
      img.src = video.thumbBase ? video.thumbBase+'/hqdefault.jpg' : `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
      img.onerror = () => { img.src=`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; };
      card.appendChild(img);
      if(titleEl.textContent) card.appendChild(titleEl);
      card.onclick = () => openPlayer(video.id);
      inner.appendChild(card);
    });
  });

  document.querySelectorAll('.arrow').forEach(arrow => {
    arrow.onclick = e => {
      const idx = e.currentTarget.dataset.index;
      const inner = document.getElementById(`row-${idx}`);
      const amount = Math.round(inner.clientWidth * 0.7) * (e.currentTarget.classList.contains('right-arrow')?1:-1);
      inner.scrollBy({left: amount, behavior:'smooth'});
    };
  });
}

// Player modal
const modal = document.getElementById('playerModal');
const player = document.getElementById('ytplayer');
const closeBtn = document.getElementById('closeBtn');
function openPlayer(id){ if(!id) return; player.src=`https://www.youtube.com/embed/${id}?autoplay=1`; modal.style.display='flex'; modal.setAttribute('aria-hidden','false'); }
function closePlayer(){ modal.style.display='none'; player.src=''; modal.setAttribute('aria-hidden','true'); }
closeBtn.onclick = closePlayer;
modal.onclick = e => { if(e.target === modal) closePlayer(); };

loadAndRender();