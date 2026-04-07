#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Please run: npm install --save-dev sharp');
  process.exit(1);
}

// App colors
const COLORS = {
  background: '#311D3F',
  primary: '#E23E57',
  accent: '#F8FAFC',
};

// Generate SVG icon as data URI for Sharp
function createIconSVG(size) {
  const viewBox = `0 0 ${size} ${size}`;
  const scale = size / 108;

  return `
<svg width="${size}" height="${size}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${COLORS.background}"/>
  <g transform="translate(${27 * scale}, ${27 * scale}) scale(${1.5 * scale})">
    <!-- Main star shape -->
    <path fill="${COLORS.primary}" d="M27,4L31.5,17.5L46,17.5L34.5,26.5L39,40L27,31.5L15,40L19.5,26.5L8,17.5L22.5,17.5L27,4Z"/>
    <!-- Inner accent -->
    <path fill="${COLORS.accent}" d="M27,12L29.5,19L37,19L31,23.5L33.5,30.5L27,26L20.5,30.5L23,23.5L17,19L24.5,19L27,12Z"/>
  </g>
</svg>
  `.trim();
}

// iOS icon sizes
const IOS_ICONS = [
  { size: 40, filename: 'AppIcon-20x20@2x.png' },
  { size: 60, filename: 'AppIcon-20x20@3x.png' },
  { size: 58, filename: 'AppIcon-29x29@2x.png' },
  { size: 87, filename: 'AppIcon-29x29@3x.png' },
  { size: 80, filename: 'AppIcon-40x40@2x.png' },
  { size: 120, filename: 'AppIcon-40x40@3x.png' },
  { size: 120, filename: 'AppIcon-60x60@2x.png' },
  { size: 180, filename: 'AppIcon-60x60@3x.png' },
  { size: 1024, filename: 'AppIcon-1024x1024.png' },
];

// Android icon sizes
const ANDROID_ICONS = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

async function generateIcons() {
  const projectRoot = path.resolve(__dirname, '..');
  const iosDir = path.join(projectRoot, 'ios', 'projectApp', 'Images.xcassets', 'AppIcon.appiconset');
  const androidDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');

  console.log('Generating minimal app icons...\n');

  // Generate iOS icons
  console.log('iOS Icons:');
  for (const icon of IOS_ICONS) {
    const svg = createIconSVG(icon.size);
    const outputPath = path.join(iosDir, icon.filename);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`  ✓ ${icon.filename} (${icon.size}x${icon.size})`);
  }

  // Generate Android icons (both ic_launcher and ic_launcher_round)
  console.log('\nAndroid Icons:');
  for (const icon of ANDROID_ICONS) {
    const svg = createIconSVG(icon.size);
    const densityDir = path.join(androidDir, icon.dir);

    // Ensure directory exists
    if (!fs.existsSync(densityDir)) {
      fs.mkdirSync(densityDir, { recursive: true });
    }

    // Generate regular launcher icon
    const regularPath = path.join(densityDir, 'ic_launcher.png');
    await sharp(Buffer.from(svg))
      .png()
      .toFile(regularPath);
    console.log(`  ✓ ${icon.dir}/ic_launcher.png (${icon.size}x${icon.size})`);

    // Generate round launcher icon (same design, will be masked to circle by system)
    const roundPath = path.join(densityDir, 'ic_launcher_round.png');
    await sharp(Buffer.from(svg))
      .png()
      .toFile(roundPath);
    console.log(`  ✓ ${icon.dir}/ic_launcher_round.png (${icon.size}x${icon.size})`);
  }

  console.log('\n✓ All icons generated successfully!');
  console.log('\nNote: The icons use a minimal star/sparkle design in the app\'s brand colors.');
  console.log('For Android 7.1+, adaptive icons (XML-based) are used.');
  console.log('For older Android versions, PNG fallbacks are generated.');
}

generateIcons().catch(console.error);
