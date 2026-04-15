let zoomed = false;

// ======= overlay =======

function openPhoto(el) {
  document.getElementById('overlay-img').src = el.dataset.full;
  document.getElementById('overlay').classList.add('visible');
}

function closePhoto() {
  document.getElementById('overlay').classList.remove('visible');
  resetZoom();
}

// ======= zoom =======

function toggleZoom(e) {
  e.stopPropagation();
  const img = document.getElementById('overlay-img');
  if (zoomed) {
    resetZoom();
  } else {
    img.style.transform = 'scale(2)';
    img.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;
    img.style.cursor = 'zoom-out';
    zoomed = true;
  }
}

function resetZoom() {
  const img = document.getElementById('overlay-img');
  img.style.transform = 'scale(1)';
  img.style.cursor = 'zoom-in';
  zoomed = false;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePhoto();
});

// ======= shuffle =======

function shufflePhotos() {
  const grid = document.getElementById('photogrid');
  const thumbs = [...grid.querySelectorAll('.thumb')];
  for (let i = thumbs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    grid.appendChild(thumbs[j]);
    thumbs.splice(j, 1);
  }
}

// ======= pagination =======

let currentPage = 1;

function getPhotosPerPage() {
  if (window.matchMedia('(max-width: 768px)').matches) return 2;
  return 24;
}

function initPagination() {
  shufflePhotos();

  showPage(1);

  const controls = document.createElement('div');
  controls.id = 'pagination';

  const prev = document.createElement('button');
  prev.textContent = '←';
  prev.onclick = () => changePage(currentPage - 1);

  const pageLabel = document.createElement('span');
  pageLabel.id = 'page-label';

  const next = document.createElement('button');
  next.textContent = '→';
  next.onclick = () => changePage(currentPage + 1);

  controls.appendChild(prev);
  controls.appendChild(pageLabel);
  controls.appendChild(next);
  document.getElementById('photocontainer').appendChild(controls);

  updatePaginationUI();
}

function showPage(page) {
  const thumbs = document.querySelectorAll('.thumb');
  const photosPerPage = getPhotosPerPage();
  const totalPages = Math.ceil(thumbs.length / photosPerPage);

  currentPage = Math.max(1, Math.min(page, totalPages));

  thumbs.forEach((thumb, i) => {
    const start = (currentPage - 1) * photosPerPage;
    const end = start + photosPerPage;
    thumb.style.display = (i >= start && i < end) ? 'block' : 'none';
  });

  updatePaginationUI();
}

function changePage(page) {
  showPage(page);
}

function updatePaginationUI() {
  const thumbs = document.querySelectorAll('.thumb');
  const totalPages = Math.ceil(thumbs.length / getPhotosPerPage());

  const label = document.getElementById('page-label');
  if (label) label.textContent = `${currentPage} / ${totalPages}`;

  const prev = document.querySelector('#pagination button:first-child');
  const next = document.querySelector('#pagination button:last-child');
  if (prev) prev.disabled = currentPage === 1;
  if (next) next.disabled = currentPage === totalPages;
}

window.addEventListener('resize', () => showPage(currentPage));

document.addEventListener('DOMContentLoaded', initPagination);