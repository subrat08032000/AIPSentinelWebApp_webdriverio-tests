const { execSync } = require('child_process');
const fs = require('fs');
try {
  console.log("Running wdio...");
  const out = execSync('npx wdio run ./wdio.conf.ts --spec test/specs/MQ_test.e2e.ts --reporters spec', { encoding: 'utf-8', stdio: 'pipe' });
  fs.writeFileSync('error.log', out);
  console.log("Test passed!");
} catch(e) {
  fs.writeFileSync('error.log', (e.stdout || '') + '\n' + (e.stderr || ''));
  console.log("Test failed - log saved to error.log");
}
