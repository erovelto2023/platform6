const fs = require('fs');

const csv = fs.readFileSync('scripts/ok-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (!match) return null;
    
    const [, name, address, website] = match;
    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Children') || name.includes('Rehabilitation') || name.includes('Spine') || name.includes('Surgical') || name.includes('Orthopedic') || name.includes('Orthopaedic') || name.includes('McCarty') || name.includes('Mental') || name.includes('Griffin') || name.includes('Brookhaven') || name.includes('Oakwood Springs') || name.includes('Rolling Hills')) {
        if (name.includes('Children')) type = "Childrens";
        else if (name.includes('Spine') || name.includes('Surgical') || name.includes('Orthopedic') || name.includes('Orthopaedic')) {
            type = "Surgical";
        }
        else if (name.includes('Rehabilitation') || name.includes('McCarty')) {
            type = "Rehabilitation";
        }
        else type = "Psychiatric";
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "OK",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const oklahomaHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/oklahoma-hospitals.ts', tsContent);
console.log(`Generated lib/data/oklahoma-hospitals.ts with ${hospitals.length} hospitals.`);
