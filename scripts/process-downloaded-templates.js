const fs = require('fs');
const path = require('path');

// Absolute path to the downloaded JSON/MD file
const srcPath = 'C:\\Users\\erove\\.gemini\\antigravity\\brain\\ece52af8-abb1-4728-9fd1-5a4f95a9c177\\.system_generated\\steps\\1545\\content.md';

function processFile() {
  try {
    const rawContent = fs.readFileSync(srcPath, 'utf8');
    
    // Find where the JSON starts. It's on line 5 (after the header)
    const jsonStartIndex = rawContent.indexOf('{"success":true');
    if (jsonStartIndex === -1) {
      throw new Error("Could not find start of JSON content in the file.");
    }
    
    const jsonString = rawContent.substring(jsonStartIndex).trim();
    const data = JSON.parse(jsonString);
    
    if (!data.success || !data.results) {
      throw new Error("JSON data did not indicate success or missing results.");
    }
    
    const { storyTemplateFamilies, storyTemplateSubgenres, storyTemplates } = data.results;
    
    console.log(`Found ${storyTemplateFamilies.count} families`);
    console.log(`Found ${storyTemplateSubgenres.count} subgenres`);
    console.log(`Found ${storyTemplates.count} templates`);
    
    // Clean up MongoDB specific fields and make them seedable
    const families = storyTemplateFamilies.samples.map(f => ({
      _id: f._id,
      name: f.name,
      description: f.description || '',
      isSystem: true // Force system so all users see them
    }));
    
    const subgenres = storyTemplateSubgenres.samples.map(s => ({
      _id: s._id,
      name: s.name,
      description: s.description || '',
      familyId: s.familyId,
      isSystem: true
    }));
    
    const templates = storyTemplates.samples.map(t => ({
      _id: t._id,
      name: t.name,
      description: t.description || '',
      category: t.category,
      content: t.content || '',
      familyId: t.familyId,
      subgenreId: t.subgenreId,
      isSystem: true
    }));
    
    const output = {
      families,
      subgenres,
      templates
    };
    
    const destPath = path.join(process.cwd(), 'scripts', 'story-hacker-templates.json');
    fs.writeFileSync(destPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`Successfully wrote processed templates to ${destPath}`);
  } catch (error) {
    console.error("Error processing templates:", error);
  }
}

processFile();
