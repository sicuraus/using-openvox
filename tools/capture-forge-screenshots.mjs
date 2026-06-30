// Regenerate the Puppet Forge screenshots used in docs/ecosystem.md.
//
// These are screenshots of a third-party site (forge.puppet.com) and will go
// stale as that UI changes. Re-run this script to refresh them.
//
// Requirements:
//   - Google Chrome installed on the system (driven via Playwright's
//     `channel: 'chrome'`, so no bundled browser download is needed)
//   - npm i -D playwright-core
//
// Usage (from the repo root):
//   node tools/capture-forge-screenshots.mjs
//
// Output: docs/assets/forge/{mainpage,search,searchresults,module-page,os-support}.png

import { chromium } from 'playwright-core';

const OUT = 'docs/assets/forge';
const MODULE = 'puppet/archive'; // a Vox Pupuli (puppet namespace) module — good donation example

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1366, height: 850 },
  deviceScaleFactor: 2, // crisp on high-DPI displays
});
const page = await ctx.newPage();

async function acceptCookies() {
  for (const name of ['Accept All Cookies', 'Accept all', 'Accept']) {
    const btn = page.getByRole('button', { name });
    if (await btn.count()) {
      try { await btn.first().click({ timeout: 1500 }); return; } catch { /* ignore */ }
    }
  }
}

async function go(url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3500);
  await acceptCookies();
  await page.waitForTimeout(1000);
}

// Climb from a locator to the first ancestor whose box fits the given bounds,
// then element-screenshot it. Avoids capturing marketing popups elsewhere on
// the page.
async function shotAncestor(locator, file, { minW = 0, maxW = 1e9, minH = 0, maxH = 1e9 }) {
  let el = locator;
  for (let i = 0; i < 6; i++) {
    const par = el.locator('xpath=..');
    if (!(await par.count())) break;
    el = par;
    const bb = await el.boundingBox();
    if (bb && bb.width > minW && bb.width < maxW && bb.height > minH && bb.height < maxH) {
      await el.screenshot({ path: `${OUT}/${file}` });
      return true;
    }
  }
  return false;
}

// 1. Home page
await go('https://forge.puppet.com/');
await page.screenshot({ path: `${OUT}/mainpage.png` });

// 2. Search dropdown (element crop, so the marketing popup is excluded)
const box = page.getByPlaceholder(/Search Forge modules/i).first();
await box.click();
await box.fill('apache');
await page.waitForTimeout(1800);
await shotAncestor(page.locator('text=COMPATIBILITY').first(), 'search.png',
  { minW: 300, maxW: 640, minH: 140, maxH: 360 });

// 3. Search results
await go('https://forge.puppet.com/modules?q=apache');
await page.screenshot({ path: `${OUT}/searchresults.png` });

// 4. A module page
await go(`https://forge.puppet.com/modules/${MODULE}`);
await page.screenshot({ path: `${OUT}/module-page.png` });

// 5. The "compatible with" / supported-OS section of that module page
const compat = page.getByRole('heading', { name: /Compatib/i }).first();
if (await compat.count()) {
  await compat.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await shotAncestor(compat, 'os-support.png', { minH: 180, maxH: 700 });
}

await browser.close();
console.log('Forge screenshots written to', OUT);
