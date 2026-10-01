const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

function requestGoPay(payloadObj, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(payloadObj);
    const options = {
      hostname: 'gopay.co.id',
      port: 443,
      path: '/games/v1/order/user-account',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Content-Length': Buffer.byteLength(payload),
        ...customHeaders
      }
    };

    const startTime = Date.now();
    const req = https.request(options, (res) => {
      const elapsedMs = Date.now() - startTime;
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(rawData);
        } catch (e) {
          parsed = null;
        }

        // Sanitize headers
        const sanitizedHeaders = { ...res.headers };
        if (sanitizedHeaders['set-cookie']) {
          sanitizedHeaders['set-cookie'] = sanitizedHeaders['set-cookie'].map(() => 'REDACTED');
        }

        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          latencyMs: elapsedMs,
          headers: sanitizedHeaders,
          rawBody: rawData,
          parsedBody: parsed
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

// CLI single run
if (process.argv[2] && !process.argv.includes('--suite')) {
  const uid = process.argv[2];
  const zoneId = process.argv[3] !== undefined && !process.argv[3].startsWith('--') ? process.argv[3] : '';
  const omitZone = process.argv.includes('--no-zone');
  const payload = {
    code: 'PUBG_ID',
    data: omitZone ? { userId: String(uid) } : { userId: String(uid), zoneId: String(zoneId) }
  };

  console.log('Sending request for UID:', uid);
  requestGoPay(payload).then((res) => {
    console.log('HTTP Status:', res.statusCode, res.statusMessage);
    console.log('Latency:', `${res.latencyMs}ms`);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    console.log('Raw Body:', res.rawBody);
  }).catch((err) => {
    console.error('Request error:', err);
  });
}

module.exports = { requestGoPay };

