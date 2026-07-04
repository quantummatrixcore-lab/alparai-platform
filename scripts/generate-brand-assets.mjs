import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const BRAND_ASSETS_DIR = path.resolve("public/brand-assets");

// Ensure the directory exists
if (!fs.existsSync(BRAND_ASSETS_DIR)) {
  fs.mkdirSync(BRAND_ASSETS_DIR, { recursive: true });
}

// 1. Dark Theme SVG Logo
const logoDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80" role="img" aria-label="ALPAR AI">
  <defs>
    <!-- Accent Gradient: Emerald to Cyan -->
    <linearGradient id="alpar-accent-grad" x1="10" y1="10" x2="60" y2="70" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00FF88" />
      <stop offset="100%" stop-color="#00E5FF" />
    </linearGradient>

    <!-- Glowing Core Filter -->
    <filter id="alpar-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Wordmark text gradient (White -> Slate) -->
    <linearGradient id="alpar-text-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
  </defs>

  <!-- Left: Shield Icon Mark -->
  <g transform="translate(10, 8)">
    <!-- Shield Outer boundary -->
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="none" stroke="url(#alpar-accent-grad)" stroke-width="2.5" stroke-linejoin="round" />
    
    <!-- Shield Translucent Backing -->
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="#0B1622" fill-opacity="0.6" />

    <!-- Neural Network Node Links (Technology) -->
    <path d="M 32,16 L 18,30 M 32,16 L 46,30 M 18,30 L 32,46 L 46,30 M 32,46 L 32,60" stroke="#00E5FF" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.6" />

    <!-- Key Active Nodes (Trust Nodes) -->
    <circle cx="32" cy="16" r="3.5" fill="#00FF88" filter="url(#alpar-neon-glow)" />
    <circle cx="18" cy="30" r="3.5" fill="#00E5FF" filter="url(#alpar-neon-glow)" />
    <circle cx="46" cy="30" r="3.5" fill="#00E5FF" filter="url(#alpar-neon-glow)" />
    <circle cx="32" cy="46" r="4.5" fill="#FFFFFF" stroke="#00FF88" stroke-width="1.5" filter="url(#alpar-neon-glow)" />
    <circle cx="32" cy="60" r="3" fill="#00E5FF" opacity="0.8" />
    
    <!-- Balance Bar (Accountability/Justice aspect of the shield) -->
    <path d="M 12,30 H 52" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9" />
  </g>

  <!-- Right: Wordmark -->
  <g transform="translate(86, 0)" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="900" letter-spacing="-0.5">
    <text x="0" y="48" font-size="34" fill="url(#alpar-text-grad)">ALPAR</text>
    <text x="122" y="48" font-size="34" font-weight="500" fill="#00FF88" letter-spacing="1">AI</text>
  </g>
</svg>`;

// 2. Light Theme SVG Logo
const logoLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80" role="img" aria-label="ALPAR AI">
  <defs>
    <!-- Accent Gradient: Emerald to Cyan -->
    <linearGradient id="alpar-accent-grad" x1="10" y1="10" x2="60" y2="70" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00C060" />
      <stop offset="100%" stop-color="#00A5D0" />
    </linearGradient>

    <!-- Glowing Core Filter -->
    <filter id="alpar-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Left: Shield Icon Mark -->
  <g transform="translate(10, 8)">
    <!-- Shield Outer boundary -->
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="none" stroke="url(#alpar-accent-grad)" stroke-width="2.5" stroke-linejoin="round" />
    
    <!-- Shield Translucent Backing -->
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="#F8FAFC" fill-opacity="0.9" />

    <!-- Neural Network Node Links (Technology) -->
    <path d="M 32,16 L 18,30 M 32,16 L 46,30 M 18,30 L 32,46 L 46,30 M 32,46 L 32,60" stroke="#00A5D0" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.6" />

    <!-- Key Active Nodes (Trust Nodes) -->
    <circle cx="32" cy="16" r="3.5" fill="#00C060" filter="url(#alpar-neon-glow)" />
    <circle cx="18" cy="30" r="3.5" fill="#00A5D0" filter="url(#alpar-neon-glow)" />
    <circle cx="46" cy="30" r="3.5" fill="#00A5D0" filter="url(#alpar-neon-glow)" />
    <circle cx="32" cy="46" r="4.5" fill="#0B1622" stroke="#00C060" stroke-width="1.5" filter="url(#alpar-neon-glow)" />
    <circle cx="32" cy="60" r="3" fill="#00A5D0" opacity="0.8" />
    
    <!-- Balance Bar (Accountability/Justice aspect of the shield) -->
    <path d="M 12,30 H 52" stroke="#0B1622" stroke-width="2" stroke-linecap="round" opacity="0.9" />
  </g>

  <!-- Right: Wordmark (Dark slate color for light backgrounds) -->
  <g transform="translate(86, 0)" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="900" letter-spacing="-0.5">
    <text x="0" y="48" font-size="34" fill="#0B1622">ALPAR</text>
    <text x="122" y="48" font-size="34" font-weight="500" fill="#00C060" letter-spacing="1">AI</text>
  </g>
</svg>`;

// 3. Monochrome White Logo
const logoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80" role="img" aria-label="ALPAR AI">
  <!-- Left: Shield Icon Mark -->
  <g transform="translate(10, 8)">
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M 32,16 L 18,30 M 32,16 L 46,30 M 18,30 L 32,46 L 46,30 M 32,46 L 32,60" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.5" />
    <circle cx="32" cy="16" r="3.5" fill="#FFFFFF" />
    <circle cx="18" cy="30" r="3.5" fill="#FFFFFF" />
    <circle cx="46" cy="30" r="3.5" fill="#FFFFFF" />
    <circle cx="32" cy="46" r="4.5" fill="#FFFFFF" />
    <circle cx="32" cy="60" r="3" fill="#FFFFFF" opacity="0.8" />
    <path d="M 12,30 H 52" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
  </g>
  <!-- Right: Wordmark -->
  <g transform="translate(86, 0)" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="900" letter-spacing="-0.5">
    <text x="0" y="48" font-size="34" fill="#FFFFFF">ALPAR</text>
    <text x="122" y="48" font-size="34" font-weight="500" fill="#FFFFFF" letter-spacing="1">AI</text>
  </g>
</svg>`;

// 4. Monochrome Black Logo
const logoBlackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80" role="img" aria-label="ALPAR AI">
  <!-- Left: Shield Icon Mark -->
  <g transform="translate(10, 8)">
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="none" stroke="#000000" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M 32,16 L 18,30 M 32,16 L 46,30 M 18,30 L 32,46 L 46,30 M 32,46 L 32,60" stroke="#000000" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.5" />
    <circle cx="32" cy="16" r="3.5" fill="#000000" />
    <circle cx="18" cy="30" r="3.5" fill="#000000" />
    <circle cx="46" cy="30" r="3.5" fill="#000000" />
    <circle cx="32" cy="46" r="4.5" fill="#000000" />
    <circle cx="32" cy="60" r="3" fill="#000000" opacity="0.8" />
    <path d="M 12,30 H 52" stroke="#000000" stroke-width="2" stroke-linecap="round" />
  </g>
  <!-- Right: Wordmark -->
  <g transform="translate(86, 0)" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="900" letter-spacing="-0.5">
    <text x="0" y="48" font-size="34" fill="#000000">ALPAR</text>
    <text x="122" y="48" font-size="34" font-weight="500" fill="#000000" letter-spacing="1">AI</text>
  </g>
</svg>`;

// 5. Icon Primary SVG
const iconPrimarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="ALPAR AI Icon">
  <defs>
    <!-- Accent Gradient: Emerald to Cyan -->
    <linearGradient id="alpar-accent-grad" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00FF88" />
      <stop offset="100%" stop-color="#00E5FF" />
    </linearGradient>

    <!-- Glowing Core Filter -->
    <filter id="alpar-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <g transform="translate(8, 5)">
    <!-- Shield Outer boundary -->
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="none" stroke="url(#alpar-accent-grad)" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="#0B1622" fill-opacity="0.6" />
    <path d="M 32,16 L 18,30 M 32,16 L 46,30 M 18,30 L 32,46 L 46,30 M 32,46 L 32,60" stroke="#00E5FF" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.6" />
    <circle cx="32" cy="16" r="3.5" fill="#00FF88" filter="url(#alpar-neon-glow)" />
    <circle cx="18" cy="30" r="3.5" fill="#00E5FF" filter="url(#alpar-neon-glow)" />
    <circle cx="46" cy="30" r="3.5" fill="#00E5FF" filter="url(#alpar-neon-glow)" />
    <circle cx="32" cy="46" r="4.5" fill="#FFFFFF" stroke="#00FF88" stroke-width="1.5" filter="url(#alpar-neon-glow)" />
    <circle cx="32" cy="60" r="3" fill="#00E5FF" opacity="0.8" />
    <path d="M 12,30 H 52" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9" />
  </g>
</svg>`;

// 6. Icon White SVG
const iconWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="ALPAR AI Icon">
  <g transform="translate(8, 5)">
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M 32,16 L 18,30 M 32,16 L 46,30 M 18,30 L 32,46 L 46,30 M 32,46 L 32,60" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.5" />
    <circle cx="32" cy="16" r="3.5" fill="#FFFFFF" />
    <circle cx="18" cy="30" r="3.5" fill="#FFFFFF" />
    <circle cx="46" cy="30" r="3.5" fill="#FFFFFF" />
    <circle cx="32" cy="46" r="4.5" fill="#FFFFFF" />
    <circle cx="32" cy="60" r="3" fill="#FFFFFF" opacity="0.8" />
    <path d="M 12,30 H 52" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
  </g>
</svg>`;

// 7. Icon Black SVG
const iconBlackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="ALPAR AI Icon">
  <g transform="translate(8, 5)">
    <path d="M 32,4 C 18,5.2 8,7 6,8.5 V 36 C 6,56 18,65 32,70 C 46,65 58,56 58,36 V 8.5 C 56,7 46,5.2 32,4 Z" fill="none" stroke="#000000" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M 32,16 L 18,30 M 32,16 L 46,30 M 18,30 L 32,46 L 46,30 M 32,46 L 32,60" stroke="#000000" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.5" />
    <circle cx="32" cy="16" r="3.5" fill="#000000" />
    <circle cx="18" cy="30" r="3.5" fill="#000000" />
    <circle cx="46" cy="30" r="3.5" fill="#000000" />
    <circle cx="32" cy="46" r="4.5" fill="#000000" />
    <circle cx="32" cy="60" r="3" fill="#000000" opacity="0.8" />
    <path d="M 12,30 H 52" stroke="#000000" stroke-width="2" stroke-linecap="round" />
  </g>
</svg>`;

// 8. Brand Guidelines markdown
const guidelinesMarkdown = `# ALPAR AI — Brand Assets Guidelines

ALPAR AI is the trust infrastructure for AI accountability. Use these brand assets to represent ALPAR AI in reports, presentations, and website links.

## Color Palette

- **Primary Accent (Emerald Green)**: \`#00FF88\` (Representing safety, compliance readiness, active rating status).
- **Secondary Accent (Cyber Cyan)**: \`#00E5FF\` (Representing AI, precision audit tools, connectivity).
- **Dark Background (Deep Slate)**: \`#0A1622\` / \`#0B1622\`.
- **Text & Details (Off-White)**: \`#F8FAFC\` / \`#CBD5E1\`.

## Asset Types

- **logo-dark-theme.svg**: Primary logotype for dark backgrounds.
- **logo-light-theme.svg**: Primary logotype for light backgrounds.
- **logo-monochrome-white.svg**: Flat white logo for dark brand styling.
- **logo-monochrome-black.svg**: Flat black logo for print layouts.
- **icon-primary.svg**: Just the neural-shield icon mark in full color.
- **icon-white.svg**: White icon mark.
- **icon-black.svg**: Black icon mark.

Thank you for respecting our brand representation guidelines.
`;

// Write the files to the assets folder
console.log("Writing brand assets...");
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "logo-dark-theme.svg"), logoDarkSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "logo-light-theme.svg"), logoLightSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "logo-monochrome-white.svg"), logoWhiteSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "logo-monochrome-black.svg"), logoBlackSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "icon-primary.svg"), iconPrimarySvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "icon-white.svg"), iconWhiteSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "icon-black.svg"), iconBlackSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "README.md"), guidelinesMarkdown);

// Also overwrite the public/logo.svg to match our beautiful updated logo!
fs.writeFileSync(path.resolve("public/logo.svg"), logoDarkSvg);
console.log("Assets created. Overwrote public/logo.svg.");

// Create ZIP file using Powershell command
try {
  console.log("Creating ZIP archive...");
  execSync(
    'powershell -Command "Compress-Archive -Path \'public/brand-assets/*\' -DestinationPath \'public/brand-assets.zip\' -Force"'
  );
  console.log("Zip archive created successfully at public/brand-assets.zip");
} catch (err) {
  console.error("Failed to create ZIP using Powershell. Attempting fallback.", err.message);
}
