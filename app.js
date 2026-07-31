import { CROP_DISEASES, CROP_LIST } from './diseaseDatabase.js';
import { SAMPLE_GALLERY } from './sampleImages.js';
import { analyzeLeafImage } from './imageAnalyzer.js';
import { TRANSLATIONS, TELUGU_DISEASE_DATA } from './translations.js';

// Application State
const state = {
  theme: 'light',
  language: localStorage.getItem('crop_lang') || 'en',
  currentCropFilter: "All Crops (అన్ని పంటలు)",
  selectedImage: null,
  isScanning: false,
  activeTab: "root_cause",
  currentAnalysis: null,
  history: JSON.parse(localStorage.getItem('crop_scan_history') || '[]'),
  speechUtterance: null,
  deferredPwaPrompt: null
};

// DOM References
let dom = {};

document.addEventListener('DOMContentLoaded', () => {
  initDomReferences();
  registerServiceWorker();
  applyLightMode();
  renderCropSelector();
  renderSampleGallery();
  bindEvents();
  updateUiLanguage();
});

let leafletMap = null;
let leafletMarker = null;

// BULLETPROOF GLOBAL DELEGATION FOR ALL NAVIGATION TABS & MOBILE SIDEBAR TOUCHES
document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('#menuToggleBtn');
  const closeBtn = e.target.closest('#sidebarCloseBtn');
  const overlay = e.target.closest('#sidebarOverlay');
  const navBtn = e.target.closest('[data-section]');

  const drawer = document.getElementById('sidebarDrawer');
  const drawerOverlay = document.getElementById('sidebarOverlay');

  if (toggleBtn) {
    e.preventDefault();
    if (drawer) drawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    return;
  }

  if (closeBtn || overlay) {
    e.preventDefault();
    if (drawer) drawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    return;
  }

  if (!navBtn) return;
  e.preventDefault();

  const sec = navBtn.getAttribute('data-section');
  
  document.querySelectorAll('.nav-btn, .sidebar-nav-btn').forEach(b => {
    if (b.getAttribute('data-section') === sec) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  const heroBanner = document.querySelector('.hero-banner');
  const metricsBar = document.querySelector('.metrics-bar');
  const weatherAlert = document.querySelector('.weather-alert-card');

  const predictor = document.getElementById('sectionPredictor');
  const weather = document.getElementById('sectionWeather');
  const library = document.getElementById('sectionLibrary');
  const calculator = document.getElementById('sectionCalculator');
  const medicines = document.getElementById('sectionMedicines');
  const schedule = document.getElementById('sectionSchedule');
  const mandi = document.getElementById('sectionMandi');
  const prescription = document.getElementById('sectionPrescription');

  if (predictor) predictor.classList.add('hidden');
  if (weather) weather.classList.add('hidden');
  if (library) library.classList.add('hidden');
  if (calculator) calculator.classList.add('hidden');
  if (medicines) medicines.classList.add('hidden');
  if (schedule) schedule.classList.add('hidden');
  if (mandi) mandi.classList.add('hidden');
  if (prescription) prescription.classList.add('hidden');

  if (sec === 'predictor') {
    if (heroBanner) heroBanner.classList.remove('hidden');
    if (metricsBar) metricsBar.classList.remove('hidden');
    if (weatherAlert) weatherAlert.classList.remove('hidden');
    if (predictor) predictor.classList.remove('hidden');
  } else if (sec === 'weather') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (weather) weather.classList.remove('hidden');
    setTimeout(() => { initWeatherMap(); }, 200);
  } else if (sec === 'library') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (library) library.classList.remove('hidden');
    renderDiseaseLibrary();
  } else if (sec === 'calculator') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (calculator) calculator.classList.remove('hidden');
  } else if (sec === 'medicines') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (medicines) medicines.classList.remove('hidden');
  } else if (sec === 'schedule') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (schedule) schedule.classList.remove('hidden');
  } else if (sec === 'mandi') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (mandi) mandi.classList.remove('hidden');
  } else if (sec === 'prescription') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (prescription) prescription.classList.remove('hidden');
  }

  if (drawer) drawer.classList.remove('active');
  if (drawerOverlay) drawerOverlay.classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function applyLightMode() {
  document.documentElement.setAttribute('data-theme', 'light');
  document.body.setAttribute('data-theme', 'light');
}

function initDomReferences() {
  dom = {
    cropSelect: document.getElementById('cropSelect'),
    dropZone: document.getElementById('dropZone'),
    fileInput: document.getElementById('fileInput'),
    cameraInput: document.getElementById('cameraInput'),
    browseBtn: document.getElementById('browseBtn'),
    cameraBtn: document.getElementById('cameraBtn'),
    sampleGallery: document.getElementById('sampleGallery'),
    previewContainer: document.getElementById('previewContainer'),
    imagePreview: document.getElementById('imagePreview'),
    laserScanner: document.getElementById('laserScanner'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    resetBtn: document.getElementById('resetBtn'),
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    resultsContent: document.getElementById('resultsContent'),
    diseaseName: document.getElementById('diseaseName'),
    scientificName: document.getElementById('scientificName'),
    severityBadge: document.getElementById('severityBadge'),
    confidenceVal: document.getElementById('confidenceVal'),
    confidenceFill: document.getElementById('confidenceFill'),
    tabBody: document.getElementById('tabBody'),
    chatHistory: document.getElementById('chatHistory'),
    chatInput: document.getElementById('chatInput'),
    sendChatBtn: document.getElementById('sendChatBtn'),
    calcAcreage: document.getElementById('calcAcreage'),
    calcDosageRate: document.getElementById('calcDosageRate'),
    calcWaterOutput: document.getElementById('calcWaterOutput'),
    calcMedOutput: document.getElementById('calcMedOutput'),
    motorHp: document.getElementById('motorHp'),
    motorHours: document.getElementById('motorHours'),
    motorKwhOutput: document.getElementById('motorKwhOutput'),
    pwaInstallBtn: document.getElementById('pwaInstallBtn'),
    speakAdvisoryBtn: document.getElementById('speakAdvisoryBtn'),
    stopAdvisoryBtn: document.getElementById('stopAdvisoryBtn'),
    printPdfReportBtn: document.getElementById('printPdfReportBtn'),
    weatherLocationInput: document.getElementById('weatherLocationInput'),
    searchWeatherBtn: document.getElementById('searchWeatherBtn'),
    gpsLocationBtn: document.getElementById('gpsLocationBtn'),
    rxFarmerName: document.getElementById('rxFarmerName'),
    rxVillage: document.getElementById('rxVillage'),
    rxCrop: document.getElementById('rxCrop'),
    rxDisease: document.getElementById('rxDisease'),
    buildRxReceiptBtn: document.getElementById('buildRxReceiptBtn'),
    rxReceiptOutput: document.getElementById('rxReceiptOutput')
  };
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW Registration ignored in local dev:', err);
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPwaPrompt = e;
    if (dom.pwaInstallBtn) dom.pwaInstallBtn.classList.remove('hidden');
  });
}

function renderCropSelector() {
  if (!dom.cropSelect) return;
  dom.cropSelect.innerHTML = CROP_LIST.map(crop => `<option value="${crop}">${crop}</option>`).join('');
}

function renderSampleGallery() {
  if (!dom.sampleGallery) return;
  dom.sampleGallery.innerHTML = SAMPLE_GALLERY.map(s => `
    <div class="sample-card" data-sample-id="${s.id}" data-crop="${s.crop}">
      <img src="${s.imageUrl}" alt="${s.label}" class="sample-img" loading="lazy" />
      <div class="sample-label">${s.label}</div>
    </div>
  `).join('');
}

function bindEvents() {
  if (dom.cropSelect) {
    dom.cropSelect.addEventListener('change', (e) => {
      state.currentCropFilter = e.target.value;
    });
  }

  if (dom.browseBtn) dom.browseBtn.addEventListener('click', () => dom.fileInput.click());
  if (dom.cameraBtn) dom.cameraBtn.addEventListener('click', () => dom.cameraInput.click());

  if (dom.fileInput) dom.fileInput.addEventListener('change', handleFileSelect);
  if (dom.cameraInput) dom.cameraInput.addEventListener('change', handleFileSelect);

  if (dom.dropZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dom.dropZone.addEventListener(eventName, preventDefaults, false);
    });
    dom.dropZone.addEventListener('dragover', () => dom.dropZone.classList.add('dragover'));
    dom.dropZone.addEventListener('dragleave', () => dom.dropZone.classList.remove('dragover'));
    dom.dropZone.addEventListener('drop', handleDrop);
  }

  if (dom.sampleGallery) {
    dom.sampleGallery.addEventListener('click', (e) => {
      const card = e.target.closest('.sample-card');
      if (!card) return;
      const sampleId = card.getAttribute('data-sample-id');
      const sampleObj = SAMPLE_GALLERY.find(s => s.id === sampleId);
      if (sampleObj) loadSampleImage(sampleObj);
    });
  }

  if (dom.analyzeBtn) dom.analyzeBtn.addEventListener('click', runDiagnosticScan);
  if (dom.resetBtn) dom.resetBtn.addEventListener('click', resetAnalysis);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTab = btn.getAttribute('data-tab');
      renderTabContent();
    });
  });

  document.querySelectorAll('.lang-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.language = pill.getAttribute('data-lang');
      localStorage.setItem('crop_lang', state.language);
      document.querySelectorAll('.lang-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-lang') === state.language);
      });
      updateUiLanguage();
    });
  });

  if (dom.sendChatBtn) dom.sendChatBtn.addEventListener('click', handleChatSubmit);
  if (dom.chatInput) {
    dom.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleChatSubmit();
    });
  }

  if (dom.calcAcreage) dom.calcAcreage.addEventListener('input', calculateFungicideDosage);
  if (dom.calcDosageRate) dom.calcDosageRate.addEventListener('change', calculateFungicideDosage);
  if (dom.motorHp) dom.motorHp.addEventListener('change', calculateMotorKwh);
  if (dom.motorHours) dom.motorHours.addEventListener('input', calculateMotorKwh);

  if (dom.pwaInstallBtn) {
    dom.pwaInstallBtn.addEventListener('click', async () => {
      if (!state.deferredPwaPrompt) return;
      state.deferredPwaPrompt.prompt();
      const { outcome } = await state.deferredPwaPrompt.userChoice;
      if (outcome === 'accepted') dom.pwaInstallBtn.classList.add('hidden');
      state.deferredPwaPrompt = null;
    });
  }

  if (dom.speakAdvisoryBtn) dom.speakAdvisoryBtn.addEventListener('click', playAudioAdvisory);
  if (dom.stopAdvisoryBtn) dom.stopAdvisoryBtn.addEventListener('click', stopAudioAdvisory);
  if (dom.printPdfReportBtn) dom.printPdfReportBtn.addEventListener('click', window.print);

  if (dom.searchWeatherBtn) dom.searchWeatherBtn.addEventListener('click', handleWeatherSearch);
  if (dom.gpsLocationBtn) dom.gpsLocationBtn.addEventListener('click', handleGpsLocation);

  if (dom.buildRxReceiptBtn) dom.buildRxReceiptBtn.addEventListener('click', buildPrintableRxReceipt);

  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      answer.classList.toggle('hidden');
    });
  });

  const voiceBtn = document.getElementById('speechVoiceInputBtn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', startVoiceRecognition);
  }
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  dom.dropZone.classList.remove('dragover');
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files && files[0]) processSelectedFile(files[0]);
}

function handleFileSelect(e) {
  const files = e.target.files;
  if (files && files[0]) processSelectedFile(files[0]);
}

function processSelectedFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload a valid plant leaf image file (JPG, PNG, WEBP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      state.selectedImage = img;
      dom.imagePreview.src = e.target.result;
      dom.previewContainer.classList.remove('hidden');
      dom.dropZone.classList.add('hidden');
    };
  };
  reader.readAsDataURL(file);
}

function loadSampleImage(sampleObj) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = sampleObj.imageUrl;
  img._sampleId = sampleObj.id;
  img.onload = () => {
    state.selectedImage = img;
    dom.imagePreview.src = sampleObj.imageUrl;
    dom.previewContainer.classList.remove('hidden');
    dom.dropZone.classList.add('hidden');
  };
}

async function runDiagnosticScan() {
  if (!state.selectedImage) return;

  dom.loadingState.classList.remove('hidden');
  dom.emptyState.classList.add('hidden');
  dom.resultsContent.classList.add('hidden');
  dom.laserScanner.classList.remove('hidden');

  try {
    const result = await analyzeLeafImage(state.selectedImage, state.currentCropFilter);
    state.currentAnalysis = result;

    setTimeout(() => {
      dom.loadingState.classList.add('hidden');
      dom.laserScanner.classList.add('hidden');
      renderResults(result);
    }, 1200);

  } catch (err) {
    console.error('Scan Failed:', err);
    dom.loadingState.classList.add('hidden');
    dom.laserScanner.classList.add('hidden');
    alert('Diagnostic scan encountered an error. Please try uploading another leaf image.');
  }
}

function resetAnalysis() {
  state.selectedImage = null;
  state.currentAnalysis = null;
  dom.imagePreview.src = '';
  dom.previewContainer.classList.add('hidden');
  dom.dropZone.classList.remove('hidden');
  dom.resultsContent.classList.add('hidden');
  dom.emptyState.classList.remove('hidden');
  stopAudioAdvisory();
}

function renderResults(result) {
  const { disease, confidence } = result;

  let displayDiseaseName = disease.diseaseName;
  let displaySymptoms = disease.symptoms;
  let displayCauses = disease.rootCauses;
  let displayOrganic = disease.organicCures;
  let displayChemical = disease.chemicalCures;
  let displayPrevention = disease.preventionProtocol;
  let displayMineral = disease.mineralDeficiency;

  if (state.language === 'te' && TELUGU_DISEASE_DATA[disease.id]) {
    const teData = TELUGU_DISEASE_DATA[disease.id];
    displayDiseaseName = teData.diseaseName || disease.diseaseName;
    displaySymptoms = teData.symptoms || disease.symptoms;
    displayCauses = teData.rootCauses || disease.rootCauses;
    displayOrganic = teData.organicCures || disease.organicCures;
    displayChemical = teData.chemicalCures || disease.chemicalCures;
    displayPrevention = teData.preventionProtocol || disease.preventionProtocol;
    displayMineral = teData.mineralDeficiency || disease.mineralDeficiency;
  }

  dom.diseaseName.textContent = displayDiseaseName;
  dom.scientificName.textContent = `Scientific: ${disease.scientificName} • Pathogen Type: ${disease.type}`;
  dom.severityBadge.textContent = `${disease.severityLevel} Risk (${disease.severityScore}/100)`;
  dom.severityBadge.style.backgroundColor = disease.badgeColor || '#dc2626';

  dom.confidenceVal.textContent = `${confidence}% Precision`;
  dom.confidenceFill.style.width = `${confidence}%`;

  renderTabContent();
  dom.resultsContent.classList.remove('hidden');
}

function renderTabContent() {
  if (!state.currentAnalysis) return;
  const { disease } = state.currentAnalysis;

  let displaySymptoms = disease.symptoms;
  let displayCauses = disease.rootCauses;
  let displayOrganic = disease.organicCures;
  let displayChemical = disease.chemicalCures;
  let displayPrevention = disease.preventionProtocol;
  let displayMineral = disease.mineralDeficiency;

  if (state.language === 'te' && TELUGU_DISEASE_DATA[disease.id]) {
    const teData = TELUGU_DISEASE_DATA[disease.id];
    displaySymptoms = teData.symptoms || disease.symptoms;
    displayCauses = teData.rootCauses || disease.rootCauses;
    displayOrganic = teData.organicCures || disease.organicCures;
    displayChemical = teData.chemicalCures || disease.chemicalCures;
    displayPrevention = teData.preventionProtocol || disease.preventionProtocol;
    displayMineral = teData.mineralDeficiency || disease.mineralDeficiency;
  }

  const tab = state.activeTab;
  let html = '';

  if (tab === 'root_cause') {
    html = `
      <div style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">🔍 Observed Visual Leaf Symptoms:</div>
      <ul style="margin-bottom:1.25rem;">
        ${displaySymptoms.map(s => `<li>${s}</li>`).join('')}
      </ul>
      <div style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">🌧️ Outbreak Drivers &amp; Climate Triggers:</div>
      <ul>
        ${displayCauses.map(c => `<li>${c}</li>`).join('')}
      </ul>
    `;
  } else if (tab === 'organic') {
    html = displayOrganic.map(o => `
      <div class="cure-box">
        <div class="cure-title">🌿 ${o.name}</div>
        <div class="cure-dosage">Dosage: ${o.dosage}</div>
        <div style="font-size:0.88rem;">${o.application}</div>
      </div>
    `).join('');
  } else if (tab === 'chemical') {
    html = displayChemical.map(c => `
      <div class="cure-box" style="border-left:4px solid #0284c7;">
        <div class="cure-title">🧪 ${c.name}</div>
        <div class="cure-dosage">Dosage: ${c.dosage}</div>
        <div style="font-size:0.88rem; margin-bottom:0.4rem;">${c.application}</div>
        ${c.phiDays ? `<div style="font-size:0.8rem; font-weight:700; color:#dc2626;">⏳ Pre-Harvest Interval (PHI Safety Waiting Days): ${c.phiDays} Days</div>` : ''}
      </div>
    `).join('');
  } else if (tab === 'prevention') {
    html = `
      <div style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">🛡️ Certified Field Agronomy Prevention Protocol:</div>
      <ul>
        ${displayPrevention.map(p => `<li>${p}</li>`).join('')}
      </ul>
    `;
  } else if (tab === 'mineral') {
    html = `
      <div style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">🌱 Soil N-P-K Mineral Deficiency Diagnostics:</div>
      <div class="cure-box" style="border-left:4px solid var(--accent-amber);">
        <div style="font-size:0.9rem; line-height:1.6;">${displayMineral}</div>
      </div>
    `;
  }

  dom.tabBody.innerHTML = html;
}

function handleChatSubmit() {
  const query = dom.chatInput.value.trim();
  if (!query) return;

  const userBubble = document.createElement('div');
  userBubble.style.cssText = "align-self:flex-end; background:#059669; color:#ffffff; padding:0.4rem 0.85rem; border-radius:12px; font-weight:600; max-width:85%;";
  userBubble.textContent = query;
  dom.chatHistory.appendChild(userBubble);
  dom.chatInput.value = '';

  const aiBubble = document.createElement('div');
  aiBubble.style.cssText = "align-self:flex-start; background:#e2e8f0; color:#0f172a; padding:0.5rem 0.85rem; border-radius:12px; max-width:85%; font-size:0.88rem;";
  aiBubble.textContent = "Analyzing query with AI Agronomist engine...";
  dom.chatHistory.appendChild(aiBubble);
  dom.chatHistory.scrollTop = dom.chatHistory.scrollHeight;

  setTimeout(() => {
    aiBubble.textContent = generateAgronomistAnswer(query);
    dom.chatHistory.scrollTop = dom.chatHistory.scrollHeight;
  }, 700);
}

function generateAgronomistAnswer(q) {
  const lower = q.toLowerCase();
  if (lower.includes('watermelon') || lower.includes('పుచ్చకాయ')) {
    return state.language === 'te' 
      ? "పుచ్చకాయ నల్లమచ్చ (Anthracnose) నివారణకు లీటరు నీటికి 1 మి.లీ అమిస్టార్ (Azoxystrobin 23% SC) పిచికారీ చేయాలి. బిందు సేద్యం (Drip) మరియు మల్చింగ్ షీట్ వాడటం శ్రేయస్కరం."
      : "For Watermelon Anthracnose & Fruit Rot, spray Azoxystrobin 23% SC (Amistar @ 1ml/L) or Copper Hydroxide (2.5g/L). Avoid overhead sprinkler irrigation and use drip lines with silver-black mulch.";
  }
  if (lower.includes('banana') || lower.includes('అరటి') || lower.includes('sigatoka')) {
    return state.language === 'te'
      ? "అరటి సిగటోకా ఆకు మచ్చ తెగులుకు లీటరు నీటికి 1 మి.లీ టిల్ట్ (Propiconazole) + 10 మి.లీ స్ప్రే ఆయిల్ కలిపి పిచికారీ చేయాలి. ఎండిన ఆకులను కత్తిరించి నాశనం చేయాలి."
      : "For Banana Sigatoka Leaf Spot, spray Propiconazole 25% EC (Tilt @ 1ml/L) emulsified with 10ml Horticultural Mineral Oil. Remove and burn dry infected lower leaves.";
  }
  if (lower.includes('chilli') || lower.includes('మిరప') || lower.includes('thrips')) {
    return state.language === 'te'
      ? "మిరప నల్ల తామర పురుగుకు లీటరు నీటికి 1.25 మి.లీ కొరోమండల్ ఫినియో (Finio) + 0.5 మి.లీ స్ప్రెడ్‌మాక్స్ కలిపి పిచికారీ చేయాలి. ఎకరానికి 30 నీలి రంగు జిగురు కార్డులు అమర్చాలి."
      : "For Chilli Black Thrips & Leaf Curl, spray Coromandel Finio (1.25ml/L) + Spreadmax sticker (0.5ml/L). Install 30 blue and yellow sticky traps per acre.";
  }
  return state.language === 'te'
    ? "మీ పంట వివరాలు అందాయి. సరైన పోషకాహారం (19-19-19) మరియు వాతావరణ ఆధారిత నివారణ పిచికారీ చేయండి."
    : "Recommendation: Apply balanced N-P-K (19-19-19 @ 3g/L) and follow certified ICAR/FAO pre-harvest safety waiting guidelines.";
}

function calculateFungicideDosage() {
  const acres = parseFloat(dom.calcAcreage.value) || 1;
  const rate = parseFloat(dom.calcDosageRate.value) || 1;
  const waterLiters = acres * 200;
  const medTotal = waterLiters * rate;
  dom.calcWaterOutput.textContent = `${waterLiters} Liters`;
  dom.calcMedOutput.textContent = `${medTotal} ml / grams`;
}

function calculateMotorKwh() {
  const hp = parseFloat(dom.motorHp.value) || 5;
  const hours = parseFloat(dom.motorHours.value) || 4;
  const kwh = (hp * 0.746 * hours).toFixed(1);
  dom.motorKwhOutput.textContent = `${kwh} kWh / day`;
}

function playAudioAdvisory() {
  if (!state.currentAnalysis) return;
  const { disease } = state.currentAnalysis;

  stopAudioAdvisory();

  let text = `Diagnosed ${disease.diseaseName}. Symptoms include ${disease.symptoms.join('. ')}. Recommended organic treatment: ${disease.organicCures[0].name} at dosage ${disease.organicCures[0].dosage}.`;
  if (state.language === 'te' && TELUGU_DISEASE_DATA[disease.id]) {
    const te = TELUGU_DISEASE_DATA[disease.id];
    text = `నిర్ధారించిన వ్యాధి ${te.diseaseName}. లక్షణాలు: ${te.symptoms.join('. ')}. సిఫార్సు చేసిన మందు: ${te.chemicalCures[0].name}, మోతాదు: ${te.chemicalCures[0].dosage}.`;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = state.language === 'te' ? 'te-IN' : 'en-US';
  utterance.onend = () => {
    dom.speakAdvisoryBtn.classList.remove('hidden');
    dom.stopAdvisoryBtn.classList.add('hidden');
  };

  state.speechUtterance = utterance;
  speechSynthesis.speak(utterance);

  dom.speakAdvisoryBtn.classList.add('hidden');
  dom.stopAdvisoryBtn.classList.remove('hidden');
}

function stopAudioAdvisory() {
  if (speechSynthesis.speaking) speechSynthesis.cancel();
  if (dom.speakAdvisoryBtn) dom.speakAdvisoryBtn.classList.remove('hidden');
  if (dom.stopAdvisoryBtn) dom.stopAdvisoryBtn.classList.add('hidden');
}

function updateUiLanguage() {
  const dict = TRANSLATIONS[state.language] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.placeholder = dict[key];
  });

  if (state.currentAnalysis) renderResults(state.currentAnalysis);
}

function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice input is not supported in this browser. Please type your question.');
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = state.language === 'te' ? 'te-IN' : 'en-US';
  recognition.start();
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    dom.chatInput.value = transcript;
    handleChatSubmit();
  };
}

function initWeatherMap() {
  if (leafletMap) return;
  const container = document.getElementById('weatherMapContainer');
  if (!container) return;

  leafletMap = L.map('weatherMapContainer').setView([16.3067, 80.4365], 9); // Guntur AP coordinates
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
  }).addTo(leafletMap);

  leafletMarker = L.marker([16.3067, 80.4365]).addTo(leafletMap)
    .bindPopup('<b>Guntur Crop Outbreak Radar</b><br>Humidity: 88% • Risk: Watermelon Anthracnose &amp; Chilli Thrips')
    .openPopup();
}

function handleWeatherSearch() {
  const loc = dom.weatherLocationInput.value.trim();
  if (!loc) return;
  document.getElementById('weatherLocationName').textContent = `${loc}, AP & Telangana Region`;
  document.getElementById('weatherRiskAlertText').textContent = `High Humidity & Dew Outbreak Alert for ${loc}! High risk of Watermelon Anthracnose, Chilli Thrips & Banana Sigatoka.`;
  if (leafletMap && leafletMarker) {
    leafletMarker.setPopupContent(`<b>${loc} Agriculture Radar</b><br>Humidity: 85% • High Disease Outbreak Risk`).openPopup();
  }
}

function handleGpsLocation() {
  if (!navigator.geolocation) {
    alert('GPS location is not supported on your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    document.getElementById('weatherLocationName').textContent = `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
    if (leafletMap) {
      leafletMap.setView([lat, lng], 11);
      if (leafletMarker) leafletMarker.setLatLng([lat, lng]).bindPopup(`<b>Your GPS Location</b><br>Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`).openPopup();
    }
  });
}

function renderDiseaseLibrary() {
  const grid = document.getElementById('diseaseLibraryGrid');
  if (!grid) return;
  grid.innerHTML = CROP_DISEASES.map(d => `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:var(--radius-md); padding:1.25rem;">
      <div style="font-size:0.75rem; font-weight:700; color:var(--primary-emerald); text-transform:uppercase;">${d.crop}</div>
      <div style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin:0.25rem 0;">${d.diseaseName}</div>
      <div style="font-size:0.8rem; font-style:italic; color:var(--text-muted); margin-bottom:0.75rem;">${d.scientificName}</div>
      <div style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;"><strong>Certified Cure:</strong> ${d.chemicalCures[0].name} (${d.chemicalCures[0].dosage})</div>
    </div>
  `).join('');
}

function buildPrintableRxReceipt() {
  const farmer = dom.rxFarmerName.value || "Farmer";
  const village = dom.rxVillage.value || "AP & Telangana";
  const crop = dom.rxCrop.value || "Chilli";
  const disease = dom.rxDisease.value || "Chilli Black Thrips";

  dom.rxReceiptOutput.classList.remove('hidden');
  dom.rxReceiptOutput.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #2563eb; padding-bottom:0.75rem; margin-bottom:1rem;">
      <div>
        <h3 style="font-family:'Outfit',sans-serif; color:#2563eb; margin:0; font-size:1.25rem;">CROP CARE AI - AGRONOMY PRESCRIPTION</h3>
        <div style="font-size:0.8rem; color:var(--text-muted);">Standardized with ICAR &amp; KVK Plant Pathology Guidelines</div>
      </div>
      <div style="font-size:0.8rem; text-align:right;">
        <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
        <div><strong>Rx ID:</strong> RX-${Math.floor(100000 + Math.random() * 900000)}</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.88rem; margin-bottom:1rem;">
      <div><strong>Farmer Name:</strong> ${farmer}</div>
      <div><strong>Village/District:</strong> ${village}</div>
      <div><strong>Crop &amp; Area:</strong> ${crop}</div>
      <div><strong>Diagnosed Disease:</strong> ${disease}</div>
    </div>

    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:var(--radius-sm); padding:1rem; margin-bottom:1.25rem;">
      <h4 style="font-family:'Outfit',sans-serif; color:#1e40af; margin-bottom:0.5rem; font-size:0.95rem;">
        💊 AUTHORIZED PESTICIDE DEALER REMEDY PRESCRIPTION
      </h4>
      <table style="width:100%; font-size:0.85rem; border-collapse:collapse;">
        <thead>
          <tr style="background:#e2e8f0; text-align:left;">
            <th style="padding:0.4rem;">Product / Medicine Name</th>
            <th style="padding:0.4rem;">Chemical Active</th>
            <th style="padding:0.4rem;">Prescribed Dosage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:0.4rem; border-bottom:1px solid #e2e8f0;"><strong>Coromandel Finio</strong></td>
            <td style="padding:0.4rem; border-bottom:1px solid #e2e8f0;">Diafenthiuron 47% + Pyriproxyfen 5%</td>
            <td style="padding:0.4rem; border-bottom:1px solid #e2e8f0;">1.25 ml / Liter water</td>
          </tr>
          <tr>
            <td style="padding:0.4rem; border-bottom:1px solid #e2e8f0;"><strong>Coromandel Spreadmax</strong></td>
            <td style="padding:0.4rem; border-bottom:1px solid #e2e8f0;">Silicone Spreader Sticker</td>
            <td style="padding:0.4rem; border-bottom:1px solid #e2e8f0;">0.5 ml / Liter water</td>
          </tr>
          <tr>
            <td style="padding:0.4rem;"><strong>Coromandel Fantac Plus</strong></td>
            <td style="padding:0.4rem;">Amino Acids Plant Growth Booster</td>
            <td style="padding:0.4rem;">1.0 ml / Liter water</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.78rem; color:var(--text-muted); font-style:italic; text-align:center;">
      Note to Pesticide Store Dealer: Please provide exact chemical formulation specified above. Do not substitute with uncertified generic brands.
    </div>
  `;
}

// MODAL CONTROLS FOR ABOUT US, CONTACT US, & PRIVACY POLICY (ADSENSE POLICY COMPLIANCE)
document.addEventListener('click', (e) => {
  const aboutBtn = e.target.closest('#footerAboutBtn');
  const contactBtn = e.target.closest('#footerContactBtn');
  const privacyBtn = e.target.closest('#footerPrivacyBtn');

  const closeAbout = e.target.closest('#closeAboutModal');
  const closeContact = e.target.closest('#closeContactModal');
  const closePrivacy = e.target.closest('#closePrivacyModal');

  const aboutModal = document.getElementById('aboutModal');
  const contactModal = document.getElementById('contactModal');
  const privacyModal = document.getElementById('privacyModal');

  if (aboutBtn) {
    e.preventDefault();
    if (aboutModal) aboutModal.classList.remove('hidden');
    return;
  }
  if (contactBtn) {
    e.preventDefault();
    if (contactModal) contactModal.classList.remove('hidden');
    return;
  }
  if (privacyBtn) {
    e.preventDefault();
    if (privacyModal) privacyModal.classList.remove('hidden');
    return;
  }

  if (closeAbout || (aboutModal && e.target === aboutModal)) {
    if (aboutModal) aboutModal.classList.add('hidden');
  }
  if (closeContact || (contactModal && e.target === contactModal)) {
    if (contactModal) contactModal.classList.add('hidden');
  }
  if (closePrivacy || (privacyModal && e.target === privacyModal)) {
    if (privacyModal) privacyModal.classList.add('hidden');
  }
});

// Contact form submit handling
document.addEventListener('submit', (e) => {
  if (e.target.id === 'contactForm') {
    e.preventDefault();
    const msg = document.getElementById('contactSuccessMsg');
    if (msg) msg.classList.remove('hidden');
    setTimeout(() => {
      e.target.reset();
      const contactModal = document.getElementById('contactModal');
      if (contactModal) contactModal.classList.add('hidden');
      if (msg) msg.classList.add('hidden');
    }, 2500);
  }
});
