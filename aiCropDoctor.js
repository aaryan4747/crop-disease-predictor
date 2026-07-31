/**
 * AI Crop Doctor - Interactive Agronomy Diagnostic Assistant
 * Guides farmers through a step-by-step Q&A interview to diagnose crop issues
 */

export class AICropDoctor {
  constructor() {
    this.currentStep = 0;
    this.answers = {};
    this.questions = [
      {
        id: "crop_type",
        text: "Which crop are you cultivating?",
        textTe: "మీరు ఏ పంట సాగు చేస్తున్నారు?",
        textHi: "आप कौन सी फसल उगा रहे हैं?",
        textKn: "ನೀವು ಯಾವ ಬೆಳೆಯನ್ನು ಬೆಳೆಯುತ್ತಿದ್ದೀರಿ?",
        textTa: "நீங்கள் என்ன பயிர் சாகுபடி செய்கிறீர்கள்?",
        type: "select",
        options: [
          { label: "Tomato (టమోటా)", val: "tomato" },
          { label: "Chilli (మిరప)", val: "chilli" },
          { label: "Watermelon (పుచ్చకాయ)", val: "watermelon" },
          { label: "Rice / Paddy (వరి)", val: "rice" },
          { label: "Banana (అరటి)", val: "banana" },
          { label: "Cotton (ప్రత్తి)", val: "cotton" }
        ]
      },
      {
        id: "leaf_symptom",
        text: "What visual symptom are you noticing on the leaves?",
        textTe: "ఆకులపై ఏ విధమైన లక్షణాలు కనిపిస్తున్నాయి?",
        textHi: "पत्तियों पर क्या लक्षण दिखाई दे रहे हैं?",
        textKn: "ಎಲೆಗಳ ಮೇಲೆ ಯಾವ ಲಕ್ಷಣ ಕಾಣಿಸುತ್ತಿದೆ?",
        textTa: "இலைகளில் என்ன அறிகுறிகள் காணப்படுகின்றன?",
        type: "select",
        options: [
          { label: "Curling & puckered boat shape (ముడుత మారడం)", val: "curling" },
          { label: "Dark brown / black water-soaked spots (నల్లటి మచ్చలు)", val: "blight_spots" },
          { label: "Yellow vein network (పసుపు రంగు ఈనెలు)", val: "yellow_veins" },
          { label: "White powder / ash mold (బూడిద రంగు మచ్చలు)", val: "powder" }
        ]
      },
      {
        id: "insects_present",
        text: "Are there any insects or thrips visible under the leaf?",
        textTe: "ఆకు అడుగు భాగంలో ఏమైనా పురుగులు లేదా తామర ఈగలు ఉన్నాయా?",
        textHi: "क्या पत्ती के नीचे कोई कीड़े दिखाई दे रहे हैं?",
        textKn: "ಎಲೆಯ ಕೆಳಗೆ ಕ್ರಿಮಿಕೀಟಗಳು ಇವೆಯೇ?",
        textTa: "இலையின் அடியில் பூச்சிகள் உள்ளதா?",
        type: "select",
        options: [
          { label: "Yes, tiny black/yellow thrips (అవును, తామర పురుగులు ఉన్నాయి)", val: "thrips" },
          { label: "Yes, whiteflies (అవును, తెల్ల దోమలు ఉన్నాయి)", val: "whiteflies" },
          { label: "No insects visible (పురుగులు లేవు)", val: "none" }
        ]
      },
      {
        id: "crop_age",
        text: "What is the age/stage of your crop?",
        textTe: "మీ పంట వయస్సు / ఏ దశలో ఉంది?",
        textHi: "आपकी फसल की अवस्था क्या है?",
        textKn: "ನಿಮ್ಮ ಬೆಳೆಯ ಹಂತ ಯಾವುದು?",
        textTa: "உங்கள் பயிரின் வளர்ச்சி நிலை என்ன?",
        type: "select",
        options: [
          { label: "Nursery / Young vegetative (లేత మొక్క దశ)", val: "young" },
          { label: "Flowering stage (పూత పూసే దశ)", val: "flowering" },
          { label: "Fruiting / Pod bulking (కాయ తోడుకునే దశ)", val: "fruiting" }
        ]
      }
    ];
  }

  reset() {
    this.currentStep = 0;
    this.answers = {};
  }

  getCurrentQuestion(lang = 'en') {
    const q = this.questions[this.currentStep];
    if (!q) return null;
    let title = q.text;
    if (lang === 'te') title = q.textTe;
    if (lang === 'hi') title = q.textHi;
    if (lang === 'kn') title = q.textKn;
    if (lang === 'ta') title = q.textTa;

    return {
      step: this.currentStep + 1,
      totalSteps: this.questions.length,
      id: q.id,
      title: title,
      options: q.options
    };
  }

  answerCurrentQuestion(val) {
    const q = this.questions[this.currentStep];
    if (q) {
      this.answers[q.id] = val;
      this.currentStep++;
    }
    return this.currentStep < this.questions.length;
  }

  generateDiagnosis(lang = 'en') {
    const { crop_type, leaf_symptom, insects_present, crop_age } = this.answers;

    if (crop_type === 'chilli' || leaf_symptom === 'curling' || insects_present === 'thrips') {
      return {
        diseaseName: "Chilli Black Thrips & Leaf Curl (మిరప నల్ల తామర పురుగు)",
        confidence: 96,
        recommendation: "Spray Coromandel Finio (1.25ml/L) + Coromandel Spreadmax (0.5ml/L). Install 30 blue sticky traps/acre.",
        precaution: "Avoid excess Urea fertilizer. Spray during clear morning hours."
      };
    } else if (crop_type === 'tomato' || leaf_symptom === 'blight_spots') {
      return {
        diseaseName: "Tomato Late Blight & Leaf Spot (టమోటా లేట్ బ్లైట్ తెగులు)",
        confidence: 94,
        recommendation: "Spray Syngenta Ridomil Gold (2.5g/L) or Copper Hydroxide (2.5g/L).",
        precaution: "Use drip lines; avoid overhead sprinkler irrigation."
      };
    } else if (leaf_symptom === 'yellow_veins' || insects_present === 'whiteflies') {
      return {
        diseaseName: "Okra Yellow Vein Mosaic Virus (బెండ పసుపు మోజాయిక్ తెగులు)",
        confidence: 91,
        recommendation: "Spray Acetamiprid 20% SP (0.5g/L) + Neem Oil 5% (50ml/L). Install 25 yellow traps/acre.",
        precaution: "Destroy infected yellow plants immediately."
      };
    } else {
      return {
        diseaseName: "Watermelon Anthracnose & Foliar Spot (పుచ్చకాయ నల్లమచ్చ తెగులు)",
        confidence: 92,
        recommendation: "Spray Syngenta Amistar (1ml/L) or Bayer Nativo (0.75g/L).",
        precaution: "Maintain proper field drainage and silver-black plastic mulch."
      };
    }
  }
}
