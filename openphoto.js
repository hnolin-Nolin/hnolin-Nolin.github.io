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

let zoomed = false;

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