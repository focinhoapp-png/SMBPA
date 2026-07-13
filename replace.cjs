const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-\[#1a718c\]/g, 'bg-guapi-green');
  content = content.replace(/hover:bg-\[#155b70\]/g, 'hover:bg-guapi-green-dark');
  content = content.replace(/text-\[#1a718c\]/g, 'text-guapi-green');
  content = content.replace(/border-\[#1a718c\]/g, 'border-guapi-green');
  content = content.replace(/focus:border-\[#1a718c\]/g, 'focus:border-guapi-green');
  content = content.replace(/hover:bg-\[#1a718c\]/g, 'hover:bg-guapi-green');
  fs.writeFileSync(file, content);
});
