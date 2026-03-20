const fs = require('fs');

const csv = fs.readFileSync('scripts/pa-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (!match) return null;
    
    const [, name, address, website] = match;
    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Children') || name.includes('Rehabilitation') || name.includes('Surgical') || name.includes('Orthopaedic') || name.includes('State Hospital') || name.includes('Philhaven') || name.includes('Fairmount') || name.includes('Foundations') || name.includes('Meadows') || name.includes('Roxbury') || name.includes('Eye Hospital')) {
        if (name.includes('Children')) type = "Childrens";
        else if (name.includes('Surgical') || name.includes('Orthopaedic') || name.includes('Eye Hospital')) {
            type = "Surgical";
        }
        else if (name.includes('Rehabilitation')) {
            type = "Rehabilitation";
        }
        else type = "Psychiatric";
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "PA",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const pennsylvaniaHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/pennsylvania-hospitals.ts', tsContent);
console.log(`Generated lib/data/pennsylvania-hospitals.ts with ${hospitals.length} hospitals.`);
