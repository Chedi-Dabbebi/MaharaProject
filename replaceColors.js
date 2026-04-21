const fs = require('fs');
const path = require('path');

const dir = './src';
const replacements = [
  { from: /#E23E57/gi, to: '#6366F1' },
  { from: /rgba\(226,\s*62,\s*87/g, to: 'rgba(99, 102, 241' },
  { from: /#10B981/gi, to: '#4ADE80' },
  { from: /#EF4444/gi, to: '#F87171' },
  { from: /#F8FAFC'/gi, to: '#E5E7EB\'' },
  { from: /#F8FAFC"/gi, to: '#E5E7EB"' }
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        // Skip F8FAFC replacement in ThemeContext to avoid breaking lightTheme background
        if (fullPath.includes('ThemeContext.tsx') && r.from.toString().includes('F8FAFC')) {
           continue; 
        }
        if (content.match(r.from)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDir(dir);
