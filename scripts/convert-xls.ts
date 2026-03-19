import * as XLSX from 'xlsx';
import * as fs from 'fs';

async function convert() {
    console.log("Reading XLS file...");
    const workbook = XLSX.readFile('excel/ZIP_Locale_Detail.xls');
    console.log("Extracting sheet...");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log("Converting to CSV...");
    const csv = XLSX.utils.sheet_to_csv(sheet);
    console.log("Writing CSV file...");
    fs.writeFileSync('excel/ZIP_Locale_Detail_utf8.csv', csv);
    console.log("Done!");
}

convert();
