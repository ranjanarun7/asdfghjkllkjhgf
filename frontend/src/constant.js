export const SYSTEM_INSTRUCTION = `
You are "Jharkhand Tourist Assistant" — a friendly, accurate, multilingual travel assistant specialized in tourism in Jharkhand, India.

Rules:
- Always ask one clarifying question if the user's request is ambiguous.
- LANGUAGE BEHAVIOR:
  1. By DEFAULT, respond in English.
  2. If user writes in a different supported language, respond in THAT language.
  3. If the user has manually selected a language from the UI, ALWAYS respond in that selected language.
  
- TONE & STYLE:
  - Use professional emojis: 👋 🌿 🧭 🌄 🧳 ✨ 🙏 🌦 💰
  - Use short paragraphs.
  - Format output with clear Markdown.

- 🌦 WEATHER-AWARE SUGGESTIONS (REAL-TIME):
  1. USE GOOGLE SEARCH TOOL to check current real-time weather.
  2. Analyze weather:
     - Rain/Monsoon: Avoid steep treks. Warn about leeches/mud.
     - Sunny/Clear: Recommend viewpoints.
     - Fog/Winter: Delay sunrise plans.
  3. MANDATORY SAFETY ALERTS: Include "⚠ Safety & Logistics".

- 🧳 TRAVEL CHECKLIST & BUDGET:
  ALWAYS include:
  1. 🎒 Packing Checklist.
  2. 💰 Budget Estimator (Breakdown + Total Range).

==================================================
🛡 TRANSPORT SAFETY & WEATHER-SAFE TRAVEL RULES
==================================================

1️⃣ TIME SAFETY RULES
- Avoid traveling to hilly areas after sunset.
- Waterfall areas should NOT be visited late evening.

2️⃣ ROAD SAFETY RULES
- Hilly routes have sharp curves.
- Fog is common in early morning.

3️⃣ WATERFALL SAFETY
- Do NOT go too close to edges.
- Swimming is NOT allowed.

4️⃣ SOLO TRAVEL SAFETY
- Warn about network. Suggest populated places.

9️⃣ UNSURE?
Say: "I’m not fully sure about the exact details, but here is the safest information currently available."
`;

export const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English', flag: '', speechCode: 'en-US' },
  { value: 'Hindi', label: 'हिन्दी (Hindi)', flag: '🇮🇳', speechCode: 'hi-IN' },
  { value: 'Santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)', flag: '🇮🇳', speechCode: 'sat-IN' },
  { value: 'Gujarati', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳', speechCode: 'gu-IN' },
  { value: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳', speechCode: 'pa-IN' },
  { value: 'Marathi', label: 'मराठी (Marathi)', flag: '🇮🇳', speechCode: 'mr-IN' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳', speechCode: 'ta-IN' },
  { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳', speechCode: 'kn-IN' },
  { value: 'Bengali', label: 'বাংলা (Bengali)', flag: '🇮🇳', speechCode: 'bn-IN' },
  { value: 'Assamese', label: 'অসমীয়া (Assamese)', flag: '🇮🇳', speechCode: 'as-IN' },
  { value: 'Sanskrit', label: 'संस्कृतम् (Sanskrit)', flag: '🇮🇳', speechCode: 'sa-IN' },
  { value: 'Urdu', label: 'اُردو (Urdu)', flag: '🇵🇰', speechCode: 'ur-PK' },
  { value: 'French', label: 'Français (French)', flag: '🇫🇷', speechCode: 'fr-FR' },
  { value: 'German', label: 'Deutsch (German)', flag: '🇩🇪', speechCode: 'de-DE' },
  { value: 'Japanese', label: '日本語 (Japanese)', flag: '🇯🇵', speechCode: 'ja-JP' },
  { value: 'Korean', label: '한국어 (Korean)', flag: '🇰🇷', speechCode: 'ko-KR' },
  { value: 'Chinese', label: '中文 (Chinese)', flag: '🇨🇳', speechCode: 'zh-CN' },
  { value: 'Russian', label: 'Русский (Russian)', flag: '🇷🇺', speechCode: 'ru-RU' }
];

export const SUPPORTED_LANGUAGES = LANGUAGE_OPTIONS.map(opt => opt.value);

const DEFAULT_PROMPTS = [
  { id: '1', label: '2-Day Budget Trip', prompt: 'Plan a 2-day itinerary for Ranchi waterfalls with a budget estimate. Check the weather first.', icon: 'compass' },
  { id: '2', label: 'Betla Safari Guide', prompt: 'How do I book a safari at Betla? Include costs, weather forecast, and a packing list.', icon: 'camera' },
  { id: '3', label: 'Local Crafts', prompt: 'Where can I buy authentic Dokra art in Jharkhand? Any safety tips for the market?', icon: 'coffee' },
  { id: '4', label: 'Netarhat Weekend', prompt: 'Plan a weekend trip to Netarhat. Check for rain/fog and include a travel checklist.', icon: 'tent' }
];

export const TRANSLATIONS = {
  English: {
    greeting: "Johar! 👋 I’m *YatraMitra AI*, your friendly Jharkhand Tourist Assistant 🧭\n\nReady to explore the land of forests, waterfalls, and rich culture? 🌿✨\n\nAsk me anything — itineraries, places to visit, transport, food, or safety tips!",
    prompts: DEFAULT_PROMPTS
  },
  Hindi: {
    greeting: "जोहार! 👋 मैं आपका *यात्रा-मित्र AI* हूँ, आपका फ्रेंडली झारखंड टूरिस्ट असिस्टेंट 🧭\n\nक्या आप जंगलों, झरनों और समृद्ध संस्कृति की इस धरती को घूमने के लिए तैयार हैं? 🌿✨\n\nमुझसे कुछ भी पूछें — यात्रा योजना, घूमने की जगहें, परिवहन, भोजन या सुरक्षा सुझाव!",
    prompts: [
      { id: '1', label: '2-दिन की यात्रा', prompt: 'मेरे पास 2 दिन हैं। मुझे झरने पसंद हैं। कृपया बजट और सुरक्षा सुझावों के साथ प्लान बताएं।', icon: 'compass' },
      { id: '2', label: 'बेतला सफारी', prompt: 'बेतला नेशनल पार्क में सफारी कैसे बुक करें? कुल खर्च और पैकिंग लिस्ट भी बताएं।', icon: 'camera' },
      { id: '3', label: 'स्थानीय हस्तशिल्प', prompt: 'मैं झारखंड में असली डोकरा कला कहां से खरीद सकता हूँ?', icon: 'coffee' },
      { id: '4', label: 'नेतरहाट यात्रा', prompt: 'नेतरहाट की यात्रा का प्लान बनाएं। मौसम की चेतावनियां और पैकिंग लिस्ट शामिल करें।', icon: 'tent' }
    ]
  },
  Santhali: {
    greeting: "Johar! 👋 In do *YatraMitra AI*, amic' Jharkhand Tourist Assistant 🧭\n\nJharkhand rea: bir ar da:k' ko nel lagit' chet' leka in goro dare ama? 🌿✨",
    prompts: [
      { id: '1', label: '2-Din Reak', prompt: 'In then 2 din mena:a. Ranchi khon ehob kate mit itinerary lai me. Kharcho hisab ho lai me.', icon: 'compass' },
      { id: '2', label: 'Betla Safari', prompt: 'Betla National Park re safari chet leka re booking huiyu:a? Okat do joto khon boge somoy?', icon: 'camera' },
      { id: '3', label: 'Local Crafts', prompt: 'Jharkhand re authentic Dokra art ar tribal handicrafts oka re namo:a?', icon: 'coffee' },
      { id: '4', label: 'Netarhat Da:ra', prompt: 'Netarhat lagit mit weekend trip plan me. Safety ar packing list ho lai me.', icon: 'tent' }
    ]
  },
  Gujarati: {
    greeting: "જોહાર! 👋 હું *યાત્રામ મિત્ર AI* છું, તમારો ઝારખંડ ટૂરિસ્ટ આસિસ્ટન્ટ 🧭\n\nજંગलो અને ધોધની ભૂમિનું અન્વેષણ કરવા તૈયાર છો? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Punjabi: {
    greeting: "ਜੋਹਾਰ! 👋 ਮੈਂ *ਯਾਤਰਾ ਮਿੱਤਰ AI* ਹਾਂ, ਤੁਹਾਡਾ ਝਾਰਖੰਡ ਟੂਰਿਸਟ ਸਹਾਇਕ 🧭\n\nਕੀ ਤੁਸੀਂ ਜੰਗਲਾਂ ਅਤੇ ਝਰਨਿਆਂ ਦੀ ਧਰਤੀ ਨੂੰ ਘੁੰਮਣ ਲਈ ਤਿਆਰ ਹੋ? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Marathi: {
    greeting: "जोहार! 👋 मी *यात्रा मित्र AI* आहे, तुमचा झारखंड पर्यटक सहाय्यक 🧭\n\nजंगले आणि धबधब्यांच्या या भूमीचा शोध घेण्यासाठी तयार आहात? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Tamil: {
    greeting: "ஜோஹர்! 👋 நான் *யாத்ரா மித்ரா AI*, உங்கள் ஜார்க்கண்ட் சுற்றுலா உதவியாளர் 🧭\n\nகாடுகள் மற்றும் அருவிகளின் தேசத்தை ஆராய தயாரா? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Kannada: {
    greeting: "ಜೋಹರ್! 👋 ನಾನು *ಯಾತ್ರಾ ಮಿತ್ರ AI*, ನಿಮ್ಮ ಜಾರ್ಖಂಡ್ ಪ್ರವಾಸಿ ಸಹಾಯಕ 🧭\n\nಕಾಡುಗಳು ಮತ್ತು ಜಲಪಾತಗಳ ನಾಡನ್ನು ಅನ್ವೇಷಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Bengali: {
    greeting: "জোহর! 👋 আমি *যাত্রা মিত্র AI*, আপনার ঝাড়খণ্ড পর্যটন সহকারী 🧭\n\nজঙ্গল এবং জলপ্রপাতের এই দেশটি অন্বেষণ করতে প্রস্তুত? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Assamese: {
    greeting: "জোহাৰ! 👋 মই *যাত্ৰা মিত্ৰ AI*, আপোনাৰ ঝাৰখণ্ড পৰ্যটন সহকাৰী 🧭\n\nঅৰণ্য আৰু জলপ্ৰপাতৰ এই দেশখন অন্বেষণ কৰিবলৈ আপুনি সাজুনে? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Sanskrit: {
    greeting: "जोहार! 👋 अहम् *यात्रा-मित्र AI* अस्मि, भवताम् झारखण्ड-पर्यटन-सहायकः 🧭\n\nकिं भवान् वनानां प्रपातानां च इमां भूमिम् अन्वेष्टुं सज्जः अस्ति? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Urdu: {
    greeting: "جوہر! 👋 میں *یاترا مترا AI* ہوں، آپ کا جھارکھنڈ ٹورسٹ اسسٹنٹ 🧭\n\nکیا آپ جنگلات اور آبشاروں کی اس سرزمین کو دریافت کرنے کے لیے تیار ہیں؟ 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  French: {
    greeting: "Johar! 👋 Je suis *YatraMitra AI*, votre assistant touristique du Jharkhand 🧭\n\nPrêt à explorer la terre des forêts et des cascades ? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  German: {
    greeting: "Johar! 👋 Ich bin *YatraMitra AI*, Ihr Jharkhand-Tourismus-Assistent 🧭\n\nBereit, das Land der Wälder und Wasserfälle zu erkunden? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Japanese: {
    greeting: "ジョハール！👋 私は *YatraMitra AI*、あなたのジャールカンド観光アシスタントです 🧭\n\n森と滝の国を探索する準備はできていますか？ 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Korean: {
    greeting: "조하르! 👋 저는 *YatraMitra AI*입니다, 당신의 자르칸드 관광 도우미죠 🧭\n\n숲과 폭포의 땅을 탐험할 준비가 되셨나요? 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Chinese: {
    greeting: "Johar！👋 我是 *YatraMitra AI*，您的贾坎德邦旅游助手 🧭\n\n准备好探索这片森林和瀑布的土地了吗？ 🌿✨",
    prompts: DEFAULT_PROMPTS
  },
  Russian: {
    greeting: "Джохар! 👋 Я *YatraMitra AI*, ваш туристический помощник по Джаркханду 🧭\n\nГотовы исследовать этот край лесов и водопадов? 🌿✨",
    prompts: DEFAULT_PROMPTS
  }
};

export const PREMADE_ITINERARIES = [
  {
    id: 'ranchi-waterfalls',
    title: 'Ranchi Waterfalls & Culture',
    location: 'Ranchi',
    coordinates: { lat: 23.3441, lng: 85.3096 },
    duration: 2,
    interests: ['Nature', 'Culture'],
    description: 'Visit Hundru Falls, Jonha Falls, and the Tribal Museum.'
  },
  {
    id: 'netarhat-hills',
    title: 'Queen of Chotanagpur: Netarhat',
    location: 'Netarhat',
    coordinates: { lat: 23.4841, lng: 84.2616 },
    duration: 3,
    interests: ['Nature', 'Adventure', 'Relaxation'],
    description: 'Sunrise at Magnolia Point, Koel View Point, and Pine Forests.'
  },
  {
    id: 'betla-wildlife',
    title: 'Betla Wildlife Adventure',
    location: 'Palamau',
    coordinates: { lat: 23.8878, lng: 84.1914 },
    duration: 2,
    interests: ['Wildlife', 'Adventure', 'Heritage'],
    description: 'Jeep Safari in Betla National Park and Palamau Fort visit.'
  },
  {
    id: 'deoghar-pilgrimage',
    title: 'Spiritual Journey to Deoghar',
    location: 'Deoghar',
    coordinates: { lat: 24.4826, lng: 86.6970 },
    duration: 2,
    interests: ['Religious', 'Culture'],
    description: 'Baba Baidyanath Dham Darshan, Trikut Pahar ropeway, and Naulakha Mandir.'
  },
  {
    id: 'jamshedpur-city',
    title: 'Steel City & Dalma Hills',
    location: 'Jamshedpur',
    coordinates: { lat: 22.8046, lng: 86.2029 },
    duration: 2,
    interests: ['Urban', 'Nature', 'Parks'],
    description: 'Jubilee Park, Dimna Lake, and Dalma Wildlife Sanctuary.'
  },
  {
    id: 'shikharji-trek',
    title: 'Parasnath Hill Trek',
    location: 'Giridih',
    coordinates: { lat: 23.9565, lng: 86.1440 },
    duration: 1,
    interests: ['Adventure', 'Religious'],
    description: 'Trek to Shikharji, the highest peak in Jharkhand and Jain pilgrimage site.'
  },
  {
    id: 'hazaribagh-nature',
    title: 'Hazaribagh Lakes & Forests',
    location: 'Hazaribagh',
    coordinates: { lat: 23.9925, lng: 85.3637 },
    duration: 2,
    interests: ['Nature', 'Relaxation'],
    description: 'Canary Hill, Hazaribagh Lake, and National Park drive.'
  }
];