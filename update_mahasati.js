const fs = require('fs');

const path = 'src/data/content.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/Mahasati/g, 'Aryika');
content = content.replace(/mahasati/gi, 'Aryika');
content = content.replace(/महासती/g, 'आर्यिका');

fs.writeFileSync(path, content, 'utf8');
console.log('Renamed Mahasati to Aryika');
