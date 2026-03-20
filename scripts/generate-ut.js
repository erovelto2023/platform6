const fs = require('fs');

const csv = fs.readFileSync('scripts/ut-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (!match) return null;
    
    const [, name, address, website] = match;
    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Children') || name.includes('Rehabilitation') || name.includes('Surgical') || name.includes('Orthopedic') || name.includes('State Hospital') || name.includes('Spine') || name.includes('Army Medical Center') || name.includes('Veterans') || name.includes('Marian Center')) {
        if (name.includes('Children')) type = "Childrens";
        else if (name.includes('Surgical') || name.includes('Orthopedic') || name.includes('Spine')) {
            type = "Surgical";
        }
        else if (name.includes('Rehabilitation')) {
            type = "Rehabilitation";
        }
        else if (name.includes('Army Medical Center') || name.includes('Veterans')) {
            type = "Acute Care - Veterans Administration";
        }
        else type = "Psychiatric";
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "UT",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const utahHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/utah-hospitals.ts', tsContent);
console.log(`Generated lib/data/utah-hospitals.ts with ${hospitals.length} hospitals.`);
