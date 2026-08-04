const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replaceAll("Today's Divine Focus", "Today's Challenge");
  content = content.replaceAll("आज का दिव्य लक्ष्य", "आज का चैलेंज");
  content = content.replaceAll("Tomorrow's Divine Focus", "Tomorrow's Challenge");
  content = content.replaceAll("कल का दिव्य लक्ष्य", "कल का चैलेंज");
  content = content.replaceAll("Base Punya", "Base Points");
  content = content.replaceAll("मूल पुण्य", "मूल अंक");
  content = content.replaceAll("आज की साधना पूर्ण हुई", "आज का टास्क पूरा हुआ");
  content = content.replaceAll("Today's Journey Completed", "Today's Tasks Completed");
  content = content.replaceAll("Today's Sadhana", "Today's Tasks");
  content = content.replaceAll("आज की साधना", "आज के टास्क");

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Replacement complete.');
