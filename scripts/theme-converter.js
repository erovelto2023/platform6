const fs = require('fs');
const path = require('path');

const directories = [
  'app/locations',
  'components/locations'
];

// Dark mode to Light mode SaaS mapping
const replacements = {
  'bg-slate-950': 'bg-[#f8f9fa]',
  'bg-slate-900/40': 'bg-white',
  'bg-slate-900/10': 'bg-slate-50',
  'bg-slate-900/20': 'bg-slate-50',
  'bg-slate-900': 'bg-white',
  
  'bg-slate-800/40': 'bg-white border-slate-200/50',
  'bg-slate-800/20': 'bg-slate-50',
  'bg-slate-800': 'bg-slate-100',
  
  'border-slate-900': 'border-slate-200',
  'border-slate-800/50': 'border-slate-200',
  'border-slate-800': 'border-slate-200',
  'border-slate-700/50': 'border-slate-200',
  'border-slate-700': 'border-slate-300',
  
  'text-slate-400': 'text-slate-600',
  'text-slate-500': 'text-slate-500',
  'text-slate-300': 'text-slate-700',
  'text-slate-200': 'text-slate-800',
  
  'text-white': 'text-[#0e0021]',
};

// Edge cases where 'text-white' shouldn't become 'text-[#0e0021]' because they are solid colored buttons/badges
const solidBackgroundFixes = {
  'bg-purple-500 text-\\[#0e0021\\]': 'bg-purple-500 text-white',
  'bg-emerald-500 hover:bg-emerald-400 text-\\[#0e0021\\]': 'bg-emerald-500 hover:bg-emerald-400 text-white',
  'data-\\[state=active\\]:text-\\[#0e0021\\]': 'data-[state=active]:text-white',
  'hover:text-\\[#0e0021\\]': 'hover:text-[#8422dc]',
  'group-hover:text-\\[#0e0021\\]': 'group-hover:text-[#8422dc]',
  'bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-\\[#0e0021\\]': 'bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white',
};

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // 1. Apply primary replacements
      for (const [search, replace] of Object.entries(replacements)) {
        // use regex with word boundaries to avoid double replacing (e.g. text-slate-500 inside of something else) but for class names simple replace all is okay
        const regex = new RegExp(search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        content = content.replace(regex, replace);
      }

      // 2. Fix known broken badges
      for (const [search, replace] of Object.entries(solidBackgroundFixes)) {
        const regex = new RegExp(search, 'g');
        content = content.replace(regex, replace);
      }
      
      // 3. Optional: Specifically transform some emerald/purple dark variants to light variants
      content = content.replace(/text-emerald-400/g, 'text-emerald-700');
      content = content.replace(/bg-emerald-500\/10/g, 'bg-emerald-50');
      content = content.replace(/bg-slate-950/g, 'bg-slate-50'); // Just in case it missed some

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log('Theme conversion complete.');
