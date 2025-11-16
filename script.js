// Simple editor + preview using Ace + browser storage
const editorDiv = document.getElementById('editor');
const runBtn = document.getElementById('runBtn');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');
const modeSelect = document.getElementById('mode');
const preview = document.getElementById('preview');
const fileInput = document.getElementById('fileInput');

const STORAGE_KEY = 'simple-code-editor-content';

// init ace editor
const editor = ace.edit(editorDiv);
editor.setTheme('ace/theme/dracula');
editor.session.setMode('ace/mode/html');
editor.setValue(`<!-- HTML लिखो यहाँ -->\n<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Preview</title>\n    <style>body{font-family:sans-serif;padding:20px}</style>\n  </head>\n  <body>\n    <h2>Welcome</h2>\n    <p>Run कर के देखें</p>\n    <script>console.log('preview');</script>\n  </body>\n</html>` , -1);
editor.setOptions({wrap:true,fontSize:14});

// update mode when select changes
modeSelect.addEventListener('change', () => {
  const m = modeSelect.value;
  const map = { html: 'ace/mode/html', css: 'ace/mode/css', javascript: 'ace/mode/javascript' };
  editor.session.setMode(map[m] || 'ace/mode/html');
});

// RUN: if mode is html → render; if css/js → inject into a basic html shell
runBtn.addEventListener('click', () => {
  const mode = modeSelect.value;
  const code = editor.getValue();
  let fullHtml = '';

  if (mode === 'html') {
    fullHtml = code;
  } else if (mode === 'css') {
    fullHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${code}</style></head><body><h3>CSS Preview</h3><div class="box">Example box</div></body></html>`;
  } else { // javascript
    fullHtml = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:sans-serif;padding:20px}</style></head><body><h3>JS Preview</h3><pre id="out"></pre><script>${code}<\/script></body></html>`;
  }

  // write to iframe
  const doc = preview.contentWindow.document;
  doc.open();
  doc.write(fullHtml);
  doc.close();
});

// Save to localStorage
saveBtn.addEventListener('click', () => {
  const data = { mode: modeSelect.value, code: editor.getValue(), savedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  alert('Saved in this browser (localStorage).');
});

// Load from localStorage
loadBtn.addEventListener('click', () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) { alert('Koi saved file nahi mili.'); return; }
  const data = JSON.parse(saved);
  modeSelect.value = data.mode || 'html';
  modeSelect.dispatchEvent(new Event('change'));
  editor.setValue(data.code || '', -1);
  alert('Loaded from browser storage.');
});

// Clear editor
clearBtn.addEventListener('click', () => {
  if (!confirm('Clear karna hai?')) return;
  editor.setValue('', -1);
});

// Allow user to import a .html or .txt file (optional)
fileInput.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    editor.setValue(r.result, -1);
    alert('File loaded into editor.');
  };
  r.readAsText(f);
});

// Double-click editor area to open file picker
editorDiv.addEventListener('dblclick', () => fileInput.click());
