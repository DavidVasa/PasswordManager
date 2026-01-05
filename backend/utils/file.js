const fs = require('fs');

function ensureDataDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true, mode: 0o700 });
  }
}

function readJSONSafe(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const txt = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(txt);
  } catch {
    return fallback;
  }
}

function writeJSONSafe(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), { mode: 0o600 });
}

module.exports = {
  ensureDataDir,
  readJSONSafe,
  writeJSONSafe
};
