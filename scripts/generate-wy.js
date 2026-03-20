const fs = require('fs');

const csv = fs.readFileSync('scripts/wy-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    // Basic CSV parser to handle quotes
    const parts = [];
    let currentPart = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i+1] === '"') {
                currentPart += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            parts.push(currentPart);
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    parts.push(currentPart);
    
    if (parts.length < 3) return null;
    const name = parts[0];
    const address = parts[1];
    const website = parts[2];

    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Mental Health') || name.includes('Children') || name.includes('Rehabilitation') || name.includes('Surgical') || name.includes('Orthopedic') || name.includes('State Hospital') || name.includes('Institute') || name.includes('Veterans') || name.includes('VA Medical Center')) {
        if (name.includes('Children')) type = "Childrens";
        else if (name.includes('Surgical') || name.includes('Orthopedic') || name.includes('Spine')) {
            type = "Surgical";
        }
        else if (name.includes('Rehabilitation')) {
            type = "Rehabilitation";
        }
        else if (name.includes('Naval Medical Center') || name.includes('Army Medical Center') || name.includes('Veterans') || name.includes('VA Medical Center')) {
            type = "Acute Care - Veterans Administration";
        }
        else if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Mental Health') || name.includes('Institute')) {
            type = "Psychiatric";
        }
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "WY",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const wyomingHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/wyoming-hospitals.ts', tsContent);
console.log(`Generated lib/data/wyoming-hospitals.ts with ${hospitals.length} hospitals.`);
