import { CROP_DISEASES, CROP_LIST } from './diseaseDatabase.js';
import { SAMPLE_GALLERY } from './sampleImages.js';
import { analyzeLeafImage } from './imageAnalyzer.js';
import { TRANSLATIONS, TELUGU_DISEASE_DATA } from './translations.js';
import { AICropDoctor } from './aiCropDoctor.js';
import { renderOutbreakHeatmapGrid } from './outbreakMap.js';
import { recommendBestCropFromSoil } from './soilRecommendation.js';
import { renderCommunityGallery, renderMarketplaceStores } from './communityMarketplace.js';

const cropDoctorInstance = new AICropDoctor();

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
  renderCropDoctorUI();
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
  const doctor = document.getElementById('sectionDoctor');
  const outbreak = document.getElementById('sectionOutbreak');
  const soil = document.getElementById('sectionSoil');
  const community = document.getElementById('sectionCommunity');
  const marketplace = document.getElementById('sectionMarketplace');

  if (predictor) predictor.classList.add('hidden');
  if (weather) weather.classList.add('hidden');
  if (library) library.classList.add('hidden');
  if (calculator) calculator.classList.add('hidden');
  if (medicines) medicines.classList.add('hidden');
  if (schedule) schedule.classList.add('hidden');
  if (mandi) mandi.classList.add('hidden');
  if (prescription) prescription.classList.add('hidden');
  if (doctor) doctor.classList.add('hidden');
  if (outbreak) outbreak.classList.add('hidden');
  if (soil) soil.classList.add('hidden');
  if (community) community.classList.add('hidden');
  if (marketplace) marketplace.classList.add('hidden');

  if (sec === 'predictor') {
    if (heroBanner) heroBanner.classList.remove('hidden');
    if (metricsBar) metricsBar.classList.remove('hidden');
    if (weatherAlert) weatherAlert.classList.remove('hidden');
    if (predictor) predictor.classList.remove('hidden');
  } else if (sec === 'doctor') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (doctor) doctor.classList.remove('hidden');
    renderCropDoctorUI();
  } else if (sec === 'outbreak') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (outbreak) outbreak.classList.remove('hidden');
    renderOutbreakHeatmapGrid('outbreakGrid');
  } else if (sec === 'soil') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (soil) soil.classList.remove('hidden');
  } else if (sec === 'community') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (community) community.classList.remove('hidden');
    renderCommunityGallery('communityPostsContainer');
  } else if (sec === 'marketplace') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (marketplace) marketplace.classList.remove('hidden');
    renderMarketplaceStores('marketplaceStoresContainer');
  } else if (sec === 'weather') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (weather) weather.classList.remove('hidden');
    updateLocationWeatherForecast(document.getElementById('weatherLocationInput')?.value || "Guntur");
    if (leafletMap) {
      setTimeout(() => leafletMap.invalidateSize(), 300);
    }
  } else if (sec === 'library') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (library) library.classList.remove('hidden');
    renderLibrary();
  } else if (sec === 'calculator') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (calculator) calculator.classList.remove('hidden');
    calculateDosage();
    calculateMotorIrrigation();
  } else if (sec === 'medicines') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (medicines) medicines.classList.remove('hidden');
    renderMedicinesDirectory();
  } else if (sec === 'schedule') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (schedule) schedule.classList.remove('hidden');
    renderCropFertigationSchedule();
  } else if (sec === 'mandi') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (mandi) mandi.classList.remove('hidden');
    renderMandiPricesGrid();
    calculateMandiProfit();
  } else if (sec === 'prescription') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (prescription) prescription.classList.remove('hidden');
    generateShopPrescriptionReceipt();
  }

  if (drawer) drawer.classList.remove('active');
  if (drawerOverlay) drawerOverlay.classList.remove('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function applyLightMode() {
  document.documentElement.setAttribute('data-theme', 'light');
  document.body.setAttribute('data-theme', 'light');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Crop Care AI ServiceWorker Registered Successfully'))
      .catch(err => console.log('ServiceWorker registration error:', err));
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPwaPrompt = e;
    if (dom.pwaInstallBtn) {
      dom.pwaInstallBtn.classList.remove('hidden');
    }
  });
}

function initDomReferences() {
  dom = {
    langPills: document.querySelectorAll('.lang-pill'),
    cropSelect: document.getElementById('cropSelect'),
    dropzone: document.getElementById('dropzone'),
    fileInput: document.getElementById('fileInput'),
    cameraBtn: document.getElementById('cameraBtn'),
    previewContainer: document.getElementById('previewContainer'),
    previewImage: document.getElementById('previewImage'),
    scannerOverlay: document.getElementById('scannerOverlay'),
    sampleGrid: document.getElementById('sampleGrid'),
    
    // Result elements
    resultCard: document.getElementById('resultCard'),
    placeholderCard: document.getElementById('placeholderCard'),
    diseaseName: document.getElementById('diseaseName'),
    scientificName: document.getElementById('scientificName'),
    severityPill: document.getElementById('severityPill'),
    confidenceVal: document.getElementById('confidenceVal'),
    confidenceFill: document.getElementById('confidenceFill'),
    whatsappShareBtn: document.getElementById('whatsappShareBtn'),
    
    // Growth & Adoption Buttons
    pwaInstallBtn: document.getElementById('pwaInstallBtn'),
    voiceSearchBtn: document.getElementById('voiceSearchBtn'),
    callHotlineBtn: document.getElementById('callHotlineBtn'),
    audioBtn: document.getElementById('audioBtn'),
    printPdfBtn: document.getElementById('printPdfBtn'),

    // Weather elements
    weatherLocationInput: document.getElementById('weatherLocationInput'),
    searchWeatherBtn: document.getElementById('searchWeatherBtn'),
    gpsLocationBtn: document.getElementById('gpsLocationBtn'),
    weatherCityTitle: document.getElementById('weatherCityTitle'),
    weatherConditionDesc: document.getElementById('weatherConditionDesc'),
    weatherRiskBadge: document.getElementById('weatherRiskBadge'),
    weatherTempVal: document.getElementById('weatherTempVal'),
    weatherHumidityVal: document.getElementById('weatherHumidityVal'),
    weatherWindVal: document.getElementById('weatherWindVal'),
    weatherDiseaseList: document.getElementById('weatherDiseaseList'),
    weatherAdvisoryText: document.getElementById('weatherAdvisoryText'),

    // Tabs & Contents
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabRootCause: document.getElementById('tabRootCause'),
    tabOrganic: document.getElementById('tabOrganic'),
    tabChemical: document.getElementById('tabChemical'),
    tabPrevention: document.getElementById('tabPrevention'),
    tabDeficiency: document.getElementById('tabDeficiency'),
    
    // Chat elements
    chatInput: document.getElementById('chatInput'),
    sendChatBtn: document.getElementById('sendChatBtn'),
    chatContainer: document.getElementById('chatContainer'),
    
    // Calculator elements
    calcArea: document.getElementById('calcArea'),
    calcRate: document.getElementById('calcRate'),
    calcWaterVol: document.getElementById('calcWaterVol'),
    calcChemicalDosage: document.getElementById('calcChemicalDosage'),

    // Motor Calculator
    motorCropSelect: document.getElementById('motorCropSelect'),
    motorAcres: document.getElementById('motorAcres'),
    motorHpSelect: document.getElementById('motorHpSelect'),
    motorSoilSelect: document.getElementById('motorSoilSelect'),
    motorRunHoursVal: document.getElementById('motorRunHoursVal'),
    motorWaterVolVal: document.getElementById('motorWaterVolVal'),
    motorKwhVal: document.getElementById('motorKwhVal'),
    motorCostVal: document.getElementById('motorCostVal'),

    // FAQ items
    faqQuestions: document.querySelectorAll('.faq-question')
  };
}

function renderCropSelector() {
  if (!dom.cropSelect) return;
  dom.cropSelect.innerHTML = CROP_LIST.map(crop => `<option value="${crop}">${crop}</option>`).join('');
}

function renderSampleGallery() {
  if (!dom.sampleGrid) return;
  dom.sampleGrid.innerHTML = SAMPLE_GALLERY.map(sample => `
    <div class="sample-card" data-sample-id="${sample.id}">
      <div class="sample-thumb">
        <img src="${sample.svgVisual || sample.imageUrl}" alt="${sample.diseaseName || sample.label}" class="sample-img" />
      </div>
      <div class="sample-name">${sample.diseaseName || sample.label}</div>
      <div class="sample-crop">${sample.crop}</div>
    </div>
  `).join('');

  document.querySelectorAll('.sample-card').forEach(card => {
    card.addEventListener('click', () => {
      const sampleId = card.getAttribute('data-sample-id');
      const sampleObj = SAMPLE_GALLERY.find(s => s.id === sampleId);
      if (sampleObj) {
        processSelectedImage(sampleObj.svgVisual || sampleObj.imageUrl, sampleId);
      }
    });
  });
}

function updateUiLanguage() {
  const dict = TRANSLATIONS[state.language];
  
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.dataset.i18n;
    if (dict[key]) {
      elem.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
    const key = elem.dataset.i18nPlaceholder;
    if (dict[key]) {
      elem.placeholder = dict[key];
    }
  });

  if (state.currentAnalysis) {
    displayAnalysisResults(state.currentAnalysis);
  }
}

function bindEvents() {
  dom.langPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dom.langPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.language = pill.dataset.lang;
      localStorage.setItem('crop_lang', state.language);
      updateUiLanguage();
    });
  });

  if (dom.pwaInstallBtn) {
    dom.pwaInstallBtn.addEventListener('click', () => {
      if (state.deferredPwaPrompt) {
        state.deferredPwaPrompt.prompt();
        state.deferredPwaPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            dom.pwaInstallBtn.textContent = TRANSLATIONS[state.language].pwaInstalledText;
          }
          state.deferredPwaPrompt = null;
        });
      }
    });
  }

  if (dom.voiceSearchBtn) {
    dom.voiceSearchBtn.addEventListener('click', startVoiceMicInput);
  }

  if (dom.callHotlineBtn) {
    dom.callHotlineBtn.addEventListener('click', () => {
      window.location.href = 'tel:18001801551';
    });
  }

  if (dom.audioBtn) {
    dom.audioBtn.addEventListener('click', toggleAudioAdvisory);
  }

  if (dom.printPdfBtn) {
    dom.printPdfBtn.addEventListener('click', generatePdfReport);
  }

  if (dom.searchWeatherBtn) {
    dom.searchWeatherBtn.addEventListener('click', () => {
      const city = dom.weatherLocationInput.value.trim();
      if (city) updateLocationWeatherForecast(city);
    });
  }

  if (dom.gpsLocationBtn) {
    dom.gpsLocationBtn.addEventListener('click', useUserGpsLocation);
  }

  if (dom.dropzone) {
    dom.dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dom.dropzone.classList.add('dragover');
    });
    dom.dropzone.addEventListener('dragleave', () => {
      dom.dropzone.classList.remove('dragover');
    });
    dom.dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dom.dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
    dom.dropzone.addEventListener('click', () => {
      dom.fileInput.click();
    });
  }

  if (dom.fileInput) {
    dom.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  if (dom.cameraBtn) {
    dom.cameraBtn.addEventListener('click', startWebcamCapture);
  }

  if (dom.cropSelect) {
    dom.cropSelect.addEventListener('change', (e) => {
      state.currentCropFilter = e.target.value;
      if (state.selectedImage) {
        runAnalysis(state.selectedImage);
      }
    });
  }

  dom.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTab = btn.dataset.tab;
      renderTabContent();
    });
  });

  dom.faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      answer.classList.toggle('hidden');
    });
  });

  if (dom.calcArea && dom.calcRate) {
    dom.calcArea.addEventListener('input', calculateDosage);
    dom.calcRate.addEventListener('input', calculateDosage);
  }

  if (dom.motorCropSelect && dom.motorAcres && dom.motorHpSelect && dom.motorSoilSelect) {
    dom.motorCropSelect.addEventListener('change', calculateMotorIrrigation);
    dom.motorAcres.addEventListener('input', calculateMotorIrrigation);
    dom.motorHpSelect.addEventListener('change', calculateMotorIrrigation);
    dom.motorSoilSelect.addEventListener('change', calculateMotorIrrigation);
  }

  if (dom.sendChatBtn && dom.chatInput) {
    dom.sendChatBtn.addEventListener('click', handleUserChatMessage);
    dom.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserChatMessage();
    });
  }
}

function handleFileSelect(file) {
  if (!file.type.startsWith('image/')) {
    alert(state.language === 'te' ? "దయచేసి ఆకు ఫోటోను మాత్రమే ఎంచుకోండి." : "Please select a valid image file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    processSelectedImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function processSelectedImage(imgSrc, sampleIdHint = null) {
  state.selectedImage = imgSrc;
  dom.previewImage.src = imgSrc;
  dom.previewContainer.classList.remove('hidden');
  
  if (sampleIdHint) {
    dom.previewImage._sampleId = sampleIdHint;
  } else {
    delete dom.previewImage._sampleId;
  }

  dom.previewContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  runAnalysis(dom.previewImage);
}

async function runAnalysis(imgElement) {
  if (state.isScanning) return;
  state.isScanning = true;

  dom.placeholderCard.classList.add('hidden');
  dom.resultCard.classList.add('hidden');
  dom.scannerOverlay.classList.remove('hidden');

  try {
    const result = await analyzeLeafImage(imgElement, state.currentCropFilter);
    state.currentAnalysis = result;

    setTimeout(() => {
      dom.scannerOverlay.classList.add('hidden');
      dom.resultCard.classList.remove('hidden');
      displayAnalysisResults(result);
      state.isScanning = false;
    }, 1200);

  } catch (err) {
    console.error('Scan Error:', err);
    dom.scannerOverlay.classList.add('hidden');
    dom.placeholderCard.classList.remove('hidden');
    state.isScanning = false;
    alert(state.language === 'te' ? "వ్యాధి విశ్లేషణలో లోపం జరిగింది. దయచేసి మరొక ఫోటోతో ప్రయత్నించండి." : "Diagnostic scan error. Please try uploading another leaf image.");
  }
}

function displayAnalysisResults(analysis) {
  const disease = analysis.disease;
  
  let diseaseName = disease.diseaseName;
  let symptoms = disease.symptoms;
  let rootCauses = disease.rootCauses;
  let organicCures = disease.organicCures;
  let chemicalCures = disease.chemicalCures;
  let preventionProtocol = disease.preventionProtocol;
  let mineralDeficiency = disease.mineralDeficiency;

  if (state.language === 'te' && TELUGU_DISEASE_DATA[disease.id]) {
    const teData = TELUGU_DISEASE_DATA[disease.id];
    diseaseName = teData.diseaseName || diseaseName;
    symptoms = teData.symptoms || symptoms;
    rootCauses = teData.rootCauses || rootCauses;
    organicCures = teData.organicCures || organicCures;
    chemicalCures = teData.chemicalCures || chemicalCures;
    preventionProtocol = teData.preventionProtocol || preventionProtocol;
    mineralDeficiency = teData.mineralDeficiency || mineralDeficiency;
  }

  dom.diseaseName.textContent = diseaseName;
  dom.scientificName.textContent = `Scientific: ${disease.scientificName} • Pathogen: ${disease.type}`;
  
  dom.severityPill.textContent = `${disease.severityLevel} (${disease.severityScore}/100)`;
  dom.severityPill.style.background = disease.badgeColor || '#dc2626';

  dom.confidenceVal.textContent = `${analysis.confidence}% Precision`;
  dom.confidenceFill.style.width = `${analysis.confidence}%`;

  if (analysis.heatmapDataUrl) {
    const heatContainer = document.getElementById('heatmapVisualContainer');
    const heatImg = document.getElementById('heatmapImage');
    if (heatContainer && heatImg) {
      heatImg.src = analysis.heatmapDataUrl;
      heatContainer.classList.remove('hidden');
    }
  }

  renderTabContent();
}

function renderTabContent() {
  if (!state.currentAnalysis) return;

  const disease = state.currentAnalysis.disease;
  let symptoms = disease.symptoms;
  let rootCauses = disease.rootCauses;
  let organicCures = disease.organicCures;
  let chemicalCures = disease.chemicalCures;
  let preventionProtocol = disease.preventionProtocol;
  let mineralDeficiency = disease.mineralDeficiency;

  if (state.language === 'te' && TELUGU_DISEASE_DATA[disease.id]) {
    const teData = TELUGU_DISEASE_DATA[disease.id];
    symptoms = teData.symptoms || symptoms;
    rootCauses = teData.rootCauses || rootCauses;
    organicCures = teData.organicCures || organicCures;
    chemicalCures = teData.chemicalCures || chemicalCures;
    preventionProtocol = teData.preventionProtocol || preventionProtocol;
    mineralDeficiency = teData.mineralDeficiency || mineralDeficiency;
  }

  dom.tabRootCause.innerHTML = `
    <div style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">🔍 Observed Visual Leaf Symptoms:</div>
    <ul style="margin-bottom:1rem;">
      ${symptoms.map(s => `<li>${s}</li>`).join('')}
    </ul>
    <div style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">🌧️ Outbreak Drivers &amp; Climate Triggers:</div>
    <ul>
      ${rootCauses.map(c => `<li>${c}</li>`).join('')}
    </ul>
  `;

  dom.tabOrganic.innerHTML = organicCures.map(c => `
    <div class="cure-box">
      <div class="cure-title">🌿 ${c.name}</div>
      <div class="cure-dosage">Dosage: ${c.dosage}</div>
      <div style="font-size:0.88rem;">${c.application}</div>
    </div>
  `).join('');

  dom.tabChemical.innerHTML = chemicalCures.map(c => `
    <div class="cure-box" style="border-left:4px solid #0284c7;">
      <div class="cure-title">🧪 ${c.name}</div>
      <div class="cure-dosage">Dosage: ${c.dosage}</div>
      <div style="font-size:0.88rem; margin-bottom:0.3rem;">${c.application}</div>
      ${c.phiDays ? `<div style="font-size:0.8rem; font-weight:700; color:#dc2626;">⏳ Pre-Harvest Interval (PHI Safety Waiting Days): ${c.phiDays} Days</div>` : ''}
    </div>
  `).join('');

  dom.tabPrevention.innerHTML = `
    <div style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">🛡️ Certified Field Agronomy Prevention Protocol:</div>
    <ul>
      ${preventionProtocol.map(p => `<li>${p}</li>`).join('')}
    </ul>
  `;

  dom.tabDeficiency.innerHTML = `
    <div style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">🌱 Soil N-P-K Mineral Deficiency Diagnostics:</div>
    <div class="cure-box" style="border-left:4px solid var(--accent-amber);">
      <div style="font-size:0.9rem; line-height:1.6;">${mineralDeficiency}</div>
    </div>
  `;

  dom.tabRootCause.classList.toggle('hidden', state.activeTab !== 'root_cause');
  dom.tabOrganic.classList.toggle('hidden', state.activeTab !== 'organic');
  dom.tabChemical.classList.toggle('hidden', state.activeTab !== 'chemical');
  dom.tabPrevention.classList.toggle('hidden', state.activeTab !== 'prevention');
  dom.tabDeficiency.classList.toggle('hidden', state.activeTab !== 'mineral');
}

function calculateDosage() {
  const acres = parseFloat(dom.calcArea.value) || 1;
  const rate = parseFloat(dom.calcRate.value) || 1.25;

  const waterLiters = acres * 200;
  const totalMed = waterLiters * rate;

  dom.calcWaterVol.textContent = `${waterLiters} Liters`;
  dom.calcChemicalDosage.textContent = `${totalMed.toFixed(0)} ml / grams`;
}

function calculateMotorIrrigation() {
  const acres = parseFloat(dom.motorAcres.value) || 1;
  const hp = parseFloat(dom.motorHpSelect.value) || 5;
  const soil = dom.motorSoilSelect.value || 'loam';

  let baseHours = 4 * acres;
  if (soil === 'sandy') baseHours *= 1.35;
  if (soil === 'clay') baseHours *= 0.85;

  const runHours = Math.min(Math.max(baseHours, 1), 18).toFixed(1);
  const waterVol = (runHours * 12000).toLocaleString();
  const kwh = (hp * 0.746 * runHours).toFixed(1);
  const cost = (kwh * 6.5).toFixed(0);

  if (dom.motorRunHoursVal) dom.motorRunHoursVal.textContent = `${runHours} Hours / day`;
  if (dom.motorWaterVolVal) dom.motorWaterVolVal.textContent = `${waterVol} Liters`;
  if (dom.motorKwhVal) dom.motorKwhVal.textContent = `${kwh} kWh`;
  if (dom.motorCostVal) dom.motorCostVal.textContent = `₹ ${cost} / day`;
}

function toggleAudioAdvisory() {
  if (!state.currentAnalysis) return;

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    dom.audioBtn.textContent = state.language === 'te' ? '🔊 వాయిస్ సలహా వినండి' : '🔊 Listen Audio Advisory';
    return;
  }

  const disease = state.currentAnalysis.disease;
  let text = `Diagnosed ${disease.diseaseName}. Recommended treatment: ${disease.chemicalCures[0].name} at dosage ${disease.chemicalCures[0].dosage}.`;

  if (state.language === 'te' && TELUGU_DISEASE_DATA[disease.id]) {
    const te = TELUGU_DISEASE_DATA[disease.id];
    text = `నిర్ధారించిన వ్యాధి ${te.diseaseName}. సిఫార్సు చేసిన మందు: ${te.chemicalCures[0].name}, మోతాదు: ${te.chemicalCures[0].dosage}.`;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = state.language === 'te' ? 'te-IN' : 'en-US';
  utterance.onend = () => {
    dom.audioBtn.textContent = state.language === 'te' ? '🔊 వాయిస్ సలహా వినండి' : '🔊 Listen Audio Advisory';
  };

  speechSynthesis.speak(utterance);
  dom.audioBtn.textContent = state.language === 'te' ? '⏹️ ఆడియో ఆపు' : '⏹️ Stop Audio';
}

function generatePdfReport() {
  window.print();
}

function startVoiceMicInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert(state.language === 'te' ? "మీ బ్రౌజర్‌లో వాయిస్ శోధన లభ్యం కాలేదు." : "Voice search is not supported on this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.language === 'te' ? 'te-IN' : 'en-US';
  recognition.start();

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    dom.chatInput.value = text;
    handleUserChatMessage();
  };
}

function handleUserChatMessage() {
  const msg = dom.chatInput.value.trim();
  if (!msg) return;

  const userElem = document.createElement('div');
  userElem.style.cssText = 'align-self: flex-end; background: #059669; color: #fff; padding: 0.5rem 1rem; border-radius: 12px; font-weight: 600; max-width: 80%; margin-bottom: 0.5rem;';
  userElem.textContent = msg;
  dom.chatContainer.appendChild(userElem);
  dom.chatInput.value = '';

  const botElem = document.createElement('div');
  botElem.style.cssText = 'align-self: flex-start; background: #e2e8f0; color: #0f172a; padding: 0.6rem 1rem; border-radius: 12px; max-width: 85%; font-size: 0.9rem; margin-bottom: 0.5rem;';
  botElem.textContent = state.language === 'te' ? "పరిశీలిస్తున్నాను..." : "Analyzing query...";
  dom.chatContainer.appendChild(botElem);
  dom.chatContainer.scrollTop = dom.chatContainer.scrollHeight;

  setTimeout(() => {
    botElem.textContent = getAgronomistBotResponse(msg);
    dom.chatContainer.scrollTop = dom.chatContainer.scrollHeight;
  }, 600);
}

function getAgronomistBotResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('watermelon') || q.includes('పుచ్చకాయ')) {
    return state.language === 'te'
      ? "పుచ్చకాయ నల్లమచ్చ (Anthracnose) నివారణకు లీటరు నీటికి 1 మి.లీ అమిస్టార్ (Azoxystrobin 23% SC) పిచికారీ చేయాలి. బిందు సేద్యం (Drip) మరియు మల్చింగ్ షీట్ వాడటం శ్రేయస్కరం."
      : "For Watermelon Anthracnose & Fruit Rot, spray Azoxystrobin 23% SC (Amistar @ 1ml/L) or Copper Hydroxide (2.5g/L). Avoid overhead sprinkler irrigation and use drip lines with silver-black mulch.";
  }
  if (q.includes('banana') || q.includes('అరటి') || q.includes('sigatoka')) {
    return state.language === 'te'
      ? "అరటి సిగటోకా ఆకు మచ్చ తెగులుకు లీటరు నీటికి 1 మి.లీ టిల్ట్ (Propiconazole) + 10 మి.లీ స్ప్రే ఆయిల్ కలిపి పిచికారీ చేయాలి. ఎండిన ఆకుల కత్తిరింపు చాలా ముఖ్యం."
      : "For Banana Sigatoka Leaf Spot, spray Propiconazole 25% EC (Tilt @ 1ml/L) emulsified with 10ml Horticultural Mineral Oil. Remove and burn dry infected lower leaves.";
  }
  if (q.includes('chilli') || q.includes('మిరప') || q.includes('thrips')) {
    return state.language === 'te'
      ? "మిరప నల్ల తామర పురుగుకు లీటరు నీటికి 1.25 మి.లీ కొరోమండల్ ఫినియో (Finio) + 0.5 మి.లీ స్ప్రెడ్‌మాక్స్ కలిపి పిచికారీ చేయాలి. ఎకరానికి 30 నీలి రంగు జిగురు కార్డులు అమర్చాలి."
      : "For Chilli Black Thrips & Leaf Curl, spray Coromandel Finio (1.25ml/L) + Spreadmax sticker (0.5ml/L). Install 30 blue and yellow sticky traps per acre.";
  }

  return state.language === 'te'
    ? "మీ పంట వివరాలు అందాయి. సరైన పోషకాహారం (19-19-19) మరియు వాతావరణ ఆధారిత నివారణ పిచికారీ చేయండి."
    : "Recommendation: Apply balanced N-P-K (19-19-19 @ 3g/L) and follow certified ICAR/FAO pre-harvest safety waiting guidelines.";
}

function startWebcamCapture() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert(state.language === 'te' ? "కెమెరా అందుబాటులో లేదు." : "Camera is not supported on this device.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:1000; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem;';
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.style.cssText = 'max-width:90%; max-height:70vh; border-radius:12px; border:2px solid #059669;';

      const snapBtn = document.createElement('button');
      snapBtn.className = 'btn-primary';
      snapBtn.style.width = 'auto';
      snapBtn.textContent = state.language === 'te' ? '📸 ఆకు ఫోటో తీయండి' : '📸 Snap Leaf Photo';

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn-secondary';
      cancelBtn.style.width = 'auto';
      cancelBtn.textContent = state.language === 'te' ? 'రద్దు చేయి' : 'Cancel';

      modal.appendChild(video);
      modal.appendChild(snapBtn);
      modal.appendChild(cancelBtn);
      document.body.appendChild(modal);

      snapBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');

        stream.getTracks().forEach(t => t.stop());
        document.body.removeChild(modal);
        processSelectedImage(dataUrl);
      };

      cancelBtn.onclick = () => {
        stream.getTracks().forEach(t => t.stop());
        document.body.removeChild(modal);
      };
    })
    .catch(() => {
      alert(state.language === 'te' ? "కెమెరా తెరవడంలో విఫలమైంది." : "Failed to open camera.");
    });
}

function useUserGpsLocation() {
  if (!navigator.geolocation) {
    alert(state.language === 'te' ? "జీపీఎస్ లభ్యం కాలేదు." : "GPS location not supported.");
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    updateLocationWeatherForecast(`GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`, { lat, lng });
  });
}

// Soil Recommendation Calculation Listener
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'calcSoilBtn') {
    const ph = parseFloat(document.getElementById('soilPhInput')?.value) || 6.8;
    const n = parseFloat(document.getElementById('soilNInput')?.value) || 140;
    const p = parseFloat(document.getElementById('soilPInput')?.value) || 45;
    const k = parseFloat(document.getElementById('soilKInput')?.value) || 180;

    const res = recommendBestCropFromSoil({ ph, nitrogen: n, phosphorus: p, potassium: k });

    const box = document.getElementById('soilResultBox');
    const cropElem = document.getElementById('soilRecommendedCrop');
    const profitElem = document.getElementById('soilExpectedProfit');
    const fertList = document.getElementById('soilFertilizerList');

    if (box) box.classList.remove('hidden');
    if (cropElem) cropElem.textContent = `Recommended Crop: ${res.recommendedCrop}`;
    if (profitElem) profitElem.textContent = `Expected Profit: ${res.expectedProfitPerAcre} / Acre`;
    if (fertList) {
      fertList.innerHTML = res.fertilizerPlan.map(item => `<li>${item}</li>`).join('');
    }
  }
});

// AI Crop Doctor Interactive UI Renderer
function renderCropDoctorUI() {
  const container = document.getElementById('doctorCardContent');
  if (!container) return;

  const currentQ = cropDoctorInstance.getCurrentQuestion(state.language);

  if (currentQ) {
    container.innerHTML = `
      <div style="font-size:0.82rem; font-weight:700; color:var(--primary-emerald); text-transform:uppercase; margin-bottom:0.5rem;">
        Question ${currentQ.step} of ${currentQ.totalSteps}
      </div>
      <h3 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:1rem;">${currentQ.title}</h3>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        ${currentQ.options.map(opt => `
          <button class="doctor-opt-btn btn-secondary" data-val="${opt.val}" style="text-align:left; font-size:0.95rem; padding:0.8rem 1rem;">
            ${opt.label}
          </button>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.doctor-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        const hasMore = cropDoctorInstance.answerCurrentQuestion(val);
        if (hasMore) {
          renderCropDoctorUI();
        } else {
          renderDoctorResultUI();
        }
      });
    });
  }
}

function renderDoctorResultUI() {
  const container = document.getElementById('doctorCardContent');
  if (!container) return;

  const diag = cropDoctorInstance.generateDiagnosis(state.language);

  container.innerHTML = `
    <div style="text-align:center; margin-bottom:1rem;">
      <div style="font-size:2.5rem; margin-bottom:0.4rem;">🩺</div>
      <div style="font-size:0.85rem; font-weight:700; color:var(--primary-emerald); text-transform:uppercase;">AI Agronomist Diagnosis</div>
      <h3 style="font-size:1.4rem; font-weight:800; color:#0f172a; margin-top:0.2rem;">${diag.diseaseName}</h3>
      <div style="font-size:0.88rem; color:#059669; font-weight:700; margin-top:0.2rem;">Confidence Precision: ${diag.confidence}%</div>
    </div>
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:1rem; margin-bottom:1rem;">
      <div style="font-size:0.9rem; font-weight:700; color:#0f172a; margin-bottom:0.3rem;">💊 Recommended Treatment:</div>
      <div style="font-size:0.88rem; color:#334155; line-height:1.5;">${diag.recommendation}</div>
    </div>
    <div style="background:#fff7ed; border:1px solid #fdba74; border-radius:12px; padding:1rem; margin-bottom:1.25rem;">
      <div style="font-size:0.9rem; font-weight:700; color:#c2410c; margin-bottom:0.3rem;">⚠️ Safety & Field Precaution:</div>
      <div style="font-size:0.88rem; color:#9a3412;">${diag.precaution}</div>
    </div>
    <button id="resetDoctorBtn" class="btn-primary">🔄 Start New Diagnostic Interview</button>
  `;

  const resetBtn = document.getElementById('resetDoctorBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      cropDoctorInstance.reset();
      renderCropDoctorUI();
    });
  }
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
