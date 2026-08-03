const fs = require('fs');

const path = 'src/data/content.ts';
let content = fs.readFileSync(path, 'utf8');

const translations = {
  // Food Discipline
  'बेकरी उत्पाद से परहेज': { hi: 'आज मैंने बेकरी उत्पाद नहीं खाए', en: 'Today I avoided bakery products' },
  'पिज्जा/बर्गर से परहेज': { hi: 'आज मैंने पिज्जा/बर्गर नहीं खाया', en: 'Today I did not eat pizza/burger' },
  'कोल्ड ड्रिंक से परहेज': { hi: 'आज मैंने कोल्ड ड्रिंक नहीं पी', en: 'Today I did not drink cold drinks' },
  'सॉस/केचप से परहेज': { hi: 'आज मैंने सॉस/केचप नहीं खाया', en: 'Today I avoided sauce/ketchup' },
  'मैगी/नूडल्स से परहेज': { hi: 'आज मैंने मैगी/नूडल्स नहीं खाए', en: 'Today I avoided maggi/noodles' },
  'चिप्स/नमकीन से परहेज': { hi: 'आज मैंने चिप्स/नमकीन नहीं खाए', en: 'Today I avoided chips/snacks' },
  'बाहर का खाना नहीं': { hi: 'आज मैंने बाहर का खाना नहीं खाया', en: 'Today I did not eat outside food' },

  // Digital
  'टीवी नहीं देखा': { hi: 'आज मैंने टीवी नहीं देखा', en: 'Today I did not watch TV' },
  'इंस्टाग्राम से परहेज': { hi: 'आज मैंने इंस्टाग्राम नहीं चलाया', en: 'Today I avoided Instagram' },
  'फेसबुक से परहेज': { hi: 'आज मैंने फेसबुक नहीं चलाया', en: 'Today I avoided Facebook' },
  'व्हाट्सएप संयम': { hi: 'आज मैंने व्हाट्सएप का कम उपयोग किया', en: 'Today I limited WhatsApp usage' },
  'मूवी/वेब सीरीज नहीं देखी': { hi: 'आज मैंने मूवी/वेब सीरीज नहीं देखी', en: 'Today I did not watch movies/web series' },
  'गेमिंग से परहेज': { hi: 'आज मैंने वीडियो गेम नहीं खेले', en: 'Today I avoided gaming' },
  'PUBG/FreeFire/COD नहीं खेला': { hi: 'आज मैंने PUBG/FreeFire/COD नहीं खेला', en: 'Today I did not play PUBG/FreeFire/COD' },
  'रात को देर से चैट नहीं की': { hi: 'आज मैंने रात को देर से चैट नहीं की', en: 'Today I avoided late night chatting' },

  // Spiritual
  'प्रवचन श्रवण': { hi: 'आज मैंने प्रवचन सुने', en: 'Today I listened to Pravachan' },
  'पाठशाला': { hi: 'आज मैं पाठशाला गया/गई', en: 'Today I attended Pathshala' },
  'जैन कथा पठन': { hi: 'आज मैंने जैन कथा पढ़ी', en: 'Today I read Jain stories' },
  'स्तोत्र पाठ': { hi: 'आज मैंने स्तोत्र पाठ किया', en: 'Today I recited Stotra' },
  'जाप/नाम स्मरण': { hi: 'आज मैंने जाप/नाम स्मरण किया', en: 'Today I did Jaap/Naam Smaran' },
  'आरती': { hi: 'आज मैंने आरती की', en: 'Today I performed Aarti' },
  'ध्यान/मेडिटेशन': { hi: 'आज मैंने ध्यान/मेडिटेशन किया', en: 'Today I performed Meditation' },

  // Environment & Lifestyle
  'प्लास्टिक का उपयोग नहीं': { hi: 'आज मैंने प्लास्टिक का उपयोग नहीं किया', en: 'Today I did not use plastic' },
  'बिजली बचत': { hi: 'आज मैंने बिजली बचाई', en: 'Today I saved electricity' },
  'खाने की बर्बादी नहीं': { hi: 'आज मैंने खाने की बर्बादी नहीं की', en: 'Today I did not waste food' },
  'दान/सेवा': { hi: 'आज मैंने दान/सेवा की', en: 'Today I did charity/service' },
  'सौंदर्य प्रसाधन से परहेज': { hi: 'आज मैंने सौंदर्य प्रसाधनों का उपयोग नहीं किया', en: 'Today I avoided cosmetics' },
  'परफ्यूम से परहेज': { hi: 'आज मैंने परफ्यूम का उपयोग नहीं किया', en: 'Today I avoided perfumes' },
  'बाल रंग से परहेज': { hi: 'आज मैंने बालों में रंग नहीं लगाया', en: 'Today I did not color my hair' },
  'लिपस्टिक से परहेज': { hi: 'आज मैंने लिपस्टिक नहीं लगाई', en: 'Today I did not use lipstick' },
  'सादगी का दिन': { hi: 'आज मैंने सादगी से दिन बिताया', en: 'Today I lived a day of simplicity' },
  'स्तोत्र कंठस्थ किया': { hi: 'आज मैंने स्तोत्र कंठस्थ किया', en: 'Today I memorized a Stotra' },
  'जैन कथा याद की': { hi: 'आज मैंने जैन कथा याद की', en: 'Today I memorized a Jain story' },
  'श्लोक पाठ': { hi: 'आज मैंने श्लोक पाठ किया', en: 'Today I recited Shlokas' },

  // Special/Bonus
  'अभिषेक पूरे चातुर्मास किया': { hi: 'मैंने पूरे चातुर्मास अभिषेक किया', en: 'I performed Abhishek for the entire Chaturmas' },
  'रात्रि भोजन का त्याग': { hi: 'मैंने रात्रि भोजन का त्याग किया', en: 'I renounced night eating' },
  'प्रतिदिन प्रवचन सुना': { hi: 'मैंने प्रतिदिन प्रवचन सुने', en: 'I listened to Pravachan daily' },
  'प्रतिदिन स्वाध्याय / पाठशाला': { hi: 'मैंने प्रतिदिन स्वाध्याय/पाठशाला की', en: 'I did Swadhyay/Pathshala daily' },
  'पूरे चातुर्मास बाहर भोजन नहीं किया': { hi: 'मैंने पूरे चातुर्मास बाहर का भोजन नहीं किया', en: 'I did not eat outside for the entire Chaturmas' },
  'प्रतिदिन आरती-भक्ति में सम्मिलित हुए': { hi: 'मैं प्रतिदिन आरती-भक्ति में सम्मिलित हुआ/हुई', en: 'I participated in daily Aarti-Bhakti' },
  'पूरे चातुर्मास कॉस्मेटिक्स का उपयोग नहीं किया': { hi: 'मैंने पूरे चातुर्मास कॉस्मेटिक्स का उपयोग नहीं किया', en: 'I did not use cosmetics for the entire Chaturmas' },
  'मूवी / सिनेमा हॉल नहीं गए': { hi: 'मैं मूवी/सिनेमा हॉल नहीं गया/गई', en: 'I did not go to the movie/cinema hall' },
  'Web Series नहीं देखी': { hi: 'मैंने कोई वेब सीरीज नहीं देखी', en: 'I did not watch any Web Series' },
  'Late Night Chatting नहीं की': { hi: 'मैंने देर रात चैट नहीं की', en: 'I did not do late night chatting' },
  'दिवाली पर पटाखे नहीं छोड़े': { hi: 'मैंने दिवाली पर पटाखे नहीं छोड़े', en: 'I did not burst firecrackers on Diwali' },
  'पूर्ण ब्रह्मचर्य व्रत पालन किया': { hi: 'मैंने पूर्ण ब्रह्मचर्य व्रत का पालन किया', en: 'I followed complete Brahmacharya Vrata' },
  'माह के 15+ दिन एवं पर्वों पर ब्रह्मचर्य रखा': { hi: 'मैंने पर्वों पर ब्रह्मचर्य का पालन किया', en: 'I observed Brahmacharya on festivals' },
  'पर्युषण पर्व में सभी नियमों का पालन किया': { hi: 'मैंने पर्युषण में सभी नियमों का पालन किया', en: 'I followed all rules during Paryushan' },
  
  // Sankalp
  'हिंसक मोबाइल गेम (PUBG, Free Fire, COD आदि) नहीं खेलूँगा': { hi: 'मैं हिंसक मोबाइल गेम्स नहीं खेलूँगा', en: 'I pledge not to play violent mobile games' },
  'जन्मदिन / विवाह वर्षगाँठ गुरु शरण या तीर्थ पर मनाऊँगा': { hi: 'मैं जन्मदिन/विवाह वर्षगाँठ तीर्थ पर मनाऊँगा', en: 'I pledge to celebrate birthdays/anniversaries at pilgrimage' },
  'धर्म, माता-पिता की अनुमति के बिना विवाह या अन्य महत्वपूर्ण निर्णय नहीं लूँगा': { hi: 'मैं माता-पिता की अनुमति के बिना विवाह नहीं करूँगा', en: 'I pledge not to marry without parents consent' },
  'विवाह तक ब्रह्मचर्य एवं अश्लील फ़िल्में नहीं देखूँगा': { hi: 'मैं विवाह तक ब्रह्मचर्य का पालन करूँगा और अश्लील फ़िल्में नहीं देखूँगा', en: 'I pledge Brahmacharya until marriage and no explicit films' },
  'कुदेव–कुगुरु–कुधर्म की शरण में नहीं जाऊँगा': { hi: 'मैं कुदेव-कुगुरु-कुधर्म की शरण में नहीं जाऊँगा', en: 'I pledge not to seek refuge in false gods/gurus' },
  'Christian School में न पढ़ूँगा / बच्चों को नहीं पढ़ाऊँगा': { hi: 'मैं क्रिश्चियन स्कूल में नहीं पढ़ूँगा/पढ़ाऊँगा', en: 'I pledge not to study/teach in Christian Schools' },
  'विदेश में स्थायी रूप से नहीं बसूँगा': { hi: 'मैं विदेश में स्थायी रूप से नहीं बसूँगा', en: 'I pledge not to settle abroad permanently' },
  'Non-Veg, Egg, Honey, Wine, Beer, Cigarette, Gutkha एवं चमड़े का त्याग': { hi: 'मैं मांसाहार, शराब और चमड़े का आजीवन त्याग करता हूँ', en: 'I pledge lifetime avoidance of non-veg, alcohol, and leather' },
  'वर्ष में कम से कम एक बार आचार्य श्री के दर्शन करूँगा': { hi: 'मैं वर्ष में कम से कम एक बार आचार्य श्री के दर्शन करूँगा', en: 'I pledge to do Darshan of Acharya Shri once a year' }
};

let replacedCount = 0;
for (const [oldHi, newVals] of Object.entries(translations)) {
  const regexHi = new RegExp(`title_hi: '${oldHi}'`, 'g');
  if (content.match(regexHi)) {
    content = content.replace(regexHi, `title_hi: '${newVals.hi}'`);
    replacedCount++;
  } else {
    // try with double quotes or escaping special regex chars
    const escaped = oldHi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexHiE = new RegExp(`title_hi: '${escaped}'`, 'g');
    if (content.match(regexHiE)) {
        content = content.replace(regexHiE, `title_hi: '${newVals.hi}'`);
        replacedCount++;
    }
  }
}

for (const [oldHi, newVals] of Object.entries(translations)) {
  const escaped = newVals.hi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`title_hi: ['"]${escaped}['"],\\s*title_en: ['"]([^'"]+)['"]`, 'g');
  content = content.replace(regex, `title_hi: '${newVals.hi}',\n    title_en: '${newVals.en}'`);
}

fs.writeFileSync(path, content, 'utf8');
console.log(`Replaced ${replacedCount} titles.`);
