import * as XLSX from "xlsx";
import path from "path";

const filePath = path.join(process.cwd(), "docs", "DOC-306948A1.xls");
console.log(`Reading Excel file: ${filePath}`);

const workbook = XLSX.readFile(filePath);
console.log("Sheet Names:", workbook.SheetNames);

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log(`Total rows in ${sheetName}:`, data.length);
console.log("Headers (Row 1):", data[0]);
console.log("Row 2:", data[1]);
console.log("Sample Data (First 5 rows):");
console.dir(data.slice(0, 6), { depth: null });

process.exit(0);
