// Smoke tests: load each page in a simulated browser and check the core features still work.
// Run with `npm install && npm test`. The deploy workflow runs this before publishing.
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs'), path = require('path'), assert = require('assert');
const read = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const wait = ms => new Promise(r => setTimeout(r, ms));
const XSS = '<img src=x onerror=window.__pwn=1>';
let passed = 0;
const ok = (cond, msg) => { assert(cond, msg); passed++; };

function load(file, { seed = {}, patch = s => s } = {}) {
  const errors = [], vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/Not implemented/.test(e.message)) errors.push(e.message); });
  const dom = new JSDOM(patch(read(file)), {
    runScripts: 'dangerously', url: 'https://example.com/', virtualConsole: vc, pretendToBeVisual: true,
    beforeParse(w) {
      Object.entries(seed).forEach(([k, v]) => w.localStorage.setItem(k, JSON.stringify(v)));
      w.IntersectionObserver = class { observe() {} };
      w.scrollTo = () => {}; w.Element.prototype.scrollIntoView = function () {};
      w.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
    }
  });
  const d = dom.window.document;
  return { w: dom.window, d, errors, $: id => d.getElementById(id), n: s => d.querySelectorAll(s).length };
}

(async () => {
  // 1. Guide renders and core interactions work
  let p = load('index.html'); await wait(300);
  ok(p.n('.place-card') === 14, 'renders 14 places');
  ok(p.n('#hotelsGrid .hotel-card') === 5, 'renders 5 hotels');
  ok(p.n('#seasonStrip button') === 12 && p.n('#emergencyGrid .emergency-card') === 12, 'season + emergency sections render');
  ok(p.n('#itineraryBody .stop') > 0, 'itinerary is generated');
  p.d.querySelector('.add-btn').click();
  ok(p.$('tripCount').textContent === '1', 'adding a place updates the trip counter');
  p.d.dispatchEvent(new p.w.KeyboardEvent('keydown', { key: '/', bubbles: true }));
  p.$('cmdkInput').value = 'loktak'; p.$('cmdkInput').dispatchEvent(new p.w.Event('input'));
  ok(p.n('#cmdkList li[data-n]') > 0, 'search palette finds results');
  for (const f of ['index.html', 'admin.html', '404.html', 'privacy.html', 'terms.html']) {
    const css = (read(f).match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1].replace(/\/\*[\s\S]*?\*\//g, '');
    let depth = 0, bad = false;
    for (const ch of css) { if (ch === '{') depth++; else if (ch === '}' && --depth < 0) bad = true; }
    ok(!bad && depth === 0, 'CSS braces balance in ' + f);
  }
  ok(!/\u2014/.test(read('index.html') + read('admin.html') + read('404.html') + read('privacy.html') + read('terms.html')) && !read('index.html').includes('\\u2014'), 'no em dashes in any page');
  ok(p.n('footer a[href="privacy.html"]') === 1 && p.n('footer a[href="terms.html"]') === 1, 'footer links to privacy and terms');
  ok(/No notes yet/.test(p.$('ratingCount').textContent), 'reviews start empty (no invented testimonials)');
  const vis = p.d.body.cloneNode(true); vis.querySelectorAll('script,style').forEach(e => e.remove());
  ok(!/\\u[0-9a-fA-F]{4}/.test(vis.textContent), 'no raw \\u escape codes in the guide text');
  ok(p.d.querySelectorAll('.hero-stats div b')[1].textContent === String(p.n('.place-card')), 'hero place count matches the real number of places');
  ok(p.errors.length === 0, 'no script errors on the guide: ' + p.errors.join('; '));

  // 2. Email code sign-in (demo mode) works end to end
  p.$('authSigninBtn').click();
  p.$('authEmail').value = 'Test@Example.com'; p.$('authSend').click(); await wait(80);
  const code = p.$('modalBody').querySelector('.auth-note b:last-child').textContent;
  p.$('authCode').value = '000000'; p.$('authVerify').click(); await wait(60);
  ok(!p.$('authChipBtn'), 'wrong code does not sign in');
  p.$('authCode').value = code; p.$('authVerify').click(); await wait(60);
  ok(!!p.$('authChipBtn'), 'correct code signs in');

  // 3. allowDemo:false blocks sign-in until email is configured
  let q = load('index.html', { patch: s => s.replace('allowDemo: true', 'allowDemo: false') }); await wait(200);
  q.$('authSigninBtn').click(); q.$('authEmail').value = 'a@b.co'; q.$('authSend').click(); await wait(60);
  ok(!q.$('authCode') && /not set up/.test(q.$('authErr').textContent), 'allowDemo:false refuses to run');

  // 4. Hostile saved data is rendered as text on both pages
  const seed = { rim_reviews: [{ name: XSS, place: XSS, rating: 9, text: XSS, initial: '<', color: 'red' }],
                 rim_admin_hotels: [{ name: XSS, tier: XSS, area: XSS, phone: '12345abc67890', note: XSS }] };
  let g = load('index.html', { seed }); await wait(250);
  ok(g.n('img') === 0 && !g.w.__pwn, 'guide escapes hostile reviews and hotels');
  let a = load('admin.html', { seed }); await wait(150);
  const av = a.d.body.cloneNode(true); av.querySelectorAll('script,style').forEach(e => e.remove());
  ok(!/\\u[0-9a-fA-F]{4}/.test(av.textContent), 'no raw \\u escape codes on the admin page');
  a.$('gatePass').value = 'manipur2026'; a.$('gateBtn').click();
  ok(a.n('#reviewsTable tbody tr') === 1, 'admin lists the review');
  ok(a.n('img') === 0 && !a.w.__pwn, 'admin escapes hostile reviews and hotels');
  a.d.querySelector('[data-del-review]').click();
  ok(!!a.d.querySelector('#reviewsTable td.empty'), 'admin shows an empty state after deleting');
  ok(a.errors.length === 0, 'no script errors on admin: ' + a.errors.join('; '));

  // 5. The build script never leaves a placeholder URL behind
  const { execFileSync } = require('child_process'), os = require('os');
  for (const arg of ['', 'https://example.org/guide']) {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rim-'));
    execFileSync('node', [path.join(__dirname, '..', 'scripts', 'build.js'), ...(arg ? [arg] : [])], { env: { ...process.env, OUT_DIR: outDir }, stdio: 'pipe' });
    const all = fs.readdirSync(outDir).filter(f => /\.(html|xml|txt)$/.test(f)).map(f => fs.readFileSync(path.join(outDir, f), 'utf8')).join('');
    ok(!all.includes('your-username'), 'build leaves no placeholder (' + (arg || 'no URL') + ')');
    ok(arg ? all.includes('https://example.org/guide/') : !all.includes('rel="canonical"'), 'build output matches the URL mode (' + (arg || 'no URL') + ')');
    const pages = fs.readdirSync(path.join(outDir, 'places'));
    const html = pages.map(f => fs.readFileSync(path.join(outDir, 'places', f), 'utf8'));
    ok(pages.length === 14, 'one static page per place (' + (arg || 'no URL') + ')');
    const titles = html.map(h => (h.match(/<title>(.*?)<\/title>/) || [])[1]);
    ok(new Set(titles).size === 14 && titles.every(Boolean), 'every place page has a unique title');
    ok(!html.some(h => /\u2014/.test(h)), 'no em dashes on place pages');
    if (arg) ok((fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8').match(/<loc>/g) || []).length === 17, 'sitemap lists all 17 pages');
    ok(/places\/kangla\.html/.test(fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')), 'home page links to every place page');
  }

  console.log(`All ${passed} checks passed.`); process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
