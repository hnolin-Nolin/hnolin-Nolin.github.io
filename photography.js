let zoomed = false;

// ======= overlay =======

function openPhoto(el) {
  // set the overlay image to the full res version and show it
  document.getElementById('overlay-img').src = el.dataset.full;
  document.getElementById('overlay').classList.add('visible');
}

function closePhoto() {
  // hide the overlay and reset zoom
  document.getElementById('overlay').classList.remove('visible');
  resetZoom();
}

// ======= zoom =======

function toggleZoom(e) {
  e.stopPropagation(); // prevent click from bubbling up to overlay and closing it
  const img = document.getElementById('overlay-img');
  if (zoomed) {
    resetZoom();
  } else {
    // zoom into wherever the user clicked
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

// close overlay with escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePhoto();
});

// ======= shuffle =======

function shufflePhotos() {
  const grid = document.getElementById('photogrid');
  const thumbs = [...grid.querySelectorAll('.thumb')];
  // fisher-yates shuffle
  for (let i = thumbs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    grid.appendChild(thumbs[j]);
    thumbs.splice(j, 1);
  }
}

// ======= pagination =======

const photosPerPage = 24;
let currentPage = 1;

function initPagination() {
  // shuffle before pagination runs so order is different each visit
  shufflePhotos();

  const thumbs = document.querySelectorAll('.thumb');
  const totalPages = Math.ceil(thumbs.length / photosPerPage);

  // show the first page on load
  showPage(1);

  // build the pagination controls and append to photocontainer
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

  updatePaginationUI(totalPages);
}

function showPage(page) {
  const thumbs = document.querySelectorAll('.thumb');
  const totalPages = Math.ceil(thumbs.length / photosPerPage);

  // clamp page number so it cant go below 1 or above totalPages
  currentPage = Math.max(1, Math.min(page, totalPages));

  // show only the thumbs that belong to the current page
  thumbs.forEach((thumb, i) => {
    const start = (currentPage - 1) * photosPerPage;
    const end = start + photosPerPage;
    thumb.style.display = (i >= start && i < end) ? 'block' : 'none';
  });

  updatePaginationUI(totalPages);
}

function changePage(page) {
  showPage(page);
}

function updatePaginationUI(totalPages) {
  // update the page label
  const label = document.getElementById('page-label');
  if (label) label.textContent = `${currentPage} / ${totalPages}`;

  // disable prev/next buttons at the boundaries
  const prev = document.querySelector('#pagination button:first-child');
  const next = document.querySelector('#pagination button:last-child');
  if (prev) prev.disabled = currentPage === 1;
  if (next) next.disabled = currentPage === totalPages;
}

// initialise pagination once the page has fully loaded
document.addEventListener('DOMContentLoaded', initPagination);