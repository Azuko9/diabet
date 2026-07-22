const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const templatePath = path.join(rootDir, 'src', 'index.template.html');
const partialsDir = path.join(rootDir, 'src', 'partials');
const outputPath = path.join(rootDir, 'index.html');

const template = fs.readFileSync(templatePath, 'utf8');

const html = template.replace(/<!--\s*INCLUDE:([\w.-]+)\s*-->/g, (match, filename) => {
  const partialPath = path.join(partialsDir, filename);
  if (!fs.existsSync(partialPath)) {
    throw new Error(`Partial introuvable: ${filename} (attendu dans ${partialsDir})`);
  }
  return fs.readFileSync(partialPath, 'utf8').replace(/\n$/, '');
});

fs.writeFileSync(outputPath, html);
console.log(`index.html généré à partir de src/index.template.html + src/partials/*.html`);
