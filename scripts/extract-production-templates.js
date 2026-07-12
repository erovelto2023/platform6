/**
 * Extract all Story Hacker templates from the production diagnostic API response
 * and save them as the definitive story-hacker-templates.json
 */
const fs = require('fs');
const path = require('path');

// Read the raw diagnostic response from the step file
const stepFile = path.join(
  'C:\\Users\\erove\\.gemini\\antigravity\\brain\\ece52af8-abb1-4728-9fd1-5a4f95a9c177\\.system_generated\\steps\\1638\\content.md'
);

const raw = fs.readFileSync(stepFile, 'utf-8');

// The JSON starts after the "---\n\n" separator
const jsonStart = raw.indexOf('{');
if (jsonStart === -1) {
  console.error('Could not find JSON in the step file');
  process.exit(1);
}

const jsonStr = raw.slice(jsonStart);
let data;
try {
  data = JSON.parse(jsonStr);
} catch (e) {
  console.error('Failed to parse JSON:', e.message);
  // Try to find the end of the JSON
  // The response might be truncated, let's try a different approach
  console.log('Attempting to find valid JSON boundary...');
  process.exit(1);
}

console.log('Successfully parsed production diagnostic response');

const results = data.results;

// Extract families
const families = (results.storyTemplateFamilies?.samples || []).map(f => ({
  name: f.name,
  description: f.description || '',
  isSystem: f.isSystem || false,
  _originalId: f._id
}));

// Extract subgenres  
const subgenres = (results.storyTemplateSubgenres?.samples || []).map(s => ({
  name: s.name,
  description: s.description || '',
  familyId: s.familyId,
  isSystem: s.isSystem || false,
  _originalId: s._id
}));

// Build familyId -> family name map
const familyMap = {};
families.forEach(f => {
  familyMap[f._originalId] = f.name;
});

// Build subgenreId -> subgenre name map  
const subgenreMap = {};
subgenres.forEach(s => {
  subgenreMap[s._originalId] = s.name;
});

// Resolve subgenre familyId to family name
subgenres.forEach(s => {
  s.familyName = familyMap[s.familyId] || 'Unknown';
  delete s.familyId;
});

// Extract templates
const templates = (results.storyTemplates?.samples || []).map(t => ({
  name: t.name,
  description: t.description || '',
  category: t.category || '',
  content: t.content || '',
  familyName: familyMap[t.familyId] || 'Unknown',
  subgenreName: subgenreMap[t.subgenreId] || 'Unknown',
  isSystem: t.isSystem || false,
  _originalId: t._id
}));

// Build the output JSON
const output = {
  families: families.map(f => ({
    name: f.name,
    description: f.description,
    isSystem: true  // Mark as system for seeding
  })),
  subgenres: subgenres.map(s => ({
    name: s.name,
    description: s.description,
    familyName: s.familyName,
    isSystem: true
  })),
  templates: templates.map(t => ({
    name: t.name,
    description: t.description,
    category: t.category,
    content: t.content,
    familyName: t.familyName,
    subgenreName: t.subgenreName,
    isSystem: true
  }))
};

console.log(`\nExtracted from production:`);
console.log(`  Families:  ${output.families.length}`);
console.log(`  Subgenres: ${output.subgenres.length}`);
console.log(`  Templates: ${output.templates.length}`);

// Print family names
console.log(`\nFamilies:`);
output.families.forEach(f => console.log(`  - ${f.name}`));

// Print subgenre names
console.log(`\nSubgenres:`);
output.subgenres.forEach(s => console.log(`  - ${s.name} (${s.familyName})`));

// Print template names
console.log(`\nTemplates:`);
output.templates.forEach(t => console.log(`  - ${t.name} [${t.category}] (${t.subgenreName})`));

// Save to file
const outPath = path.join(__dirname, 'story-hacker-templates.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`\n✅ Saved to ${outPath}`);
console.log(`   File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
