const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, '../app'),
    path.join(__dirname, '../components'),
    path.join(__dirname, '../lib')
];

function processDirectory(directory) {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.md')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    let modified = content
        // 1. Swap purple classes with sky (Ocean Blue)
        .replace(/purple-([0-9]{2,3})/g, 'sky-$1')
        
        // 2. Swap pink classes with indigo (Deep Blue/Purple)
        .replace(/pink-([0-9]{2,3})/g, 'indigo-$1')
        
        // 3. Swap specific harsh hex colors if they are hardcoded inline
        .replace(/#8322dc|#8422dc|#9333ea/gi, '#0284c7') // Sky 600
        .replace(/#ec4899/gi, '#4f46e5') // Indigo 600
        .replace(/#0e0021|#0b0b0f/gi, '#f8fafc'); // Very light slate for backgrounds

    if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        console.log(`Updated: ${filePath.replace(path.join(__dirname, '..'), '')}`);
    }
}

console.log('Applying "Calm Educational" Theme...');
targetDirs.forEach(dir => processDirectory(dir));
console.log('Complete!');
