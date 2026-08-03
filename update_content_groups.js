const fs = require('fs');

const path = 'src/data/content.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Aahar Daan fix
content = content.replace(
  /title_hi: 'आज मैंने आहार दान दिया',/g,
  "title_hi: 'इस चातुर्मास में मैंने आहार दान दिया',"
);
content = content.replace(
  /title_en: 'Today I gave Aahar Daan',/g,
  "title_en: 'During this Chaturmas I gave Aahar Daan',"
);

// We need to inject a bunch of new Food and Lifestyle options. 
// Let's find where Food questions end, and where Lifestyle questions end.
const foodSectionStr = "  // --- FOOD DISCIPLINE (भोजन) ---";
const lifestyleSectionStr = "  // --- LIFESTYLE (जीवनशैली) ---";
const bonusSectionStr = "  // --- BONUS ---";

// Insert the new Food questions before Lifestyle section
const newFoodItems = `
  // 12 भोजन करते समय (RADIO)
  {
    id: 'q_food_12a',
    category_id: 'food',
    group_id: 'eating',
    input_type: 'radio',
    title_hi: 'थाली में दिया गया भोजन छोड़ना नहीं',
    title_en: 'Did not leave food in the plate',
    points: 50,
    icon: 'Utensils',
    order: 12.1,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_12b',
    category_id: 'food',
    group_id: 'eating',
    input_type: 'radio',
    title_hi: 'दिया गया भोजन शांति से कर लेना बिना कुछ मांगे',
    title_en: 'Ate peacefully without asking for anything',
    points: 50,
    icon: 'Utensils',
    order: 12.2,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_12c',
    category_id: 'food',
    group_id: 'eating',
    input_type: 'radio',
    title_hi: 'थाली में दिया भोजन छोड़ना नहीं + शांति से खाना (दोनों)',
    title_en: 'Did not leave food AND ate peacefully (Both)',
    points: 100,
    icon: 'Utensils',
    order: 12.3,
    is_active: true,
    type: 'daily',
  },
  // 13 बेकरी आइटम (CHECKBOXES)
  {
    id: 'q_food_13a',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार के ब्रेड/पाउं पेस्ट्री नहीं खाना',
    title_en: 'No outside bread, pav, pastry',
    points: 50,
    icon: 'Cake',
    order: 13.1,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_13b',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार के बिस्किट नहीं खाना',
    title_en: 'No outside biscuits',
    points: 50,
    icon: 'Cake',
    order: 13.2,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_13c',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार के केक नहीं खाना',
    title_en: 'No outside cake',
    points: 50,
    icon: 'Cake',
    order: 13.3,
    is_active: true,
    type: 'daily',
  },
  // 14 बाज़ार की चीज़ें (CHECKBOXES)
  {
    id: 'q_food_14a',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार के पिज़्ज़ा बर्गर नहीं खाना',
    title_en: 'No outside pizza/burger',
    points: 50,
    icon: 'Pizza',
    order: 14.1,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_14b',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार की चॉकलेट, कैडबरी व Chewing gum नहीं खाना',
    title_en: 'No outside chocolate, cadbury or chewing gum',
    points: 50,
    icon: 'Candy',
    order: 14.2,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_14c',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार की आइसक्रीम नहीं खाना',
    title_en: 'No outside ice cream',
    points: 50,
    icon: 'IceCream',
    order: 14.3,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_14d',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार की कोल्ड ड्रिंक्स नहीं पीना',
    title_en: 'No outside cold drinks',
    points: 50,
    icon: 'GlassWater',
    order: 14.4,
    is_active: true,
    type: 'daily',
  },
  // 15 जंक फूड (CHECKBOXES)
  {
    id: 'q_food_15a',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार की चीज़ (CHEESE) नहीं खाना',
    title_en: 'No outside cheese',
    points: 50,
    icon: 'Beef',
    order: 15.1,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_15b',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार की सॉस (SAUCE) नहीं खाना',
    title_en: 'No outside sauce',
    points: 50,
    icon: 'Soup',
    order: 15.2,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_15c',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'MAGGI नहीं खाना',
    title_en: 'No maggi',
    points: 50,
    icon: 'Salad',
    order: 15.3,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_15d',
    category_id: 'food',
    input_type: 'checkbox',
    title_hi: 'बाज़ार की चिप्स / कुरकुरे आदि नहीं खाना',
    title_en: 'No outside chips / kurkure etc',
    points: 50,
    icon: 'Cookie',
    order: 15.4,
    is_active: true,
    type: 'daily',
  },
  // 16 बाहर का खाना (RADIO)
  {
    id: 'q_food_16a',
    category_id: 'food',
    group_id: 'outside_food',
    input_type: 'radio',
    title_hi: 'MCDONALDS आदि वेज-नॉनवेज पर नहीं खाना',
    title_en: 'No McDonalds etc veg-nonveg',
    points: 100,
    icon: 'Store',
    order: 16.1,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_food_16b',
    category_id: 'food',
    group_id: 'outside_food',
    input_type: 'radio',
    title_hi: 'किसी भी होटल या लारी पर नहीं खाना',
    title_en: 'No hotel or street cart',
    points: 150,
    icon: 'Building',
    order: 16.2,
    is_active: true,
    type: 'daily',
  },
`;
content = content.replace(lifestyleSectionStr, newFoodItems + "\n" + lifestyleSectionStr);


// Remove the old bakery product since we added the 3 new ones
// The old one has id: 'q_food_07'
content = content.replace(/{\s*id: 'q_food_07'[\s\S]*?},/, '');

const newLifestyleItems = `
  // 17 टेक्नोलॉजी (RADIO)
  {
    id: 'q_life_17a',
    category_id: 'lifestyle',
    group_id: 'technology',
    input_type: 'radio',
    title_hi: 'टीवी या मोबाइल का पूर्ण त्याग',
    title_en: 'Complete renunciation of TV/Mobile',
    points: 250,
    icon: 'MonitorX',
    order: 17.1,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_life_17b',
    category_id: 'lifestyle',
    group_id: 'technology',
    input_type: 'radio',
    title_hi: 'मूवीज फेसबुक इंस्टाग्राम का त्याग',
    title_en: 'No movies/Facebook/Instagram',
    points: 200,
    icon: 'SmartphoneNfc',
    order: 17.2,
    is_active: true,
    type: 'daily',
  },
  {
    id: 'q_life_17c',
    category_id: 'lifestyle',
    group_id: 'technology',
    input_type: 'radio',
    title_hi: 'WHATSAPP का त्याग (सीमित घंटे धर्म या पढ़ाई के लिए)',
    title_en: 'No Whatsapp (except limited hours for study/dharma)',
    points: 100,
    icon: 'MessageCircle',
    order: 17.3,
    is_active: true,
    type: 'daily',
  },
`;
content = content.replace(bonusSectionStr, newLifestyleItems + "\n" + bonusSectionStr);


const bonusItem = `
  {
    id: 'q_bonus_intercaste',
    category_id: 'bonus',
    title_hi: 'मैं सजातीय (जैन) विवाह ही करूँगा/करूँगी (Intercaste marriage नहीं)',
    title_en: 'I will not do intercaste marriage (Only Jain marriage)',
    description_hi: 'धर्म और संस्कृति की रक्षा का संकल्प',
    description_en: 'Vow to protect dharma and culture',
    points: 5000,
    icon: 'HeartHandshake',
    order: 20,
    is_active: true,
    type: 'bonus',
  },
`;
// Insert bonus item right before the end of the QUESTIONS array
const endQuestionsStr = "];\n\nexport const BADGES";
content = content.replace(endQuestionsStr, bonusItem + "\n" + endQuestionsStr);


fs.writeFileSync(path, content, 'utf8');
console.log('Groups injected successfully.');
