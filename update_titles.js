const fs = require('fs');

const path = 'src/data/content.ts';
let content = fs.readFileSync(path, 'utf8');

const translations = {
  // Morning Routine
  'नमोकार मंत्र': { hi: 'आज मैंने नमोकार मंत्र का जाप किया', en: 'Today I recited Namokar Mantra' },
  'माता-पिता प्रणाम': { hi: 'आज मैंने माता-पिता को प्रणाम किया', en: 'Today I touched my parents feet' },
  'सूर्योदय से पहले उठना': { hi: 'आज मैं सूर्योदय से पहले उठा/उठी', en: 'Today I woke up before sunrise' },
  'मंदिर दर्शन': { hi: 'आज मैंने मंदिर जाकर दर्शन किए', en: 'Today I visited the Temple for Darshan' },
  'अभिषेक': { hi: 'आज मैंने अभिषेक किया', en: 'Today I performed Abhishek' },
  'पूजन': { hi: 'आज मैंने अष्ट द्रव्य से पूजन किया', en: 'Today I performed Poojan' },
  'मुनि/महासती दर्शन': { hi: 'आज मैंने मुनि/महासती जी के दर्शन किए', en: 'Today I visited Muni/Mahasati for Darshan' },
  'आहार दान': { hi: 'आज मैंने आहार दान दिया', en: 'Today I gave Aahar Daan' },

  // Food Discipline
  'ठंडे पानी से परहेज': { hi: 'आज मैंने छान के पानी पिया', en: 'Today I drank filtered water' },
  'चाय/कॉफी से परहेज': { hi: 'आज मैंने चाय/कॉफी नहीं पी', en: 'Today I did not drink tea or coffee' },
  'कंदमूल से परहेज': { hi: 'आज मैंने कंदमूल नहीं खाया', en: 'Today I avoided root vegetables' },
  'सूर्यास्त के बाद भोजन नहीं': { hi: 'आज मैंने सूर्यास्त के बाद भोजन नहीं किया', en: 'Today I did not eat after sunset' },
  'उपवास': { hi: 'आज मैंने पूर्ण उपवास किया', en: 'Today I observed complete fasting (Upwas)' },
  'एकासन': { hi: 'आज मैंने एकासन किया', en: 'Today I observed Ekasan (One Meal)' },
  'हरी सब्जी का त्याग': { hi: 'आज मैंने हरी सब्जी का त्याग किया', en: 'Today I avoided green vegetables' },
  'बाजार के भोजन से परहेज': { hi: 'आज मैंने बाजार का भोजन नहीं किया', en: 'Today I avoided outside food' },

  // Digital & Technology
  'सोशल मीडिया डिटॉक्स': { hi: 'आज मैंने सोशल मीडिया का उपयोग नहीं किया', en: 'Today I avoided social media' },
  'भोजन के दौरान नो-स्क्रीन': { hi: 'आज मैंने भोजन करते समय स्क्रीन नहीं देखी', en: 'Today I had screen-free meals' },
  'सोने से पहले नो-स्क्रीन': { hi: 'आज मैंने सोने से पहले स्क्रीन नहीं देखी', en: 'Today I avoided screens before bed' },
  'मनोरंजन डिटॉक्स': { hi: 'आज मैंने टीवी/मनोरंजन से परहेज किया', en: 'Today I avoided TV/entertainment' },
  'गेमिंग डिटॉक्स': { hi: 'आज मैंने वीडियो गेम्स नहीं खेले', en: 'Today I did not play video games' },

  // Spiritual Practices
  'स्वाध्याय': { hi: 'आज मैंने स्वाध्याय (शास्त्र पठन) किया', en: 'Today I did Swadhyay (Scripture Reading)' },
  'प्रतिक्रमण': { hi: 'आज मैंने प्रतिक्रमण किया', en: 'Today I performed Pratikraman' },
  'सामायिक': { hi: 'आज मैंने सामायिक (ध्यान) किया', en: 'Today I performed Samayik (Meditation)' },
  'भक्तामर स्तोत्र': { hi: 'आज मैंने भक्तामर स्तोत्र का पाठ किया', en: 'Today I recited Bhaktamar Stotra' },
  'तत्वार्थ सूत्र': { hi: 'आज मैंने तत्वार्थ सूत्र का पाठ किया', en: 'Today I recited Tattvartha Sutra' },
  'आलोचना पाठ': { hi: 'आज मैंने आलोचना पाठ किया', en: 'Today I recited Alochana Path' },
  'जाप (108 बार)': { hi: 'आज मैंने 108 बार जाप किया', en: 'Today I chanted 108 times' },

  // Environment & Compassion
  'जीव दया': { hi: 'आज मैंने जीव दया का कार्य किया', en: 'Today I practiced compassion towards animals' },
  'प्लास्टिक मुक्त दिन': { hi: 'आज मैंने प्लास्टिक का उपयोग नहीं किया', en: 'Today I avoided using plastic' },
  'भोजन की बर्बादी नहीं': { hi: 'आज मैंने भोजन बर्बाद नहीं किया', en: 'Today I did not waste food' },
  'जल संरक्षण': { hi: 'आज मैंने जल का संरक्षण किया', en: 'Today I conserved water' },
  'बिजली की बचत': { hi: 'आज मैंने बिजली की बचत की', en: 'Today I saved electricity' },
  'पशुओं को भोजन/जल': { hi: 'आज मैंने पशुओं को भोजन/जल दिया', en: 'Today I fed/watered animals' },
  'वृक्षारोपण/पौधों की देखभाल': { hi: 'आज मैंने पौधों की देखभाल की', en: 'Today I cared for plants' },

  // Lifestyle
  'ब्रह्मचर्य का पालन': { hi: 'आज मैंने ब्रह्मचर्य का पालन किया', en: 'Today I practiced Brahmacharya' },
  'मौन व्रत': { hi: 'आज मैंने मौन व्रत रखा', en: 'Today I observed Maun Vrat (Silence)' },
  'क्षमावाणी (क्रोध नहीं)': { hi: 'आज मैंने किसी पर क्रोध नहीं किया', en: 'Today I did not get angry' },
  'सत्य वचन': { hi: 'आज मैंने केवल सत्य वचन बोले', en: 'Today I spoke only the truth' },
  'चोरी नहीं (अचौर्य)': { hi: 'आज मैंने अचौर्य का पालन किया', en: 'Today I practiced Achaurya (No Stealing)' },
  'परिग्रह परिमाण': { hi: 'आज मैंने परिग्रह परिमाण का पालन किया', en: 'Today I limited my possessions' },
  'परोपकार (निस्वार्थ सेवा)': { hi: 'आज मैंने निस्वार्थ सेवा की', en: 'Today I performed selfless service' },
  
  // Memory
  'नमोकार मंत्र याद करें': { hi: 'आज मैंने नमोकार मंत्र कंठस्थ किया', en: 'Today I memorized Namokar Mantra' },
  'चत्तारि मंगल पाठ': { hi: 'आज मैंने चत्तारि मंगल पाठ कंठस्थ किया', en: 'Today I memorized Chattari Mangal Path' },
  'मेरी भावना (5 श्लोक)': { hi: 'आज मैंने मेरी भावना के 5 श्लोक याद किए', en: 'Today I memorized 5 verses of Meri Bhavana' },
  'भक्तामर स्तोत्र (1 श्लोक)': { hi: 'आज मैंने भक्तामर स्तोत्र का 1 श्लोक याद किया', en: 'Today I memorized 1 verse of Bhaktamar Stotra' },
  'तत्वार्थ सूत्र (अध्याय 1)': { hi: 'आज मैंने तत्वार्थ सूत्र का पहला अध्याय याद किया', en: 'Today I memorized Tattvartha Sutra (Chapter 1)' },
  'बारह भावना': { hi: 'आज मैंने बारह भावना याद की', en: 'Today I memorized Barah Bhavana' },
  
  // Bonus
  'उपवास (चतुर्दशी/अष्टमी)': { hi: 'आज मैंने अष्टमी/चतुर्दशी का उपवास किया', en: 'Today I observed fasting for Ashtami/Chaturdashi' },
  'तीर्थ यात्रा': { hi: 'आज मैंने तीर्थ यात्रा की', en: 'Today I went on a Tirth Yatra' },
  'महायज्ञ/विधान में भाग लेना': { hi: 'आज मैंने महायज्ञ/विधान में भाग लिया', en: 'Today I participated in a Mahayagya/Vidhan' },
  'विशेष जीव दया': { hi: 'आज मैंने विशेष जीव दया का कार्य किया', en: 'Today I did a special act of compassion' },
  'कठिन तपस्या (बेला/तेरा)': { hi: 'आज मैंने कठिन तपस्या (बेला/तेरा) की', en: 'Today I observed difficult fasting (Bela/Tera)' },
  'धर्म प्रभावना': { hi: 'आज मैंने धर्म प्रभावना का कार्य किया', en: 'Today I engaged in Dharma Prabhavana' },
  
  // Sankalp
  'आजीवन शाकाहार': { hi: 'मैंने आजीवन शाकाहार का संकल्प लिया है', en: 'I have pledged Lifetime Vegetarianism' },
  'आजीवन सप्त व्यसन त्याग': { hi: 'मैंने आजीवन सप्त व्यसन त्याग का संकल्प लिया है', en: 'I have pledged Lifetime Abstinence from 7 Vices' },
  'आजीवन कंदमूल त्याग': { hi: 'मैंने आजीवन कंदमूल त्याग का संकल्प लिया है', en: 'I have pledged Lifetime Avoidance of Root Vegetables' },
  'आजीवन छने जल का प्रयोग': { hi: 'मैंने आजीवन छने जल के प्रयोग का संकल्प लिया है', en: 'I have pledged Lifetime Use of Filtered Water' },
  'आजीवन रात्रि भोजन त्याग': { hi: 'मैंने आजीवन रात्रि भोजन त्याग का संकल्प लिया है', en: 'I have pledged Lifetime Avoidance of Night Meals' },
  'आजीवन नित्य देव दर्शन': { hi: 'मैंने आजीवन नित्य देव दर्शन का संकल्प लिया है', en: 'I have pledged Lifetime Daily Temple Darshan' },
  'आजीवन अहिंसा का पालन': { hi: 'मैंने आजीवन अहिंसा का संकल्प लिया है', en: 'I have pledged Lifetime Practice of Non-Violence' }
};

let replacedCount = 0;
for (const [oldHi, newVals] of Object.entries(translations)) {
  const regexHi = new RegExp(`title_hi: '${oldHi}'`, 'g');
  if (content.match(regexHi)) {
    content = content.replace(regexHi, `title_hi: '${newVals.hi}'`);
    replacedCount++;
  } else {
    // try with double quotes
    const regexHiD = new RegExp(`title_hi: "${oldHi}"`, 'g');
    if (content.match(regexHiD)) {
        content = content.replace(regexHiD, `title_hi: "${newVals.hi}"`);
        replacedCount++;
    }
  }
}

// Now replace english by finding the block
for (const [oldHi, newVals] of Object.entries(translations)) {
  const regex = new RegExp(`title_hi: ['"]${newVals.hi}['"],\\s*title_en: ['"]([^'"]+)['"]`, 'g');
  content = content.replace(regex, `title_hi: '${newVals.hi}',\n    title_en: '${newVals.en}'`);
}


fs.writeFileSync(path, content, 'utf8');
console.log(`Replaced ${replacedCount} titles.`);
