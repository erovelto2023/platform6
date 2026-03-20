const fs = require('fs');

const csv = fs.readFileSync('scripts/wv-hospitals.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('Hospital Name'));

const hospitals = lines.map(line => {
    // Handle double quotes inside fields (e.g., Hershel "Woody" Williams)
    // CSV format is "Name","Address","Website"
    // Regex to match "..." "..." "..."
    const match = line.match(/"(.+)","(.+)","(.+)"/);
    if (!match) return null;
    
    let [, name, address, website] = match;
    
    // Clean up escaped quotes if any (though match above might be greedy)
    // Re-parsing logic for Hershel ""Woody"" Williams
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
    name = parts[0];
    address = parts[1];
    website = parts[2];

    const addressParts = address.split(', ');
    const city = addressParts[addressParts.length - 2] || '';
    
    let type = "Acute Care Hospitals";
    if (name.includes('Psychiatric') || name.includes('Behavioral') || name.includes('Highland') || name.includes('River Park') || name.includes('Bateman') || name.includes('Sharpe') || name.includes('Surgical') || name.includes('Veterans') || name.includes('VA Medical Center')) {
        if (name.includes('Children')) type = "Childrens";
        else if (name.includes('Surgical')) {
            type = "Surgical";
        }
        else if (name.includes('Veterans') || name.includes('VA Medical Center')) {
            type = "Acute Care - Veterans Administration";
        }
        else type = "Psychiatric";
    }
    
    return {
        name,
        address,
        website,
        city,
        state: "WV",
        type,
        beds: 0,
        safetyGrade: "B",
        url: "",
        safetyGradeUrl: ""
    };
}).filter(Boolean);

const tsContent = `export const westVirginiaHospitals = ${JSON.stringify(hospitals, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('lib/data/west-virginia-hospitals.ts', tsContent);
console.log(`Generated lib/data/west-virginia-hospitals.ts with ${hospitals.length} hospitals.`);
