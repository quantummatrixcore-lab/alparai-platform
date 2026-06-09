const fs = require("fs");
const path = require("path");
const https = require("https");

const dir = path.join(__dirname, "..", "public", "logos", "providers");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const providers = [
  { slug: "openai", si: "openai", color: "#412991" },
  { slug: "anthropic", si: "anthropic", color: "#D97757" },
  { slug: "google", si: "googlegemini", color: "#8E75B2" },
  { slug: "meta", si: "meta", color: "#0467DF" },
  { slug: "xai", si: "x", color: "#000000" },
  { slug: "mistral", si: null, text: "M", color: "#F25022" },
  { slug: "cohere", si: null, text: "Co", color: "#2C8E75" },
  { slug: "perplexity", si: null, text: "P", color: "#1B1B1B" },
  { slug: "qwen", si: null, text: "Q", color: "#6A00FF" },
  { slug: "deepseek", si: null, text: "DS", color: "#0055FF" },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => {
            file.close(resolve);
          });
        } else {
          file.close();
          fs.unlink(dest, () => {});
          reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
        }
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err.message);
      });
  });
}

async function main() {
  for (const p of providers) {
    const dest = path.join(dir, `${p.slug}.svg`);
    if (p.si) {
      const url = `https://cdn.jsdelivr.net/npm/simple-icons@v11.0.0/icons/${p.si}.svg`;
      try {
        await downloadFile(url, dest);
        console.log(`Downloaded ${p.slug} from simple-icons`);

        // Let's modify the SVG to have the correct color or just keep it as is.
        // Simple-icons SVGs are black by default. Let's color them.
        let content = fs.readFileSync(dest, "utf8");
        content = content.replace("<svg ", `<svg fill="${p.color}" `);
        fs.writeFileSync(dest, content);
      } catch (err) {
        console.log(`Failed to download ${p.slug}: ${err}`);
        createFallback(dest, p.slug.charAt(0).toUpperCase(), p.color);
      }
    } else {
      createFallback(dest, p.text, p.color);
      console.log(`Created fallback for ${p.slug}`);
    }
  }
}

function createFallback(dest, text, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <rect width="100" height="100" rx="20" fill="${color}" />
    <text x="50" y="55" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  fs.writeFileSync(dest, svg);
}

main();
