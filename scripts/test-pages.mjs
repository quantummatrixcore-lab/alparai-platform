async function test(url) {
  const r = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  const t = await r.text();
  const bodyMatch = t.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (bodyMatch) {
    const main = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`\n=== ${url} ===`);
    console.log('STATUS:', r.status);
    console.log('MAIN:', main.slice(0, 400));
  }
}
(async () => {
  await test('https://alparai.com/tr/legal/takedown');
  await test('https://alparai.com/tr/legal/privacy');
  await test('https://alparai.com/en/legal/takedown');
})();
