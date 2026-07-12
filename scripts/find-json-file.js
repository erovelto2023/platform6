const fs = require('fs');
const path = require('path');

// Let's find any files in .system_generated that might contain the JSON.
function search() {
  const baseDir = 'C:\\Users\\erove\\.gemini\\antigravity\\brain\\ece52af8-abb1-4728-9fd1-5a4f95a9c177';
  
  function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if (file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.json')) {
          results.push(file);
        }
      }
    });
    return results;
  }

  try {
    const files = walk(baseDir);
    console.log(`Found ${files.length} candidate files`);
    
    // We are looking for files containing "check_db_7788" or "storyTemplates"
    for (const file of files) {
      if (file.includes('scratch') || file.includes('logs')) continue;
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('check_db_7788') && content.includes('"storyTemplates"')) {
        console.log(`MATCH: ${file} (length: ${content.length})`);
        
        // Find JSON start
        const jsonStartIndex = content.indexOf('{"success":true');
        if (jsonStartIndex !== -1) {
          const jsonString = content.substring(jsonStartIndex).trim();
          try {
            const data = JSON.parse(jsonString);
            console.log(`JSON parsed!`);
            console.log(`storyTemplates count: ${data.results.storyTemplates.count}, samples: ${data.results.storyTemplates.samples.length}`);
            console.log(`storyTemplateSubgenres count: ${data.results.storyTemplateSubgenres.count}, samples: ${data.results.storyTemplateSubgenres.samples.length}`);
            console.log(`storyTemplateFamilies count: ${data.results.storyTemplateFamilies.count}, samples: ${data.results.storyTemplateFamilies.samples.length}`);
            
            // Let's print out the first template name to see if it's correct
            console.log(`First template: ${data.results.storyTemplates.samples[0].name}`);
          } catch (e) {
            console.log(`JSON parse error on ${file}:`, e.message);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

search();
