import {spawn} from 'node:child_process';
import {setTimeout} from 'node:timers/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const release = process.cwd();
const child = spawn(process.execPath, [path.join(release, 'node_modules/next/dist/bin/next'), 'start', release, '--hostname', '0.0.0.0', '--port', '3107'], {cwd: release, env: {...process.env, NODE_ENV: 'production'}, stdio: ['ignore','pipe','pipe']});
let logs='';
child.stdout.on('data', b => { logs += b; });
child.stderr.on('data', b => { logs += b; });
async function get(p, headers) { const r=await fetch('http://127.0.0.1:3107'+p, {headers, redirect:'manual', signal:AbortSignal.timeout(10000)}); assert.equal(r.status,200, p+' '+JSON.stringify(Object.fromEntries(r.headers))); return r; }
try {
  let ready=false;
  for(let i=0;i<30;i++) { if(logs.includes('Ready')) {ready=true;break;} await setTimeout(300); }
  assert.ok(ready,logs);
  const en = await (await get('/en')).text();
  assert.ok(en.includes('Manufacturing Food.'), 'latest English hero');
  const root = await fetch('http://127.0.0.1:3107/', {headers: {'accept-language':'en-US,en;q=0.9','cookie':'NEXT_LOCALE=en'}, redirect: 'manual'});
  assert.equal(root.status, 307, 'root redirects to the default language');
  assert.equal(new URL(root.headers.get('location'), 'http://127.0.0.1:3107').pathname, '/ar', 'Arabic is the default language');
  const ar = await (await get('/ar')).text();
  assert.ok(ar.includes('lang="ar"'), 'Arabic route');
  const proxied = await (await get('/ar', {'x-forwarded-host':'staging.masdarksa.cloud','x-forwarded-proto':'https'})).text();
  assert.ok(proxied.includes('lang="ar"'), 'Arabic homepage behind TLS proxy');
  const assets = [...new Set([...en.matchAll(/(?:href|src)="(\/_next\/static\/[^" ]+\.(?:css|js))"/g)].map(m=>m[1]))];
  assert.ok(assets.some(a=>a.endsWith('.css')));
  for(const asset of assets) {
    const response = await get(asset);
    assert.match(response.headers.get('content-type'), asset.endsWith('.css') ? /text\/css/ : /javascript/);
  }
  const logo = await get('/brand/masdar-logo-text.png');
  assert.match(logo.headers.get('content-type'), /image\/png/);
  console.log(`Direct release launch passed: English and Arabic pages, ${assets.length} CSS/JS assets, and logo returned HTTP 200.`);
} finally { child.kill(); }
