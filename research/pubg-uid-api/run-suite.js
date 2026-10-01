const { requestGoPay } = require('./test-pubg-uid');
const fs = require('node:fs');
const path = require('node:path');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSuite() {
  const responsesDir = path.join(__dirname, 'responses');
  if (!fs.existsSync(responsesDir)) {
    fs.mkdirSync(responsesDir, { recursive: true });
  }

  const testCases = [
    {
      id: 'test_a_valid_1',
      name: 'Test A - Valid UID 1 (5123456789)',
      payload: { code: 'PUBG_ID', data: { userId: '5123456789', zoneId: '' } }
    },
    {
      id: 'test_b_valid_2',
      name: 'Test B - Valid UID 2 (5115612480)',
      payload: { code: 'PUBG_ID', data: { userId: '5115612480', zoneId: '' } }
    },
    {
      id: 'test_c_non_existent',
      name: 'Test C - Non-existent UID (9998887776)',
      payload: { code: 'PUBG_ID', data: { userId: '9998887776', zoneId: '' } }
    },
    {
      id: 'test_d1_format_alpha',
      name: 'Test D1 - Invalid format (abc)',
      payload: { code: 'PUBG_ID', data: { userId: 'abc', zoneId: '' } }
    },
    {
      id: 'test_d2_format_short',
      name: 'Test D2 - Invalid format (1)',
      payload: { code: 'PUBG_ID', data: { userId: '1', zoneId: '' } }
    },
    {
      id: 'test_d3_format_toolong',
      name: 'Test D3 - Invalid format (999999999999999999999999)',
      payload: { code: 'PUBG_ID', data: { userId: '999999999999999999999999', zoneId: '' } }
    },
    {
      id: 'test_e1_missing_zone_key',
      name: 'Test E1 - Missing zoneId field in data',
      payload: { code: 'PUBG_ID', data: { userId: '5123456789' } }
    },
    {
      id: 'test_e2_empty_data',
      name: 'Test E2 - Missing data.userId',
      payload: { code: 'PUBG_ID', data: {} }
    },
    {
      id: 'test_f_stability_rep1',
      name: 'Test F - Stability Rep 1 (5123456789)',
      payload: { code: 'PUBG_ID', data: { userId: '5123456789', zoneId: '' } }
    },
    {
      id: 'test_f_stability_rep2',
      name: 'Test F - Stability Rep 2 (5123456789)',
      payload: { code: 'PUBG_ID', data: { userId: '5123456789', zoneId: '' } }
    },
    {
      id: 'test_f_stability_rep3',
      name: 'Test F - Stability Rep 3 (5123456789)',
      payload: { code: 'PUBG_ID', data: { userId: '5123456789', zoneId: '' } }
    }
  ];

  console.log(`Starting suite of ${testCases.length} tests...\n`);

  for (const tc of testCases) {
    console.log(`Running: ${tc.name}...`);
    try {
      const res = await requestGoPay(tc.payload);
      const outData = {
        testId: tc.id,
        testName: tc.name,
        requestPayload: tc.payload,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        latencyMs: res.latencyMs,
        headers: res.headers,
        rawBody: res.rawBody,
        parsedBody: res.parsedBody
      };

      fs.writeFileSync(
        path.join(responsesDir, `${tc.id}.json`),
        JSON.stringify(outData, null, 2),
        'utf8'
      );

      console.log(`  -> HTTP ${res.statusCode} (${res.latencyMs}ms): ${res.rawBody}`);
    } catch (err) {
      console.error(`  -> Failed: ${err.message}`);
    }

    // Delay 1.5s between requests
    await sleep(1500);
  }

  console.log('\n--- SUITE COMPLETE ---');
}

runSuite().catch(console.error);

