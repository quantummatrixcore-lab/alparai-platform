import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
  
  const wideElements = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll("*"));
    const results = [];
    for (const el of els) {
      if (el.scrollWidth > 375 || el.offsetWidth > 375 || el.getBoundingClientRect().width > 375) {
        results.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          scrollWidth: el.scrollWidth,
          offsetWidth: el.offsetWidth,
          rectWidth: el.getBoundingClientRect().width
        });
      }
    }
    return results;
  });
  
  console.log("Elements wider than 375px:");
  wideElements.forEach(e => {
    if (e.tag !== "SCRIPT" && e.tag !== "STYLE" && e.tag !== "NOSCRIPT") {
       console.log(`${e.tag} .${e.className.split(" ")[0]} -> scrollW: ${e.scrollWidth}, offsetW: ${e.offsetWidth}, rectW: ${e.rectWidth}`);
    }
  });
  
  await browser.close();
}

run().catch(console.error);
