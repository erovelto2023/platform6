const fs = require('fs');

const csv = fs.readFileSync('scripts/nc-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (!match) return null;
    
    const [, name, address, website] = match;
    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Hospital') && (name.includes('Broughton') || name.includes('Cherry') || name.includes('Central Regional') || name.includes('Julian F. Keith') || name.includes('Walter B. Jones') || name.includes('Holly Hill') || name.includes('Brynn Marr'))) {
        type = "Psychiatric";
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "NC",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const northCarolinaHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/north-carolina-hospitals.ts', tsContent);
console.log(`Generated lib/data/north-carolina-hospitals.ts with ${hospitals.length} hospitals.`);
