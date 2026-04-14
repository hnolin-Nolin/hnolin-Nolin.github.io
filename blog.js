async function loadPostsFromXML() {
  const blogposts = document.getElementById("blogposts");
  let i = 1;
  const posts = [];

  // Keep fetching post1.xml, post2.xml, etc. until one doesn't exist
  while (true) {
    const response = await fetch(`blog/post${i}.xml`);
    if (!response.ok) break;

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    // Pull data out of the XML tags
    const title = xml.querySelector("title")?.textContent.trim() ?? "";
    const dateRaw = xml.querySelector("date")?.textContent.trim() ?? "";
    const tags = [...xml.querySelectorAll("tags tag")].map(t => t.textContent.trim());
    const body = xml.querySelector("body")?.textContent.trim() ?? "";

    // Build both date formats: short for the header, long for the meta
    const dateObj = new Date(dateRaw + "T00:00:00"); // T00:00:00 prevents timezone off-by-one
    const shortDate = `${dateObj.getMonth() + 1}-${dateObj.getDate()}-${String(dateObj.getFullYear()).slice(2)}`;
    const longDate = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // Split body into paragraphs on blank lines
    const bodyParagraphs = body
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean);

    posts.push({ title, dateRaw, dateObj, shortDate, longDate, tags, bodyParagraphs });
    i++;
  }

  buildTagButtons(posts);
  renderPosts(posts);
  setupFilters(posts);
}

function buildTagButtons(posts) {
  const tagOptions = document.getElementById("tagOptions");
  const tagCount = {};

  // Count how many posts each tag appears in
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1;
    }
  }

  // Replace placeholder buttons with real ones generated from the posts
  tagOptions.innerHTML = "";
  for (const [tag, count] of Object.entries(tagCount)) {
    const btn = document.createElement("button");
    btn.className = "tag";
    btn.dataset.tag = tag;
    btn.textContent = `${tag} (${count})`;

    // Toggle active state on click and re-filter
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      applyFilters(posts);
    });
    tagOptions.appendChild(btn);
  }
}

// Wraps any occurrence of the search query in <mark> tags for highlighting
function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape special regex characters
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}

function renderPosts(posts, searchQuery = "", activeTags = [], startDate = null, endDate = null) {
  const blogposts = document.getElementById("blogposts");
  blogposts.innerHTML = "";

  for (const post of posts) {
    // Skip post if it doesn't have every active tag
    if (activeTags.length > 0 && !activeTags.every(t => post.tags.includes(t))) continue;

    // Skip post if it falls outside the selected date range
    const postTime = post.dateObj.getTime();
    if (startDate && endDate) {
      if (postTime < startDate.getTime() || postTime > endDate.getTime()) continue;
    } else if (startDate) {
      if (postTime !== startDate.getTime()) continue;
    } else if (endDate) {
      if (postTime !== endDate.getTime()) continue;
    }

    // Skip post if the search query isn't found in the title or body
    const lowerQuery = searchQuery.toLowerCase();
    if (lowerQuery) {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const bodyMatch = post.bodyParagraphs.some(p => p.toLowerCase().includes(lowerQuery));
      if (!titleMatch && !bodyMatch) continue;
    }

    // Build tag elements for the post meta section
    const tagsJoined = post.tags.join(", ");
    const tagsSpans = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join("\n");

    // Wrap each paragraph in <p> tags and highlight search matches
    const bodyHTML = post.bodyParagraphs
      .map(p => `<p>${highlight(p, searchQuery)}</p>`)
      .join("\n");

    const article = document.createElement("article");
    article.className = "post";
    article.innerHTML = `
      <div class="post-header">
        <div class="left">
          <p class="post-title">${highlight(post.title, searchQuery)}</p>
          <p class="header-tags small">${tagsJoined}</p>
        </div>
        <p class="header-date small">${post.shortDate}</p>
      </div>
      <div class="post-meta">
        <time class="post-date">${post.longDate}</time>
        <div class="post-tags">
          ${tagsSpans}
        </div>
      </div>
      <div class="post-body">
        ${bodyHTML}
      </div>
    `;

    blogposts.appendChild(article);
  }
}

// Reads current filter values from the DOM and re-renders posts
function applyFilters(posts) {
  const searchQuery = document.getElementById("searchInput").value.trim();

  const activeTags = [...document.querySelectorAll("#tagOptions .tag.active")]
    .map(btn => btn.dataset.tag);

  const startRaw = document.getElementById("startDate").value;
  const endRaw = document.getElementById("endDate").value;
  const startDate = startRaw ? new Date(startRaw + "T00:00:00") : null;
  const endDate = endRaw ? new Date(endRaw + "T00:00:00") : null;

  renderPosts(posts, searchQuery, activeTags, startDate, endDate);
}

// Attach event listeners to all filter inputs
function setupFilters(posts) {
  document.getElementById("searchInput").addEventListener("input", () => applyFilters(posts));
  document.getElementById("startDate").addEventListener("change", () => applyFilters(posts));
  document.getElementById("endDate").addEventListener("change", () => applyFilters(posts));
}

loadPostsFromXML();