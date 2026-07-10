import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
  
  const badElements = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll("*"));
    const results = [];
    for (const el of els) {
      const rect = el.getBoundingClientRect();
      if (rect.right > 375.5 && rect.width > 0 && el.tagName !== "BODY" && el.tagName !== "HTML") {
        results.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          right: rect.right,
          width: rect.width,
          scrollWidth: el.scrollWidth,
          htmlSnippet: el.outerHTML.substring(0, 150)
        });
      }
    }
    return results;
  });
  
  console.log("Elements extending past 375px (rect.right > 375):");
  badElements.forEach(e => {
    if (e.tag !== "SCRIPT" && e.tag !== "STYLE" && e.tag !== "NOSCRIPT") {
       console.log(`\nTag: ${e.tag}`);
       console.log(`Class: ${e.className}`);
       console.log(`Right: ${e.right}, Width: ${e.width}, ScrollW: ${e.scrollWidth}`);
       console.log(`Snippet: ${e.htmlSnippet}`);
    }
  });
  
  await browser.close();
}

run().catch(console.error);
