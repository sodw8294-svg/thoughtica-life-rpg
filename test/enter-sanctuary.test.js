const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const indexHtml = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'index.html'),
  'utf8'
);

test('enter sanctuary CTA uses the sanctuary entry flow', () => {
  assert.match(
    indexHtml,
    /<button onclick="unlockAudio\(\); enterSanctuary\(\);"/,
    'landing CTA should use enterSanctuary so the auth-aware sanctuary flow opens'
  );
});
