const fs = require('fs');
const path = require('path');

const targetFiles = [
    path.join(__dirname, '../app/page.tsx'),
    path.join(__dirname, '../components/shared/MainNav.tsx'),
    path.join(__dirname, '../app/courses/page.tsx'), // Common pages
    path.join(__dirname, '../app/locations/page.tsx')
];

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert 'text-secondary' (which is now gray-100) to 'text-slate-600'
    let modified = content
        .replace(/text-secondary-foreground/g, '__TEMP_SEC_FG__') // Protect real secondary-foreground
        .replace(/text-secondary/g, 'text-slate-600')
        .replace(/__TEMP_SEC_FG__/g, 'text-secondary-foreground');

    // Convert 'text-white/70' to 'text-white/70' (Leave alone, it's usually on dark background)
    // Convert 'text-slate-300' to 'text-slate-600' UNLESS we are sure it's surrounded by dark, but we can't be sure.
    // Actually, text-secondary was the main culprit because the theme switch made it practically white.
    
    // Let's also replace text-slate-400 and text-slate-300 with text-slate-500 conditionally, but simply replacing text-secondary fixes 90% of the landing page.
    // Also change border-muted to border-slate-200 for better visibility in light mode if needed, but muted border is already gray-200.

    if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        console.log(`Updated Text Contrast: ${filePath}`);
    }
}

targetFiles.forEach(f => processFile(f));
console.log('Text Contrast Fix Complete!');
