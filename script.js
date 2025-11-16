const editor = document.getElementById('editor');
const runBtn = document.getElementById('runBtn');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');
const modeSelect = document.getElementById('mode');
const preview = document.getElementById('preview');

const STORAGE_KEY = 'simple-code-editor-content';

// starter content
editor.value = `<!-- HTML लिखो यहाँ -->\n<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Preview</title>\n    <style>body{font-family:sans-serif;padding:20px}</style>\n  </head>\n  <body>\n    <h2>Welcome</h2>\n    <p>Run कर के देखें</p>\n    <script>console.log('preview');</script>\n  </body>\n</html>`;

// Run: render according to mode
runBtn.addEventListener('click', () => {
  const mode = modeSelect.value;
  const code = editor.value;
  let fullHtml = '';

  if (mode === 'html') {
    fullHtml = code;
  } else if (mode === 'css') {
    fullHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${code}</style></head><body><h3>CSS Preview</h3><div class="box">Example box</div></body></html>`;
  } else {
    fullHtml = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:sans-serif;padding:20px}</style></head><body><h3>JS Preview</h3><pre id="out"></pre><script>${code}<\/script></body></html>`;
  }

  const doc = preview.contentWindow.document;
  doc.open();
  doc.write(fullHtml);
  doc.close();
});

// Save and load localStorage
saveBtn.addEventListener('click', () => {
  const data = { mode: modeSelect.value, code: editor.value, savedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  alert('Saved in browser (localStorage).');
});
loadBtn.addEventListener('click', () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) { alert('Koi saved file nahi mili.'); return; }
  const data = JSON.parse(saved);
  modeSelect.value = data.mode || 'html';
  editor.value = data.code || '';
  alert('Loaded from browser storage.');
});
clearBtn.addEventListener('click', () => {
  if (!confirm('Clear karna hai?')) return;
  editor.value = '';
});
