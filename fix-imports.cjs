const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace relative imports specifically targeting src root files
  content = content.replace(/from\s+['"]\.\/LanguageContext['"]/g, `from '@/LanguageContext'`);
  content = content.replace(/from\s+['"]\.\.\/LanguageContext['"]/g, `from '@/LanguageContext'`);
  
  content = content.replace(/from\s+['"]\.\/translations['"]/g, `from '@/translations'`);
  content = content.replace(/from\s+['"]\.\.\/translations['"]/g, `from '@/translations'`);
  
  content = content.replace(/from\s+['"]\.\/Layout['"]/g, `from '@/components/layout/Layout'`);
  content = content.replace(/from\s+['"]\.\.\/Layout['"]/g, `from '@/components/layout/Layout'`);
  
  content = content.replace(/from\s+['"]\.\/lib\/supabase['"]/g, `from '@/lib/supabase'`);
  content = content.replace(/from\s+['"]\.\.\/lib\/supabase['"]/g, `from '@/lib/supabase'`);

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${file}`);
  }
});
