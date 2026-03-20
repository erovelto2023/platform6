const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.resolve(process.cwd(), 'excel', 'HospitaList2025.xlsx');
const outputPath = path.resolve(process.cwd(), 'excel', 'HospitaList2025_Full.json');

function cleanData(data) {
    // Find the actual header row (some Excel files have titles in the first few rows)
    // We look for a row that has recognizable columns like "NAME", "CITY", "STATE"
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(data.length, 10); i++) {
        const row = data[i];
        const values = Object.values(row).map(v => String(v).toUpperCase());
        if (values.includes('NAME') || values.includes('CITY')) {
            headerRowIdx = i;
            break;
        }
    }

    if (headerRowIdx === -1) return data;

    // Use the values at headerRowIdx as keys for the subsequent rows
    const rawHeaders = data[headerRowIdx];
    const headerMap = {};
    Object.keys(rawHeaders).forEach(key => {
        headerMap[key] = String(rawHeaders[key]).trim();
    });

    const result = [];
    for (let i = headerRowIdx + 1; i < data.length; i++) {
        const row = data[i];
        const newRow = {};
        Object.keys(row).forEach(key => {
            const newKey = headerMap[key] || key;
            newRow[newKey] = row[key];
        });
        // Skip obvious empty rows or rows that are just separators
        if (newRow['NAME'] || newRow['Hospital Name']) {
            result.push(newRow);
        }
    }
    return result;
}

try {
    const workbook = XLSX.readFile(excelPath);
    let allHospitals = [];

    ['Acute Hospitals', 'Specialty'].forEach(name => {
        const sheet = workbook.Sheets[name];
        if (!sheet) return;
        
        // Read with raw header detection
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
        
        // Manually find the header row by looking for 'Name' or 'NAME'
        let headerRow = -1;
        const range = XLSX.utils.decode_range(sheet['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            let found = false;
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = sheet[XLSX.utils.encode_cell({r:R, c:C})];
                if (cell && cell.v && String(cell.v).match(/name|hospital/i)) {
                    headerRow = R;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        if (headerRow !== -1) {
            const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow });
            console.log(`Sheet "${name}": Extracted ${data.length} records starting from row ${headerRow + 1}`);
            allHospitals = allHospitals.concat(data.map(h => ({ ...h, _sourceSheet: name })));
        }
    });

    fs.writeFileSync(outputPath, JSON.stringify(allHospitals, null, 2));
    console.log(`Successfully merged ${allHospitals.length} hospitals to ${outputPath}`);
    
    if (allHospitals.length > 0) {
        console.log(`Sample Record:`, JSON.stringify(allHospitals[0], null, 2));
    }
} catch (error) {
    console.error('Error processing Excel:', error);
}
