// Builds the deployable site into dist/ (or $OUT_DIR).
// Usage: node scripts/build.js [https://your-site-url]
// - Writes one static, crawlable page per place into places/ (own title, description, schema.org data).
// - With a URL: canonical links, share image, robots.txt and a full sitemap.xml use your real address.
// - Without one: URL-dependent tags are left out so nothing points at the wrong domain.
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const out = process.env.OUT_DIR || path.join(root, 'dist');
const PLACEHOLDER = 'https://your-username.github.io/re-imagining-manipur';
const url = (process.argv[2] || process.env.SITE_URL || '').trim().replace(/\/+$/, '');
const fail = m => { console.error(m); process.exit(1); };
if (url && !/^https?:\/\/\S+$/.test(url)) fail('Site URL must start with http:// or https://');
const files = ['index.html', 'admin.html', '404.html', 'privacy.html', 'terms.html', 'manifest.json', 'sw.js', 'icon.svg', 'og-image.png', 'robots.txt', '_headers'];
JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const indexSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const found = indexSrc.match(/const PLACES = (\[[\s\S]*?\n\]);/);
if (!found) fail('Could not read PLACES from index.html');
const places = vm.runInNewContext('(' + found[1] + ')');

function placePage(p) {
  const desc = p.blurb.length > 155 ? p.blurb.slice(0, 152).replace(/\s+\S*$/, '') + '...' : p.blurb;
  const title = `${p.name} | Manipur visitor guide | Re-Imagining Manipur`;
  const pageUrl = url ? `${url}/places/${p.id}.html` : '';
  const graph = [{ '@type': 'TouristAttraction', name: p.name, description: p.full, address: { '@type': 'PostalAddress', streetAddress: p.area, addressRegion: 'Manipur', addressCountry: 'IN' } }];
  if (url) {
    graph[0].url = pageUrl;
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Imphal travel guide', item: url + '/' }, { '@type': 'ListItem', position: 2, name: p.name, item: pageUrl }] });
  }
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  const others = places.filter(o => o.id !== p.id).map(o => `<li><a href="${o.id}.html">${esc(o.name)}</a></li>`).join('');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
${url ? `<link rel="canonical" href="${pageUrl}">\n<meta property="og:image" content="${url}/og-image.png">\n` : ''}<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta name="theme-color" content="#1e4a3c"><link rel="icon" href="../icon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Manrope:wght@400;600&display=swap" rel="stylesheet">
<script type="application/ld+json">${ld}</script>
<style>body{margin:0;background:#f7f3ea;color:#1a1712;font-family:'Manrope',sans-serif;line-height:1.7}main{max-width:700px;margin:0 auto;padding:40px 24px 80px}h1{font-family:'Fraunces',serif;font-weight:500;font-size:2.4rem;line-height:1.15;margin:14px 0 4px}h2{font-family:'Fraunces',serif;font-weight:500;font-size:1.25rem;margin:30px 0 8px}p,li{color:#4a4438}.meta{font-size:.9rem;color:#5b5344}.lead{font-size:1.1rem;color:#1a1712}a{color:#1e4a3c}.cta{display:inline-block;background:#1e4a3c;color:#f6f0e2;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:8px}ul.more{columns:2;padding-left:18px}</style></head>
<body><main>
<nav aria-label="Breadcrumb"><a href="../">Imphal travel guide</a> / ${esc(p.name)}</nav>
<h1>${esc(p.name)}</h1>
<p class="meta">${esc(p.area)} &middot; about ${p.time} minutes</p>
<p class="lead">${esc(p.blurb)}</p>
<p>${esc(p.full)}</p>
<h2>Good to know</h2>
<ul>${p.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
<p><a class="cta" href="../#place=${p.id}">Add this to your trip plan</a></p>
<h2>More places in Manipur</h2>
<ul class="more">${others}</ul>
<p class="meta">Hours, fees and access can change. Check with the site or the Manipur Tourism office before you go. <a href="../privacy.html">Privacy</a> &middot; <a href="../terms.html">Terms</a></p>
</main></body></html>
`;
}

fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'places'), { recursive: true });
const linkNav = '<nav class="foot-places" aria-label="Places in Manipur"><h4>Places in Manipur</h4>' + places.map(p => `<a href="places/${p.id}.html">${esc(p.name)}</a>`).join('') + '</nav>';
for (const f of files) {
  const src = path.join(root, f), dst = path.join(out, f);
  if (f === 'og-image.png') { fs.copyFileSync(src, dst); continue; }
  let t = fs.readFileSync(src, 'utf8');
  if (url) t = t.split(PLACEHOLDER).join(url);
  else if (f === 'index.html') t = t.split('\n').filter(l => !/rel="canonical"|og:image|twitter:image/.test(l)).join('\n');
  else if (f === 'robots.txt') t = t.split('\n').filter(l => !/^Sitemap:/i.test(l)).join('\n');
  if (f === 'index.html') t = t.replace('<!--PLACE_LINKS-->', linkNav);
  if (t.includes('your-username')) fail('Placeholder URL left in ' + f);
  fs.writeFileSync(dst, t);
}
for (const p of places) fs.writeFileSync(path.join(out, 'places', p.id + '.html'), placePage(p));
if (url) {
  const day = new Date().toISOString().slice(0, 10);
  const paths = ['/', '/privacy.html', '/terms.html', ...places.map(p => `/places/${p.id}.html`)];
  fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(u => `  <url><loc>${url}${u}</loc><lastmod>${day}</lastmod></url>`).join('\n')}\n</urlset>\n`);
}
console.log(`Built ${files.length + places.length + (url ? 1 : 0)} files into ${out}` + (url ? ' for ' + url : ' (no site URL: canonical links, share image and sitemap left out)'));
