const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'app', '(dashboard)', 'tools', 'pdf-suite');

console.log(`Target Directory: ${targetDir}`);

if (!fs.existsSync(targetDir)) {
    console.error(`Directory does not exist: ${targetDir}`);
    process.exit(1);
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

try {
    const files = getAllFiles(targetDir);
    console.log(`Found ${files.length} files to process.`);

    let fixedCount = 0;

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let originalContent = content;

        // Replacements
        // 1. Translations
        content = content.replace(/import\s+{\s*useTranslations\s*}\s+from\s+['"]next-intl['"];?/g,
            "import { usePDFTranslations as useTranslations } from '@/app/(dashboard)/tools/pdf-suite/_lib/use-translations';");

        content = content.replace(/import\s+{\s*useTranslations\s*}\s+from\s+['"]next-intl\/client['"];?/g,
            "import { usePDFTranslations as useTranslations } from '@/app/(dashboard)/tools/pdf-suite/_lib/use-translations';");

        // 2. Config
        content = content.replace(/@\/config\//g, '@/app/(dashboard)/tools/pdf-suite/_config/');

        // 3. Lib
        content = content.replace(/@\/lib\//g, '@/app/(dashboard)/tools/pdf-suite/_lib/');

        // 4. Components Common
        content = content.replace(/@\/components\/common\//g, '@/app/(dashboard)/tools/pdf-suite/_components/common/');

        // 5. Components UI
        content = content.replace(/@\/components\/ui\//g, '@/app/(dashboard)/tools/pdf-suite/_components/ui/');

        // 6. Components Tools
        content = content.replace(/@\/components\/tools\//g, '@/app/(dashboard)/tools/pdf-suite/_components/tools/');

        // 7. Types
        content = content.replace(/@\/types\//g, '@/app/(dashboard)/tools/pdf-suite/_types/');

        if (content !== originalContent) {
            // console.log(`Fixing imports in: ${file}`);
            fs.writeFileSync(file, content, 'utf8');
            fixedCount++;
        }
    });

    console.log(`Import fix complete. Modified ${fixedCount} files.`);
} catch (error) {
    console.error("Error processing files:", error);
}
