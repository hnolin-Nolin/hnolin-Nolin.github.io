// DOM references
const tagList = document.getElementById('tag-list');
const xmlOut = document.getElementById('xml-out');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const numInput = document.getElementById('f-num');
const filenamePreview = document.getElementById('filename-preview');

// Returns the filename based on the current post number input
function getFilename() {
  const n = parseInt(numInput.value) || 1;
  return `post${n}.xml`;
}

// Creates a new tag input row and appends it to the tag list
function addTag(value = '') {
  const row = document.createElement('div');
  row.className = 'tag-row';

  const inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = 'tag name';
  inp.value = value;
  inp.addEventListener('input', generate);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'remove-btn';
  btn.textContent = 'remove';
  // Remove this row from the DOM and regenerate the XML when clicked
  btn.addEventListener('click', () => { row.remove(); generate(); });

  row.append(inp, btn);
  tagList.appendChild(row);
  inp.focus();
  generate();
}

// Escapes special characters so they are safe to embed in XML
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Reads all form fields and builds the XML string, then updates the output textarea
function generate() {
  const title = escapeXml(document.getElementById('f-title').value.trim());
  const date = document.getElementById('f-date').value || '';
  const tags = [...tagList.querySelectorAll('input')]
    .map(i => i.value.trim()).filter(Boolean);
  const body = document.getElementById('f-body').value;

  // Build the <tags> block from however many tag inputs exist
  const tagsXml = tags.map(t => `    <tag>${escapeXml(t)}</tag>`).join('\n');

  // Body goes inside CDATA so special characters don't need escaping
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<post>
  <title>${title}</title>
  <date>${date}</date>
  <tags>
${tagsXml}
  </tags>
  <body><![CDATA[
    ${body}
  ]]></body>
</post>`;

  xmlOut.value = xml;
  filenamePreview.textContent = `file will be saved as ${getFilename()}`;
}

// Event listeners — regenerate XML whenever any field changes
document.getElementById('add-tag').addEventListener('click', () => addTag());
document.getElementById('f-title').addEventListener('input', generate);
document.getElementById('f-date').addEventListener('input', generate);
document.getElementById('f-body').addEventListener('input', generate);
numInput.addEventListener('input', generate);

// Copy the generated XML to the clipboard and briefly confirm with button text
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(xmlOut.value).then(() => {
    copyBtn.textContent = 'copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = 'copy to clipboard';
      copyBtn.classList.remove('copied');
    }, 2000);
  });
});

// Trigger a file download of the generated XML using a temporary anchor element
downloadBtn.addEventListener('click', () => {
  const blob = new Blob([xmlOut.value], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = getFilename();
  a.click();
  URL.revokeObjectURL(url); // free the temporary URL from memory
});

// Init — start with one empty tag row and generate the initial XML
addTag();
generate();