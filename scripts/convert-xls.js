const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

async function convert() {
    try {
        const xlsPath = path.join(__dirname, '../excel/ZIP_Locale_Detail.xls');
        const csvPath = path.join(__dirname, '../excel/ZIP_Locale_Detail_utf8.csv');

        console.log(`Reading XLS file from ${xlsPath}...`);
        if (!fs.existsSync(xlsPath)) {
            throw new Error(`XLS file not found at ${xlsPath}`);
        }

        const workbook = XLSX.readFile(xlsPath);
        console.log("Extracting sheet...");
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        console.log("Converting to CSV...");
        const csv = XLSX.utils.sheet_to_csv(sheet);
        console.log(`Writing CSV file to ${csvPath}...`);
        fs.writeFileSync(csvPath, csv);
        console.log("Done!");
    } catch (error) {
        console.error("Conversion failed:", error);
        process.exit(1);
    }
}

convert();
