const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(repoRoot, file), 'utf8');
}

for (const file of ['index.html', 'src/index.html']) {
  test(`${file}: Enter Sanctuary CTA uses sanctuary entry flow`, () => {
    const source = read(file);
    assert.match(
      source,
      /<button onclick="unlockAudio\(\); enterSanctuary\(\);"[^>]*>\s*Enter Sanctuary\s*<\/button>/,
      'landing CTA should route through enterSanctuary'
    );
    assert.doesNotMatch(
      source,
      /<button onclick="unlockAudio\(\); (?:initApp|showDashboard)\(\);"[^>]*>\s*Enter Sanctuary\s*<\/button>/,
      'landing CTA should not bypass the sanctuary entry gate'
    );
  });
}
