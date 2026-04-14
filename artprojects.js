// =========================
// STATE
// =========================

let activeProjects = new Set(['allprojects']);
let activeTypes = new Set(['alltypes']);


// =========================
// URL PARSING + UPDATE (no scroll)
// =========================

function parseHash() {
  const full = window.location.hash.slice(1);
  const [route, query] = full.split('?');
  const params = new URLSearchParams(query || '');

  return {
    route: route || 'intro',
    projects: params.get('project') ? params.get('project').split(',') : null,
    types: params.get('type') ? params.get('type').split(',') : null
  };
}

function updateURL(route) {
  const params = new URLSearchParams();

  if (!activeProjects.has('allprojects')) {
    params.set('project', [...activeProjects].join(','));
  }
  if (!activeTypes.has('alltypes')) {
    params.set('type', [...activeTypes].join(','));
  }

  const query = params.toString();
  const newHash = query ? `${route}?${query}` : route;
  const newUrl = '#' + newHash;

  // Use History API to change hash WITHOUT scrolling to the element
  if (history.replaceState) {
    history.replaceState(null, '', newUrl);
  } else {
    // Fallback for very old browsers
    window.location.hash = newHash;
  }
}


// =========================
// ROUTER
// =========================

function showSection(id) {
  const target = document.getElementById(id);
  if (!target || !target.classList.contains('projectdisplay')) return;

  document.querySelectorAll('.projectdisplay').forEach(section => {
    section.classList.remove('visible');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  target.classList.add('visible');

  const activeLink = document.querySelector(`.nav-link[data-target="${id}"]`);
  if (activeLink) activeLink.classList.add('active');
}

function handleRoute() {
  const { route, projects, types } = parseHash();

  // Apply filters from URL
  if (projects) {
    activeProjects = new Set(projects);
  } else {
    activeProjects = new Set(['allprojects']);
  }

  if (types) {
    activeTypes = new Set(types);
  } else {
    activeTypes = new Set(['alltypes']);
  }

  syncButtonStates('#projectoptions .project', activeProjects);
  syncButtonStates('#typeoptions .type', activeTypes);

  updateFilters();
  showSection(route);
}


// =========================
// NAVIGATION
// =========================

function setupNavLinks() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (!link) return;

    const targetId = link.dataset.target;
    if (!targetId) return;

    e.preventDefault();
    updateURL(targetId);
    handleRoute();          // Show the new section immediately
  });
}


// =========================
// FILTER SYSTEM
// =========================

function updateFilters() {
  document.querySelectorAll('#art .nav-link').forEach(link => {
    const linkProject = link.dataset.project ? link.dataset.project.split(',') : [];
    const linkType = link.dataset.type ? link.dataset.type.split(',') : [];

    const projectMatch = activeProjects.has('allprojects') ||
                         linkProject.some(p => activeProjects.has(p));

    const typeMatch = activeTypes.has('alltypes') ||
                      linkType.some(t => activeTypes.has(t));

    const visible = projectMatch && typeMatch;

    link.style.display = visible ? 'flex' : 'none';

    if (!visible && link.classList.contains('active')) {
      updateURL('intro');
    }
  });

  // Hide empty year groups
  document.querySelectorAll('#art .topdown').forEach(div => {
    const anyVisible = [...div.querySelectorAll('.nav-link')]
      .some(link => link.style.display !== 'none');

    const heading = div.previousElementSibling;

    div.style.display = anyVisible ? 'flex' : 'none';
    if (heading && heading.tagName === 'P') {
      heading.style.display = anyVisible ? 'flex' : 'none';
    }
  });
}


// =========================
// FILTER BUTTONS
// =========================

function setupFilterButtons() {
  document.querySelectorAll('#projectoptions .project').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;

      if (tag === 'allprojects') {
        activeProjects = new Set(['allprojects']);
      } else {
        activeProjects.delete('allprojects');
        if (activeProjects.has(tag)) {
          activeProjects.delete(tag);
          if (activeProjects.size === 0) activeProjects.add('allprojects');
        } else {
          activeProjects.add(tag);
        }
      }

      syncButtonStates('#projectoptions .project', activeProjects);
      updateFilters();
      updateURL(parseHash().route);
    });
  });

  document.querySelectorAll('#typeoptions .type').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;

      if (tag === 'alltypes') {
        activeTypes = new Set(['alltypes']);
      } else {
        activeTypes.delete('alltypes');
        if (activeTypes.has(tag)) {
          activeTypes.delete(tag);
          if (activeTypes.size === 0) activeTypes.add('alltypes');
        } else {
          activeTypes.add(tag);
        }
      }

      syncButtonStates('#typeoptions .type', activeTypes);
      updateFilters();
      updateURL(parseHash().route);
    });
  });
}


// =========================
// BUTTON STATE SYNC
// =========================

function syncButtonStates(selector, activeSet) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.classList.toggle('active', activeSet.has(btn.dataset.tag));
  });
}


// =========================
// INIT
// =========================

function init() {
  setupNavLinks();
  setupFilterButtons();
  handleRoute();   // initial load
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}