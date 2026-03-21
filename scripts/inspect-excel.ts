import * as XLSX from 'xlsx';
import path from 'path';

const filePath = path.join(process.cwd(), 'excel', 'metro_statistics_rankings_2025.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Sheet Name:", sheetName);
console.log("Headers (Row 1):", data[0]);
console.log("Sub-headers (Row 2):", data[1]);
console.log("Sample Data (First 10 rows):");
console.dir(data.slice(0, 10), { depth: null });
