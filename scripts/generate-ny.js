const fs = require('fs');

const csv = fs.readFileSync('scripts/ny-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (!match) return null;
    
    const [, name, address, website] = match;
    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Four Winds') || name.includes('Gracie Square') || name.includes('South Oaks') || name.includes('South Beach') || name.includes('BryLin')) {
        type = "Psychiatric";
    } else if (name.includes('Children') && !name.includes('Center')) {
        type = "Childrens";
    } else if (name.includes('Rehabilitation') || name.includes('Hayes')) {
        type = "Rehabilitation";
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "NY",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const newYorkHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/new-york-hospitals.ts', tsContent);
console.log(`Generated lib/data/new-york-hospitals.ts with ${hospitals.length} hospitals.`);
