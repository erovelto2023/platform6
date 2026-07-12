/**
 * Download all Story Hacker templates from the PRODUCTION diagnostic API
 * and save as the definitive story-hacker-templates.json
 * 
 * PREREQUISITE: Production server must be rebuilt with the fullTemplates parameter.
 * Run: git pull && npm run build && pm2 restart all (on Hostinger)
 * 
 * Usage: node scripts/download-production-templates.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://kbusinessacademy.com/api/admin/db-diagnostic?token=check_db_7788&fullTemplates=true';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading templates from production...');
  console.log(`URL: ${API_URL}\n`);

  const data = await fetchJSON(API_URL);
  
  if (!data.success) {
    console.error('API returned error:', data.error);
    process.exit(1);
  }

  const results = data.results;

  const rawFamilies = results.storyTemplateFamilies?.samples || [];
  const rawSubgenres = results.storyTemplateSubgenres?.samples || [];
  const rawTemplates = results.storyTemplates?.samples || [];

  console.log(`Production database counts:`);
  console.log(`  Families:  ${results.storyTemplateFamilies?.count} (received: ${rawFamilies.length})`);
  console.log(`  Subgenres: ${results.storyTemplateSubgenres?.count} (received: ${rawSubgenres.length})`);
  console.log(`  Templates: ${results.storyTemplates?.count} (received: ${rawTemplates.length})`);

  if (rawTemplates.length < results.storyTemplates?.count) {
    console.error('\n❌ NOT ALL TEMPLATES RECEIVED!');
    console.error('   The production server may not be rebuilt yet.');
    console.error('   Run these commands on Hostinger first:');
    console.error('     git pull origin main');
    console.error('     npm run build');
    console.error('     pm2 restart all');
    console.error('   Then run this script again.');
    process.exit(1);
  }

  // Build ID -> name maps
  const familyMap = {};
  rawFamilies.forEach(f => { familyMap[f._id] = f.name; });
  
  const subgenreMap = {};
  rawSubgenres.forEach(s => { subgenreMap[s._id] = s.name; });

  // Build output
  const output = {
    families: rawFamilies.map(f => ({
      name: f.name,
      description: f.description || '',
      isSystem: true
    })),
    subgenres: rawSubgenres.map(s => ({
      name: s.name,
      description: s.description || '',
      familyName: familyMap[s.familyId] || 'Unknown',
      isSystem: true
    })),
    templates: rawTemplates.map(t => ({
      name: t.name,
      description: t.description || '',
      category: t.category || '',
      content: t.content || '',
      familyName: familyMap[t.familyId] || 'Unknown',
      subgenreName: subgenreMap[t.subgenreId] || 'Unknown',
      isSystem: true
    }))
  };

  // Save
  const outPath = path.join(__dirname, 'story-hacker-templates.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  
  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`\n✅ Saved ${output.templates.length} templates to ${outPath} (${sizeKB} KB)`);
  console.log('\nNext steps:');
  console.log('  git add scripts/story-hacker-templates.json');
  console.log('  git commit -m "Update story-hacker-templates.json with all production templates"');
  console.log('  git push origin main');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
