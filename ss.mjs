import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { Buffer } from 'buffer';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3002/tools', { waitUntil: 'networkidle' });
for (let y = 0; y <= 5000; y += 120) {
  await page.evaluate((sy) => window.scrollTo(0, sy), y);
  await page.waitForTimeout(60);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.evaluate(() => {
  document.querySelectorAll('.reveal,.reveal-left,.reveal-scale').forEach(function(el){
    el.classList.add('is-visible'); el.style.opacity='1'; el.style.transform='none'; el.style.transition='none';
  });
});
await page.waitForTimeout(200);
const buf = await page.screenshot({ fullPage: true });
writeFileSync('/tmp/tools_page.png', buf);
console.log('Height:', await page.evaluate(() => document.documentElement.scrollHeight));
await browser.close();
