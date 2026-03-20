const fs = require('fs');

const csv = fs.readFileSync('scripts/al-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    const match = line.match(/"([^"]+)","([^"]+)","([^"]+)"/);
    if (!match) return null;
    
    const [, name, address, website] = match;
    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Children') || name.includes('Rehabilitation') || name.includes('Surgical') || name.includes('Orthopedic') || name.includes('State Hospital') || name.includes('Mental Health') || name.includes('Counseling Center') || name.includes('Veterans') || name.includes('VA Medical Center')) {
        if (name.includes('Children')) type = "Childrens";
        else if (name.includes('Surgical') || name.includes('Orthopedic')) type = "Surgical";
        else if (name.includes('Rehabilitation')) type = "Rehabilitation";
        else if (name.includes('Veterans') || name.includes('VA Medical Center')) type = "Acute Care - Veterans Administration";
        else type = "Psychiatric";
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "AL",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const alabamaHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/alabama-hospitals.ts', tsContent);
console.log(`Generated lib/data/alabama-hospitals.ts with ${hospitals.length} hospitals.`);
