const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.resolve(process.cwd(), 'excel', 'HospitaList2025.xlsx');

try {
    const workbook = XLSX.readFile(excelPath);
    workbook.SheetNames.forEach(name => {
        const sheet = workbook.Sheets[name];
        const range = XLSX.utils.decode_range(sheet['!ref']);
        console.log(`--- Sheet: ${name} ---`);
        for (let R = 0; R <= Math.min(range.e.r, 10); ++R) {
            let row = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = sheet[XLSX.utils.encode_cell({r:R, c:C})];
                row.push(cell ? cell.v : "");
            }
            if (row.some(v => v !== "")) {
                console.log(`Row ${R}: ${row.join(' | ')}`);
            }
        }
    });
} catch (error) {
    console.error('Error:', error);
}
