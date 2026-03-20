const fs = require('fs');

const csv = fs.readFileSync('scripts/va-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (!match) return null;
    
    const [, name, address, website] = match;
    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Children') || name.includes('Rehabilitation') || name.includes('Surgical') || name.includes('Orthopedic') || name.includes('State Hospital') || name.includes('Mental Health Institute') || name.includes('Poplar Springs') || name.includes('Dominion Hospital') || name.includes('Pavilion at Williamsburg') || name.includes('Catawba Hospital') || name.includes('Naval Medical Center') || name.includes('Army Medical Center') || name.includes('Veterans') || name.includes('VA Medical Center') || name.includes('Davis Medical Center')) {
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
        else type = "Psychiatric"; // e.g., Davis Medical Center (state psych), Poplar Springs, Dominion
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "VA",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const virginiaHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/virginia-hospitals.ts', tsContent);
console.log(`Generated lib/data/virginia-hospitals.ts with ${hospitals.length} hospitals.`);
