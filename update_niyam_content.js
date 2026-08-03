const fs = require('fs');

const path = 'src/data/content.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Morning 01 Replace
content = content.replace(
  /title_hi: 'आज मैंने नमोकार मंत्र का जाप किया',/g,
  "title_hi: 'आज मैंने 9 बार नमोकार मंत्र श्वासोच्छ्वास पूर्वक पढ़ा',"
);
content = content.replace(
  /title_en: 'Today I recited Namokar Mantra',/g,
  "title_en: 'Today I recited Namokar Mantra 9 times with mindful breathing',"
);

// 2. Insert Morning 09 after Morning 08
const morning08Match = content.match(/{[^}]*id: 'q_morning_08'[^}]*},/);
if (morning08Match) {
  const morning09Str = `
  {
    id: 'q_morning_09',
    category_id: 'morning',
    title_hi: 'आज मैंने वैयावृत्ति की',
    title_en: 'Today I have done Baiyavrutti',
    description_hi: 'आज मैंने मुनि/आर्यिका या बड़ों की वैयावृत्ति की',
    description_en: 'Today I served elders or monks (Baiyavrutti)',
    points: 100,
    icon: 'HandHeart',
    order: 9,
    is_active: true,
    type: 'daily',
    motivational_quote: 'वैयावृत्ति से महान पुण्य का बंध होता है।',
  },`;
  content = content.replace(morning08Match[0], morning08Match[0] + morning09Str);
}

// 3. Food 01 description
content = content.replace(
  /description_hi: 'आज ठंडे पानी का सेवन नहीं किया',/g,
  "description_hi: 'छने हुए जल का उपयोग किया',"
);

// 4. Bakery Item Update (q_food_07)
content = content.replace(
  /description_hi: 'आज ब्रेड, केक, बिस्किट आदि नहीं खाए',/g,
  "description_hi: 'आज ब्रेड, केक, बिस्किट आदि (बाहर का) नहीं खाए',"
);
content = content.replace(
  /description_en: 'No bread, cake, biscuits, or bakery products',/g,
  "description_en: 'No bread, cake, biscuits, or bakery products (outside)',"
);
content = content.replace(
  /title_hi: 'आज मैंने बेकरी उत्पाद नहीं खाए',/g,
  "title_hi: 'आज मैंने बेकरी उत्पाद (बाहर का) नहीं खाए',"
);
content = content.replace(
  /title_en: 'Today I avoided bakery products',/g,
  "title_en: 'Today I avoided bakery products (outside)',"
);

// 5. Insert Milk item (q_food_10) after q_food_09
const food09Match = content.match(/{[^}]*id: 'q_food_09'[^}]*},/);
if (food09Match) {
  const food10Str = `
  {
    id: 'q_food_10',
    category_id: 'food',
    title_hi: 'आज मैंने बिना बॉर्नविटा या फ्लेवर्ड पाउडर के दूध पिया',
    title_en: 'Today I drank milk without Bournvita or flavoured powder',
    description_hi: 'केवल शुद्ध दूध का सेवन किया',
    description_en: 'Drank pure milk only',
    points: 50,
    icon: 'Coffee',
    order: 10,
    is_active: true,
    type: 'daily',
    motivational_quote: 'सात्विक आहार स्वास्थ्य के लिए उत्तम है।',
  },`;
  content = content.replace(food09Match[0], food09Match[0] + food10Str);
}

// 6. Split q_food_04 into three
const food04Match = content.match(/{\s*id: 'q_food_04'[\s\S]*?},/);
if (food04Match) {
  const newFood04s = `
  {
    id: 'q_food_04a',
    category_id: 'food',
    title_hi: 'आज मैंने रात्रि में चारों प्रकार के आहार का त्याग किया',
    title_en: 'Today I renounced all 4 types of food at night',
    description_hi: 'रात्रि में जल, अन्न, फल आदि कुछ भी ग्रहण नहीं किया',
    description_en: 'Did not consume anything, including water, at night',
    points: 200,
    icon: 'Moon',
    order: 4,
    is_active: true,
    type: 'daily',
    motivational_quote: 'रात्रि भोजन त्याग से अनेक रोगों से बचाव होता है।',
  },
  {
    id: 'q_food_04b',
    category_id: 'food',
    title_hi: 'आज मैंने रात्रि में तीनों प्रकार के आहार का त्याग किया (केवल जल ग्रहण किया)',
    title_en: 'Today I renounced 3 types of food at night (only water taken)',
    description_hi: 'रात्रि में केवल जल का सेवन किया',
    description_en: 'Only consumed water at night',
    points: 150,
    icon: 'Droplet',
    order: 4.1,
    is_active: true,
    type: 'daily',
    motivational_quote: 'संयम जीवन का आभूषण है।',
  },
  {
    id: 'q_food_04c',
    category_id: 'food',
    title_hi: 'आज मैंने रात्रि में अन्न का त्याग किया',
    title_en: 'Today I renounced grains at night',
    description_hi: 'रात्रि में अन्न का सेवन नहीं किया',
    description_en: 'Did not consume grains at night',
    points: 100,
    icon: 'Wheat',
    order: 4.2,
    is_active: true,
    type: 'daily',
    motivational_quote: 'अल्पाहार और संयम से स्वास्थ्य लाभ होता है।',
  },`;
  content = content.replace(food04Match[0], newFood04s);
}

// 7. Lifestyle: q_life_06 update
const life06Match = content.match(/{\s*id: 'q_life_06'[\s\S]*?},/);
if (life06Match) {
  const newLife06 = `
  {
    id: 'q_life_06',
    category_id: 'lifestyle',
    title_hi: 'आज मैंने पाश्चात्य संस्कृति के कपड़े नहीं पहने',
    title_en: "Today I haven't used western culture clothes",
    description_hi: 'आज मैंने भारतीय / मर्यादित वस्त्र ही पहने',
    description_en: 'Wore modest/traditional Indian clothing today',
    points: 100,
    icon: 'Shirt',
    order: 6,
    is_active: true,
    type: 'daily',
    motivational_quote: 'वेशभूषा हमारे विचारों को प्रभावित करती है।',
  },`;
  content = content.replace(life06Match[0], newLife06);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Content updated successfully.');
