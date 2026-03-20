const fs = require('fs');

const csv = fs.readFileSync('scripts/oh-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (!match) return null;
    
    const [, name, address, website] = match;
    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Children') || name.includes('Rehabilitation') || name.includes('Ortho') || name.includes('Surgical') || name.includes('Springs') || name.includes('Vista') || name.includes('Assurance') || name.includes('Center of HOPE') || name.includes('Sojourn')) {
        if (name.includes('Children')) type = "Childrens";
        else if (name.includes('Rehabilitation') || name.includes('Ortho') || name.includes('Surgical')) {
            if (name.includes('Ortho') || name.includes('Surgical')) type = "Surgical";
            else type = "Rehabilitation";
        }
        else type = "Psychiatric";
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "OH",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const ohioHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/ohio-hospitals.ts', tsContent);
console.log(`Generated lib/data/ohio-hospitals.ts with ${hospitals.length} hospitals.`);
