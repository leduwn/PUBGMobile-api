const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');

async function runValidation() {
  const outputDir = __dirname;
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    locale: 'vi-VN',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 900 }
  });

  const page = await context.newPage();

  // Low-level CDP session
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');

  const cdpRequests = new Map();
  const cdpResponses = [];

  cdp.on('Network.requestWillBeSent', (p) => {
    cdpRequests.set(p.requestId, {
      requestId: p.requestId,
      url: p.request.url,
      method: p.request.method,
      headers: p.request.headers,
      postData: p.request.postData
    });
  });

  cdp.on('Network.responseReceived', async (p) => {
    const req = cdpRequests.get(p.requestId);
    let bodyData = null;
    try {
      const res = await cdp.send('Network.getResponseBody', { requestId: p.requestId });
      bodyData = res.base64Encoded ? Buffer.from(res.body, 'base64').toString('utf8') : res.body;
    } catch (e) {
      bodyData = `[No body: ${e.message}]`;
    }

    cdpResponses.push({
      requestId: p.requestId,
      url: p.response.url,
      status: p.response.status,
      headers: p.response.headers,
      request: req || null,
      responseBody: bodyData
    });
  });

  console.log('Navigating to https://pay.zing.vn/pubgm...');
  await page.goto('https://pay.zing.vn/pubgm', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(5000);

  const outer = page.frameLocator('iframe[src*="pubgmvn"]');

  // Accept cookies
  const cookieAcceptBtn = outer.locator('text="Chấp nhận tất cả các cookie tùy chọn"');
  if (await cookieAcceptBtn.isVisible()) {
    console.log('Accepting cookies...');
    await cookieAcceptBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click Enter ID button
  const enterIdBtn = outer.locator('text="Vui lòng nhập Player ID của bạn"');
  await enterIdBtn.waitFor({ state: 'visible', timeout: 15000 });
  await enterIdBtn.click();
  await page.waitForTimeout(2000);

  const inner = outer.frameLocator('iframe[src*="playerid_enter"]');
  const input = inner.locator('input[placeholder="Enter Player ID"]');
  await input.waitFor({ state: 'visible', timeout: 10000 });

  console.log('Typing UID 5421835339...');
  await input.fill('5421835339');
  await page.waitForTimeout(1000);

  // Clear baseline mark
  const baselineCount = cdpResponses.length;

  console.log('Clicking OK button...');
  const okBtn = inner.locator('.Button_btn_primary__1ncdM');
  await okBtn.click();

  console.log('Waiting 8s for validation responses...');
  await page.waitForTimeout(8000);

  // Screenshot final result
  await page.screenshot({ path: path.join(outputDir, 'general.png') });
  console.log('general.png saved.');

  const postClickTraffic = cdpResponses.slice(baselineCount);

  function sanitizeHeaders(hdrs) {
    if (!hdrs) return {};
    const clean = {};
    for (const [k, v] of Object.entries(hdrs)) {
      const l = k.toLowerCase();
      if (l.includes('cookie') || l.includes('auth') || l.includes('token') || l.includes('secret') || l.includes('signature') || l.includes('sig')) {
        clean[k] = 'PRESENT (REDACTED)';
      } else {
        clean[k] = v;
      }
    }
    return clean;
  }

  const sanitized = postClickTraffic.map(item => ({
    requestId: item.requestId,
    url: item.url,
    status: item.status,
    request: item.request ? {
      method: item.request.method,
      url: item.request.url,
      headers: sanitizeHeaders(item.request.headers),
      postData: item.request.postData
    } : null,
    responseHeaders: sanitizeHeaders(item.headers),
    responseBody: item.responseBody
  }));

  fs.writeFileSync(path.join(outputDir, 'cdp_post_click.json'), JSON.stringify(sanitized, null, 2), 'utf8');

  // Find validation request
  const validation = sanitized.filter(t => {
    const inUrl = (t.url || '').includes('5421835339');
    const inPost = t.request && (t.request.postData || '').includes('5421835339');
    const inResp = (t.responseBody || '').includes('5421835339');
    return inUrl || inPost || inResp;
  });

  console.log(`Matching validation requests: ${validation.length}`);
  fs.writeFileSync(path.join(outputDir, 'validation_matches.json'), JSON.stringify(validation, null, 2), 'utf8');

  // Capture UI texts
  const outerText = await outer.locator('body').evaluate(b => b ? b.innerText : '').catch(() => '');
  fs.writeFileSync(path.join(outputDir, 'rendered_ui.txt'), outerText, 'utf8');

  await browser.close();
  console.log('Done!');
}

runValidation().catch(console.error);
