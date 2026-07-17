import fs from 'fs';
import { execSync } from 'child_process';

// A rough regex to extract all slugs or installSlugs from the registry file
const registryContent = fs.readFileSync('tmp/ui-components-repo/lib/registry.ts', 'utf-8');

// Find all slugs (both component and example level)
// We'll just regex for `installSlug: "something"` and `slug: "something"`
const slugs = new Set<string>();

const matches = registryContent.matchAll(/(?:installSlug|slug):\s*"([^"]+)"/g);
for (const match of matches) {
  const slug = match[1];
  // Filter out category slugs
  if (slug !== 'motion' && slug !== 'blocks' && !slug.includes(' ')) {
    slugs.add(slug);
  }
}

// Removing generic names that might just be variants without registry endpoints 
// but we'll try them anyway.
const slugList = Array.from(slugs);

console.log(`Found ${slugList.length} potential components/variants to install.`);

// Let's run them one by one to avoid CLI length limits or complete failure on one error
for (const slug of slugList) {
  try {
    console.log(`Installing ${slug}...`);
    // Some are blocks, some are motion primitives. Using direct URL is safest.
    // However, the README says `@beui/slug` works if Shadcn knows about it, but direct URL is safer.
    execSync(`npx shadcn@latest add https://beui.dev/r/${slug}.json --yes --overwrite`, { 
      stdio: 'inherit',
      cwd: process.cwd() 
    });
  } catch (error) {
    console.log(`Failed to install ${slug}. It might be a variant slug without a direct JSON endpoint.`);
  }
}

console.log('Finished attempting to install all components.');
