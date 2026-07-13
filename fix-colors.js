const fs = require('fs');
const files = ['src/pages/MyPets.tsx', 'src/pages/RegisterPet.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-\[guapi-green\]/g, 'text-guapi-green');
  content = content.replace(/bg-\[guapi-green\]/g, 'bg-guapi-green');
  content = content.replace(/border-\[guapi-green\]/g, 'border-guapi-green');
  content = content.replace(/ring-\[guapi-green\]/g, 'ring-guapi-green');
  content = content.replace(/text-blue-600/g, 'text-guapi-green');
  content = content.replace(/hover:text-blue-800/g, 'hover:text-guapi-green-dark');
  content = content.replace(/hover:bg-blue-50/g, 'hover:bg-guapi-green/10');
  content = content.replace(/hover:bg-blue-800/g, 'hover:bg-guapi-green-dark');
  content = content.replace(/text-blue-800/g, 'text-guapi-green-dark');
  content = content.replace(/border-blue-500/g, 'border-guapi-green');
  content = content.replace(/ring-blue-500/g, 'ring-guapi-green');
  fs.writeFileSync(file, content);
});
