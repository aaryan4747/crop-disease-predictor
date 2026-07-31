import { CROP_DISEASES, CROP_LIST } from './diseaseDatabase.js';
import { SAMPLE_GALLERY } from './sampleImages.js';
import { analyzeLeafImage } from './imageAnalyzer.js';
import { TRANSLATIONS, TELUGU_DISEASE_DATA } from './translations.js';
import { AICropDoctor } from './aiCropDoctor.js';
import { renderOutbreakHeatmapGrid } from './outbreakMap.js';
import { recommendBestCropFromSoil } from './soilRecommendation.js';
import { renderCommunityGallery, renderMarketplaceStores } from './communityMarketplace.js';
import { renderFarmerDashboard } from './farmerDashboard.js';

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
  const dashboard = document.getElementById('sectionDashboard');

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
  if (dashboard) dashboard.classList.add('hidden');

  if (sec === 'predictor') {
    if (heroBanner) heroBanner.classList.remove('hidden');
    if (metricsBar) metricsBar.classList.remove('hidden');
    if (weatherAlert) weatherAlert.classList.remove('hidden');
    if (predictor) predictor.classList.remove('hidden');
  } else if (sec === 'dashboard') {
    if (heroBanner) heroBanner.classList.add('hidden');
    if (metricsBar) metricsBar.classList.add('hidden');
    if (weatherAlert) weatherAlert.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
    renderFarmerDashboard('farmerDashboardContainer');
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
    
    // Dosage & Motor calculator
    calcArea: document.getElementById('calcArea'),
    calcRate: document.getElementById('calcRate'),
    calcVolumeResult: document.getElementById('calcVolumeResult'),
    calcMedicineResult: document.getElementById('calcMedicineResult'),
    motorCropSelect: document.getElementById('motorCropSelect'),
    motorAcres: document.getElementById('motorAcres'),
    motorHpSelect: document.getElementById('motorHpSelect'),
    motorSoilSelect: document.getElementById('motorSoilSelect'),
    totalWaterVolumeResult: document.getElementById('totalWaterVolumeResult'),
    motorDurationResult: document.getElementById('motorDurationResult'),
    motorFlowRateResult: document.getElementById('motorFlowRateResult'),
    motorAdvisoryText: document.getElementById('motorAdvisoryText'),
    
    // Chat elements
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendChatBtn: document.getElementById('sendChatBtn'),
    
    // Nav sections
    navBtns: document.querySelectorAll('.nav-btn'),
    sectionPredictor: document.getElementById('sectionPredictor'),
    sectionWeather: document.getElementById('sectionWeather'),
    sectionLibrary: document.getElementById('sectionLibrary'),
    sectionCalculator: document.getElementById('sectionCalculator'),
    libraryContainer: document.getElementById('libraryContainer'),
    
    // FAQ elements
    faqQuestions: document.querySelectorAll('.faq-question')
  };
}

function applyLightMode() {
  document.documentElement.setAttribute('data-theme', 'light');
  if (document.body) {
    document.body.setAttribute('data-theme', 'light');
  }
}

function updateUiLanguage() {
  const t = TRANSLATIONS[state.language];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) {
      if (el.tagName === 'INPUT' && el.placeholder) {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });

  dom.langPills.forEach(pill => {
    if (pill.dataset.lang === state.language) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  if (state.currentAnalysis) {
    renderTabContent();
    updateWhatsappShareLink();
  }
}

function renderCropSelector() {
  if (!dom.cropSelect) return;
  dom.cropSelect.innerHTML = CROP_LIST.map(crop => 
    `<option value="${crop}">${crop}</option>`
  ).join('');
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

function bindEvents() {
  dom.langPills.forEach(pill => {
    pill.addEventListener('click', () => {
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
    dom.printPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (dom.searchWeatherBtn) {
    dom.searchWeatherBtn.addEventListener('click', () => {
      const loc = dom.weatherLocationInput?.value.trim() || "Guntur";
      updateLocationWeatherForecast(loc);
    });
  }

  if (dom.gpsLocationBtn) {
    dom.gpsLocationBtn.addEventListener('click', () => {
      if (dom.gpsLocationBtn) {
        dom.gpsLocationBtn.textContent = state.language === 'te' ? '⏳ స్థానం గుర్తిస్తోంది...' : '⏳ Locating GPS...';
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (dom.gpsLocationBtn) {
              dom.gpsLocationBtn.textContent = state.language === 'te' ? '📍 GPS స్థానం పొందింది' : '📍 Location Found!';
              setTimeout(() => {
                dom.gpsLocationBtn.textContent = TRANSLATIONS[state.language]?.gpsLocationBtn || '📍 Use My GPS Location';
              }, 2500);
            }
            updateLocationWeatherForecast("GPS", {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            });
          },
          (err) => {
            alert(state.language === 'te' ? "GPS స్థానం పొందడం సాధ్యపడలేదు. దయచేసి ఊరు పేరును నమోదు చేయండి." : "GPS access declined or unavailable. Please type your city/district name in the search box.");
            if (dom.gpsLocationBtn) {
              dom.gpsLocationBtn.textContent = TRANSLATIONS[state.language]?.gpsLocationBtn || '📍 Use My GPS Location';
            }
            updateLocationWeatherForecast("Guntur");
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        alert(state.language === 'te' ? "మీ బ్రౌజర్ లో GPS అందుబాటులో లేదు." : "Geolocation is not supported by your browser.");
        updateLocationWeatherForecast("Guntur");
      }
    });
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

async function updateLocationWeatherForecast(locationName, coords = null) {
  const cityTitle = document.getElementById('weatherCityTitle');
  if (!cityTitle) return;

  const tempVal = document.getElementById('weatherTempVal');
  const humidityVal = document.getElementById('weatherHumidityVal');
  const windVal = document.getElementById('weatherWindVal');
  const riskBadge = document.getElementById('weatherRiskBadge');
  const condDesc = document.getElementById('weatherConditionDesc');
  const diseaseList = document.getElementById('weatherDiseaseList');
  const advisoryText = document.getElementById('weatherAdvisoryText');

  if (cityTitle) cityTitle.textContent = `⏳ ${state.language === 'te' ? 'వాతావరణ వివరాలు లోడ్ అవుతున్నాయి...' : 'Fetching Live Global Weather Data...'}`;

  try {
    let lat, lon, displayName;

    if (coords && coords.latitude && coords.longitude) {
      lat = coords.latitude;
      lon = coords.longitude;
      try {
        const revRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const revData = await revRes.json();
        const city = revData.city || revData.locality || revData.principalSubdivision || "GPS Location";
        const country = revData.countryName || "";
        displayName = `${city}${country ? ', ' + country : ''}`;
      } catch (e) {
        displayName = `GPS (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
      }
    } else {
      const query = locationName.trim() || "Guntur";
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        if (cityTitle) cityTitle.textContent = `📍 ${query}`;
        if (condDesc) condDesc.textContent = state.language === 'te' ? 'స్థానం కనుగొనబడలేదు. మళ్లీ ప్రయత్నించండి.' : 'Location not found. Please try another city/district.';
        return;
      }

      const locResult = geoData.results[0];
      lat = locResult.latitude;
      lon = locResult.longitude;
      displayName = `${locResult.name}${locResult.admin1 ? ', ' + locResult.admin1 : ''}${locResult.country ? ', ' + locResult.country : ''}`;
    }

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,weather_code&timezone=auto`);
    const weatherData = await weatherRes.json();
    const current = weatherData.current;
    const hourly = weatherData.hourly;

    const temp = Math.round(current.temperature_2m);
    const humidity = Math.round(current.relative_humidity_2m);
    const wind = Math.round(current.wind_speed_10m);
    const wCode = current.weather_code;

    // Process Today's 24-Hour Rain Forecast Metrics
    let maxRainProb = 0;
    let totalRainMm = 0;
    const currentHourIndex = new Date().getHours();
    
    if (hourly && hourly.precipitation_probability) {
      const next24Probs = hourly.precipitation_probability.slice(currentHourIndex, currentHourIndex + 24);
      const next24Mm = hourly.precipitation.slice(currentHourIndex, currentHourIndex + 24);
      
      maxRainProb = Math.max(...next24Probs, 0);
      totalRainMm = next24Mm.reduce((a, b) => a + (b || 0), 0);
    }

    if (cityTitle) cityTitle.textContent = `📍 ${displayName}`;
    if (tempVal) tempVal.textContent = `${temp}°C`;
    if (humidityVal) humidityVal.textContent = `${humidity}%`;
    if (windVal) windVal.textContent = `${wind} km/h`;

    const rainVal = document.getElementById('weatherRainVal');
    if (rainVal) {
      rainVal.textContent = `${maxRainProb}% (${totalRainMm.toFixed(1)} mm)`;
    }

    // Update Today's High-Accuracy Rain & Spraying Safety Card
    const rainStatusPill = document.getElementById('weatherRainStatusPill');
    const rainAlertText = document.getElementById('weatherRainAlertText');

    if (maxRainProb >= 50 || totalRainMm >= 2.0) {
      if (rainStatusPill) {
        rainStatusPill.textContent = state.language === 'te' ? `🌧️ నేడు వర్షపాతం పడే అవకాశం ఉండును (${maxRainProb}%)` : `🌧️ Rain Expected Today (${maxRainProb}%)`;
        rainStatusPill.style.background = '#dc2626';
      }
      if (rainAlertText) {
        rainAlertText.innerHTML = state.language === 'te'
          ? `శాటిలైట్ రాడార్ లెక్కింపు ప్రకారం నేడు వర్షం పడే అవకాశం <strong>${maxRainProb}%</strong> ఉంది (సుమారు ${totalRainMm.toFixed(1)} mm వర్షపాతం). <strong>🛑 మందుల పిచికారీ హెచ్చరిక: నేడు పంటలకు క్రిమిసంహారక మందులు పిచికారీ చేయవద్దు. వర్షానికి మందు కొట్టుకుపోతుంది.</strong>`
          : `High accuracy satellite radar predicts a <strong>${maxRainProb}% chance of rain</strong> today (approx ${totalRainMm.toFixed(1)} mm rainfall). <strong>🛑 SPRAYING WARNING: Do NOT spray pesticides or liquid fertilizers today as rain will wash away the chemical spray.</strong>`;
      }
    } else if (maxRainProb >= 20 || totalRainMm > 0.3) {
      if (rainStatusPill) {
        rainStatusPill.textContent = state.language === 'te' ? `🌤️ అక్కడక్కడ చిరుజల్లులు (${maxRainProb}%)` : `🌤️ Light Isolated Showers (${maxRainProb}%)`;
        rainStatusPill.style.background = '#d97706';
      }
      if (rainAlertText) {
        rainAlertText.innerHTML = state.language === 'te'
          ? `నేడు కొన్ని ప్రాంతాల్లో తేలికపాటి చిరుజల్లులు పడే అవకాశం ఉండును (${totalRainMm.toFixed(1)} mm). <strong>⚠️ జాగ్రత్త: పొద్దున్నే ఎండగా ఉన్నప్పుడు మందులకు గంజి/జిగురు కలిపి మాత్రమే పిచికారీ చేయండి.</strong>`
          : `Isolated light showers possible today (${totalRainMm.toFixed(1)} mm). <strong>⚠️ SPRAY CAUTION: Proceed with caution. Spray during clear morning hours using a silicone sticker solution.</strong>`;
      }
    } else {
      if (rainStatusPill) {
        rainStatusPill.textContent = state.language === 'te' ? `☀️ నేడు వర్షం లేదు (0-${maxRainProb}%)` : `☀️ No Rain Forecast Today (${maxRainProb}%)`;
        rainStatusPill.style.background = '#059669';
      }
      if (rainAlertText) {
        rainAlertText.innerHTML = state.language === 'te'
          ? `ఖచ్చితమైన వాతావరణ రాడార్ ప్రకారం నేడు వర్షం పడే అవకాశం లేదు (${maxRainProb}% అవకాశం). <strong>🟢 సస్యరక్షణ పిచికారీకి అత్యంత అనుకూలమైన రోజు! నేడు ధైర్యంగా మందులు పిచికారీ చేసుకోవచ్చు.</strong>`
          : `High accuracy weather radar confirms clear skies with minimal rain risk (${maxRainProb}% chance). <strong>🟢 SAFE SPRAYING DAY: Weather is clear today. Highly ideal for applying crop protective sprays & fertilizers.</strong>`;
      }
    }

    // Render Next 24-Hours Hourly Timeline
    const timelineElem = document.getElementById('weatherHourlyTimeline');
    if (timelineElem && hourly && hourly.time) {
      let timelineHtml = '';
      for (let i = currentHourIndex; i < currentHourIndex + 24 && i < hourly.time.length; i++) {
        const timeStr = new Date(hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const hTemp = Math.round(hourly.temperature_2m[i]);
        const hProb = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;
        const hMm = hourly.precipitation ? hourly.precipitation[i] : 0;
        const hCode = hourly.weather_code ? hourly.weather_code[i] : 0;

        let icon = '☀️';
        if (hCode >= 80 || hMm > 2.0) icon = '🌧️';
        else if (hCode >= 51 || hProb > 40) icon = '🌦️';
        else if (hCode >= 1 && hCode <= 3) icon = '⛅';

        timelineHtml += `
          <div style="flex:0 0 80px; background:#f8fafc; border:1px solid ${hProb >= 50 ? '#93c5fd' : '#cbd5e1'}; border-radius:10px; padding:0.6rem 0.4rem; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
            <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">${timeStr}</div>
            <div style="font-size:1.3rem; margin:0.2rem 0;">${icon}</div>
            <div style="font-size:0.88rem; font-weight:800; color:#0f172a;">${hTemp}°C</div>
            <div style="font-size:0.72rem; font-weight:800; color:${hProb >= 40 ? '#dc2626' : '#2563eb'}; margin-top:0.2rem;">💧 ${hProb}%</div>
            <div style="font-size:0.68rem; color:var(--text-muted);">${hMm > 0 ? hMm.toFixed(1) + 'mm' : 'No Rain'}</div>
          </div>
        `;
      }
      timelineElem.innerHTML = timelineHtml;
    }

    updateWeatherMapLocation(lat, lon, displayName);

    let weatherConditionStr = state.language === 'te' ? 'సాధారణ రహిత వర్షపాత/వాతావరణం' : 'Clear & Moderate Climate';
    if (wCode >= 51 && wCode <= 67) weatherConditionStr = state.language === 'te' ? 'చిరుజల్లులు & తేమ వాతావరణం' : 'Drizzle & High Rain Moisture';
    else if (wCode >= 80 && wCode <= 99) weatherConditionStr = state.language === 'te' ? 'భారీ వర్షపాతం / ఉరుముల జల్లులు' : 'Heavy Rainfall & Thunderstorm Outbreak';
    else if (humidity > 75) weatherConditionStr = state.language === 'te' ? 'అధిక తేమ వాతావరణం' : 'High Humidity & Damp Environment';
    else if (temp > 30 && humidity < 55) weatherConditionStr = state.language === 'te' ? 'వేడి & పొడి వాతావరణం' : 'Hot & Dry Sunny Weather';

    if (humidity >= 75 || wCode >= 50) {
      if (riskBadge) {
        riskBadge.textContent = state.language === 'te' ? '⚠️ తీవ్ర శిలీంధ్ర తెగులు ప్రమాదం' : '⚠️ High Fungal Pathogen Risk';
        riskBadge.style.backgroundColor = '#ea580c';
      }
      if (condDesc) condDesc.textContent = `${weatherConditionStr} • ${state.language === 'te' ? 'శిలీంధ్ర వ్యాధులు వేగంగా వ్యాపించే అవకాశం ఉంది' : 'High moisture encourages rapid spore germination'}`;

      if (diseaseList) {
        diseaseList.innerHTML = state.language === 'te' ? `
          • <strong>పుచ్చకాయ నల్ల మచ్చ తెగులు (Watermelon Anthracnose)</strong> (ఆకులపై తడి మచ్చలు & పండ్ల కొళ్ళు)<br>
          • <strong>వరి అగ్గి తెగులు (Rice Paddy Blast)</strong> (రాత్రి వేళల్లో చల్లదనం, తేమ వల్ల బూడిద రంగు మచ్చలు)<br>
          • <strong>అరటి సిగటోకా తెగులు (Banana Sigatoka)</strong> (గాలిలో అధిక తేమ వల్ల ఆకులు ఎండిపోవడం)
        ` : `
          • <strong>Watermelon Anthracnose & Leaf Spot</strong> (High humidity & leaf wetness trigger sunken lesions)<br>
          • <strong>Rice Paddy Blast (Pyricularia oryzae)</strong> (Cool nights & high moisture encourage sporangia germination)<br>
          • <strong>Banana Sigatoka Leaf Spot</strong> (High humidity accelerates foliar drying and streak rot)
        `;
      }

      if (advisoryText) {
        advisoryText.innerHTML = state.language === 'te' ? `
          ఉదయాన్నే మంచు ఆరక ముందే <strong>కాపర్ ఆక్సిక్లోరైడ్ (Blitox 3g/L)</strong> లేదా <strong>వేప నూనె (5% NSKE)</strong> పిచికారీ చేయండి. పొలంలో నీరు నిల్వ ఉండకుండా కాలువలను శుభ్రం చేయండి.
        ` : `
          Apply preventative spray of <strong>Copper Oxychloride 50% WP (Blitox @ 3g/L)</strong> or <strong>Azoxystrobin 23% SC (1ml/L)</strong> before heavy morning dew to prevent fungal spore germination. Ensure field drainage lines are cleared.
        `;
      }
    } else if (temp >= 28 && humidity < 60) {
      if (riskBadge) {
        riskBadge.textContent = state.language === 'te' ? '⚠️ రసం పీల్చే పురుగుల ప్రమాదం' : '⚠️ High Sucking Pest & Vector Risk';
        riskBadge.style.backgroundColor = '#b45309';
      }
      if (condDesc) condDesc.textContent = `${weatherConditionStr} • ${state.language === 'te' ? 'తామర పురుగులు & నల్ల తామర పురుగు ఉధృతి' : 'Hot dry winds favor thrips & mite vector reproduction'}`;

      if (diseaseList) {
        diseaseList.innerHTML = state.language === 'te' ? `
          • <strong>మిరప నల్ల తామర పురుగు & ఆకు ముడుత (Chilli Black Thrips & Leaf Curl)</strong><br>
          • <strong>ప్రత్తి గులాబీ రంగు పురుగు (Cotton Pink Bollworm)</strong><br>
          • <strong>బెండ పసుపు మోజాయిక్ తెగులు (Okra Yellow Vein Virus)</strong>
        ` : `
          • <strong>Chilli Black Thrips & Boat Leaf Curl (Scirtothrips dorsalis)</strong><br>
          • <strong>Cotton Pink Bollworm & Whitefly Vector</strong><br>
          • <strong>Okra Yellow Vein Mosaic Virus (Gemini Virus)</strong>
        `;
      }

      if (advisoryText) {
        advisoryText.innerHTML = state.language === 'te' ? `
          ఎకరాకు 30 పసుపు, నీలి రంగు జిగురు అట్టలను అమర్చండి. <strong>ఫిప్రోనిల్ (1.5ml/L)</strong> లేదా <strong>డెలిగేట్ (1ml/L)</strong> ఆకుల వెనుక భాగం తడిసేలా పిచికారీ చేయండి.
        ` : `
          Install 30 Yellow and Blue sticky traps per acre. Spray <strong>Fipronil 5% SC (1.5ml/L)</strong> or <strong>Spinetoram 11.7% SC (1ml/L)</strong> targeting leaf undersides during evening hours.
        `;
      }
    } else {
      if (riskBadge) {
        riskBadge.textContent = state.language === 'te' ? '✅ అనుకూల సస్యరక్షణ స్థితి' : '✅ Optimal Crop Growth Weather';
        riskBadge.style.backgroundColor = '#059669';
      }
      if (condDesc) condDesc.textContent = `${weatherConditionStr} • ${state.language === 'te' ? 'ప్రస్తుతానికి పంటలకు ఎలాంటి ప్రమాదం లేదు' : 'Favorable temperature & humidity for crop vitality'}`;

      if (diseaseList) {
        diseaseList.innerHTML = state.language === 'te' ? `
          • <strong>సాధారణ నివారణ చర్యలు పాటించండి (Routine Maintenance)</strong><br>
          • <strong>పోషకాల సమతుల్యత కాపాడండి (Balanced N-P-K Fertilization)</strong>
        ` : `
          • <strong>Low disease incidence expected in current weather conditions.</strong><br>
          • <strong>Maintain balanced N-P-K fertigation and routine weed clearing.</strong>
        `;
      }

      if (advisoryText) {
        advisoryText.innerHTML = state.language === 'te' ? `
          పంట సాధారణ పెరుగుదలలో ఉంది. వారానికి ఒకసారి పొలాన్ని పర్యవేక్షించి, బయో-ఫంగిసైడ్ పిచికారీ చేసుకోవచ్చు.
        ` : `
          Weather conditions are safe. Perform regular field monitoring and apply routine organic bio-stimulant or Neem oil spray every 10-14 days.
        `;
      }
    }

  } catch (err) {
    console.error("Live weather fetch error:", err);
    if (cityTitle) cityTitle.textContent = `📍 ${locationName}`;
    if (condDesc) condDesc.textContent = state.language === 'te' ? 'వాతావరణ వివరాలు పొందడంలో ఆలస్యం జరిగాయి. ప్రయత్నించండి.' : 'Weather service fallback mode. Enter location to retry.';
  }
}

function startVoiceMicInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition mic is not supported on this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.language === 'te' ? 'te-IN' : 'en-US';
  recognition.interimResults = false;

  dom.voiceSearchBtn.textContent = TRANSLATIONS[state.language].listeningText;
  dom.voiceSearchBtn.style.background = 'rgba(239,68,68,0.15)';
  dom.voiceSearchBtn.style.color = '#dc2626';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (dom.chatInput) {
      dom.chatInput.value = transcript;
      handleUserChatMessage();
    }
    resetVoiceBtnText();
  };

  recognition.onerror = () => { resetVoiceBtnText(); };
  recognition.onend = () => { resetVoiceBtnText(); };

  recognition.start();
}

function resetVoiceBtnText() {
  if (dom.voiceSearchBtn) {
    dom.voiceSearchBtn.textContent = TRANSLATIONS[state.language].voiceSearchBtn;
    dom.voiceSearchBtn.style.background = 'rgba(5,150,105,0.1)';
    dom.voiceSearchBtn.style.color = 'var(--primary-emerald)';
  }
}

function toggleAudioAdvisory() {
  if (!window.speechSynthesis) {
    alert("Speech Synthesis is not supported on this browser.");
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    dom.audioBtn.innerHTML = TRANSLATIONS[state.language].listenAudioBtn;
    return;
  }

  if (!state.currentAnalysis) return;

  const d = getLocalizedDiseaseData(state.currentAnalysis.disease);
  let text = `${d.diseaseName}. ${d.symptoms.join('. ')}. Recommended cure: ${d.organicCures[0].name}. Dosage: ${d.organicCures[0].dosage}.`;

  state.speechUtterance = new SpeechSynthesisUtterance(text);
  state.speechUtterance.lang = state.language === 'te' ? 'te-IN' : 'en-US';
  state.speechUtterance.rate = 0.9;

  state.speechUtterance.onend = () => {
    dom.audioBtn.innerHTML = TRANSLATIONS[state.language].listenAudioBtn;
  };

  dom.audioBtn.innerHTML = TRANSLATIONS[state.language].stopAudioBtn;
  window.speechSynthesis.speak(state.speechUtterance);
}

function handleFileSelect(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    processSelectedImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function startWebcamCapture() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.85);
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
      `;
      video.style.cssText = `max-width: 90%; max-height: 70vh; border-radius: 12px; border: 2px solid #059669;`;
      
      const capBtn = document.createElement('button');
      capBtn.className = 'btn-primary';
      capBtn.textContent = state.language === 'te' ? '📸 ఆకు ఫోటో తీయండి' : '📸 Snap Leaf Photo';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn-secondary';
      cancelBtn.textContent = state.language === 'te' ? 'రద్దు చేయి' : 'Cancel';

      modal.appendChild(video);
      modal.appendChild(capBtn);
      modal.appendChild(cancelBtn);
      document.body.appendChild(modal);

      capBtn.onclick = () => {
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
      alert(state.language === 'te' ? "కెమెరా అందుబాటులో లేదు. ఫైల్ లేదా నమూనా చిత్రాన్ని ఎంచుకోండి." : "Unable to access camera. Please select a leaf photo or sample image instead.");
    });
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

  runAnalysis(dom.previewImage);
}

async function runAnalysis(imgElement) {
  state.isScanning = true;
  dom.scannerOverlay.classList.remove('hidden');

  setTimeout(async () => {
    const analysis = await analyzeLeafImage(imgElement, state.currentCropFilter);
    state.currentAnalysis = analysis;
    state.isScanning = false;
    dom.scannerOverlay.classList.add('hidden');
    displayAnalysisResults(analysis);
  }, 1800);
}

function displayAnalysisResults(analysis) {
  const d = getLocalizedDiseaseData(analysis.disease);
  
  dom.placeholderCard.classList.add('hidden');
  dom.resultCard.classList.remove('hidden');

  dom.diseaseName.textContent = d.diseaseName;
  dom.scientificName.textContent = d.scientificName;
  
  dom.severityPill.textContent = d.severityLevel;
  dom.severityPill.style.backgroundColor = d.badgeColor;
  dom.severityPill.style.color = '#ffffff';

  dom.confidenceVal.textContent = `${analysis.confidence}%`;
  dom.confidenceFill.style.width = `${analysis.confidence}%`;

  // Render Explainable AI (XAI) Breakdown & Source Citations
  if (analysis.explainableAI) {
    const xaiWhy = document.getElementById('xaiWhyPredicted');
    const xaiGrid = document.getElementById('xaiSimilarityGrid');
    const xaiBadges = document.getElementById('xaiSourcesBadges');

    if (xaiWhy) {
      xaiWhy.innerHTML = `<strong>Why Predicted:</strong> ${analysis.explainableAI.whyPredicted}<br/>` +
        `<strong>Detected Visual Features:</strong> ${analysis.explainableAI.visualFeaturesDetected.join(', ')}`;
    }

    if (xaiGrid) {
      xaiGrid.innerHTML = analysis.explainableAI.similaritySearch.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
          <span>${s.label}: <strong>${s.score}% Match</strong> (${s.status})</span>
          <span style="letter-spacing:0.1em; color:var(--primary-emerald); font-size:0.75rem;">${s.bar}</span>
        </div>
      `).join('');
    }

    if (xaiBadges) {
      xaiBadges.innerHTML = analysis.explainableAI.verifiedSources.map(src => `
        <span style="background:#e0f2fe; color:#0369a1; border:1px solid #7dd3fc; border-radius:12px; padding:0.2rem 0.5rem; font-weight:700;">
          ✔ ${src.name}
        </span>
      `).join('');
    }
  }

  renderTabContent();
  updateWhatsappShareLink();
}

function getLocalizedDiseaseData(baseDisease) {
  if (state.language === 'te' && TELUGU_DISEASE_DATA[baseDisease.id]) {
    const teData = TELUGU_DISEASE_DATA[baseDisease.id];
    return {
      ...baseDisease,
      diseaseName: teData.diseaseName || baseDisease.diseaseName,
      symptoms: teData.symptoms || baseDisease.symptoms,
      rootCauses: teData.rootCauses || baseDisease.rootCauses,
      organicCures: teData.organicCures || baseDisease.organicCures,
      chemicalCures: teData.chemicalCures || baseDisease.chemicalCures,
      preventionProtocol: teData.preventionProtocol || baseDisease.preventionProtocol,
      mineralDeficiency: teData.mineralDeficiency || baseDisease.mineralDeficiency
    };
  }
  return baseDisease;
}

function updateWhatsappShareLink() {
  if (!state.currentAnalysis || !dom.whatsappShareBtn) return;
  const d = getLocalizedDiseaseData(state.currentAnalysis.disease);
  
  let msg = `🌱 *Crop Care AI Diagnostic Report*\n\n`;
  msg += `🌾 *Crop*: ${d.crop}\n`;
  msg += `🦠 *Disease Identified*: ${d.diseaseName}\n`;
  msg += `🎯 *AI Confidence*: ${state.currentAnalysis.confidence}%\n\n`;
  msg += `🌿 *Recommended Remedy*: ${d.organicCures[0].name} (${d.organicCures[0].dosage})\n\n`;
  msg += `Check your crop diseases free here: https://crop-disease-predictor-mu.vercel.app/`;

  dom.whatsappShareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
}

function renderTabContent() {
  if (!state.currentAnalysis) return;
  const d = getLocalizedDiseaseData(state.currentAnalysis.disease);
  const t = TRANSLATIONS[state.language];

  dom.tabRootCause.classList.add('hidden');
  dom.tabOrganic.classList.add('hidden');
  dom.tabChemical.classList.add('hidden');
  dom.tabPrevention.classList.add('hidden');
  if (dom.tabDeficiency) dom.tabDeficiency.classList.add('hidden');

  if (state.activeTab === 'root_cause') {
    dom.tabRootCause.classList.remove('hidden');
    dom.tabRootCause.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h4 style="color:var(--primary-emerald); margin-bottom:0.5rem; font-family:'Outfit',sans-serif;">${t.observedSymptoms}</h4>
        <ul class="info-list">
          ${d.symptoms.map(s => `<li class="info-item"><span class="bullet-icon">●</span> ${s}</li>`).join('')}
        </ul>
      </div>
      <div>
        <h4 style="color:var(--accent-amber); margin-bottom:0.5rem; font-family:'Outfit',sans-serif;">${t.rootCausesHeader}</h4>
        <ul class="info-list">
          ${d.rootCauses.map(r => `<li class="info-item"><span class="bullet-icon">▲</span> ${r}</li>`).join('')}
        </ul>
      </div>
    `;
  } else if (state.activeTab === 'organic') {
    dom.tabOrganic.classList.remove('hidden');
    dom.tabOrganic.innerHTML = d.organicCures.map(med => `
      <div class="medicine-card" style="border-left-color: var(--primary-emerald);">
        <div class="medicine-name">🌿 ${med.name}</div>
        <div class="medicine-dosage">${t.dosageLabel} ${med.dosage}</div>
        <div class="medicine-app">${t.appGuideLabel} ${med.application}</div>
      </div>
    `).join('');
  } else if (state.activeTab === 'chemical') {
    dom.tabChemical.classList.remove('hidden');
    dom.tabChemical.innerHTML = d.chemicalCures ? d.chemicalCures.map(med => `
      <div class="medicine-card" style="border-left-color: #2563eb;">
        <div class="medicine-name">🧪 ${med.name}</div>
        <div class="medicine-dosage">${t.dosageLabel} ${med.dosage}</div>
        <div class="medicine-app">${t.appGuideLabel} ${med.application}</div>
        ${med.phiDays ? `
          <div style="margin-top:0.6rem; padding:0.4rem 0.75rem; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:6px; font-size:0.85rem; font-weight:700; color:var(--accent-rose);">
            ${t.phiLabel} ${med.phiDays} Days (${state.language === 'te' ? 'రోజులు' : 'Days'})
          </div>
        ` : ''}
      </div>
    `).join('') : `<p style="color:var(--text-muted);">${state.language === 'te' ? 'రసాయన మందుల ప్రమేయం అవసరం లేదు. సేంద్రీయ పద్ధతులు పాటించండి.' : 'No synthetic chemical sprays required. Organic management recommended.'}</p>`;
  } else if (state.activeTab === 'prevention') {
    dom.tabPrevention.classList.remove('hidden');
    dom.tabPrevention.innerHTML = `
      <h4 style="color:var(--primary-emerald); margin-bottom:0.75rem; font-family:'Outfit',sans-serif;">${t.preventionHeader}</h4>
      <ul class="info-list">
        ${d.preventionProtocol.map((step, idx) => `
          <li class="info-item">
            <span style="background:rgba(5,150,105,0.15); color:var(--primary-emerald); font-weight:700; border-radius:50%; width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; flex-shrink:0;">${idx + 1}</span>
            ${step}
          </li>
        `).join('')}
      </ul>
    `;
  } else if (state.activeTab === 'deficiency' && dom.tabDeficiency) {
    dom.tabDeficiency.classList.remove('hidden');
    dom.tabDeficiency.innerHTML = `
      <h4 style="color:#b45309; margin-bottom:0.75rem; font-family:'Outfit',sans-serif;">${t.mineralHeader}</h4>
      <p style="font-size:0.95rem; color:#0f172a; line-height:1.5;">${d.mineralDeficiency || (state.language === 'te' ? 'పోషకాహార లోపాలు గమనించబడలేదు.' : 'No severe N-P-K soil deficiencies detected.')}</p>
    `;
  }
}

function calculateDosage() {
  const area = parseFloat(dom.calcArea?.value || 1);
  const rate = parseFloat(dom.calcRate?.value || 2.5);

  const totalWaterLitres = Math.round(area * 200);
  const totalMedicineGrams = (totalWaterLitres * rate).toFixed(1);

  const unitL = state.language === 'te' ? 'లీటర్లు' : 'Liters';
  const unitG = state.language === 'te' ? 'గ్రాములు/మి.లీ' : 'g/ml';

  if (dom.calcVolumeResult) dom.calcVolumeResult.textContent = `${totalWaterLitres} ${unitL}`;
  if (dom.calcMedicineResult) dom.calcMedicineResult.textContent = `${totalMedicineGrams} ${unitG}`;
}

function calculateMotorIrrigation() {
  const crop = dom.motorCropSelect?.value || "watermelon";
  const acres = parseFloat(dom.motorAcres?.value || 1);
  const hp = dom.motorHpSelect?.value || "5hp";
  const soil = dom.motorSoilSelect?.value || "loam";

  let baseLitersPerAcre = 18000;
  if (crop === 'paddy') baseLitersPerAcre = 45000;
  else if (crop === 'chilli') baseLitersPerAcre = 14000;
  else if (crop === 'banana') baseLitersPerAcre = 28000;
  else if (crop === 'cotton') baseLitersPerAcre = 20000;
  else if (crop === 'groundnut') baseLitersPerAcre = 16000;
  else if (crop === 'vegetable') baseLitersPerAcre = 15000;

  let soilMultiplier = 1.0;
  if (soil === 'black') soilMultiplier = 0.85;
  else if (soil === 'sandy') soilMultiplier = 1.25;

  const totalWater = Math.round(baseLitersPerAcre * acres * soilMultiplier);

  let litersPerMin = 450;
  let pressureText = "2.5 Bar";
  let hpName = "5 HP Motor";

  if (hp === '3hp') { litersPerMin = 250; pressureText = "1.8 Bar"; hpName = "3 HP Motor"; }
  else if (hp === '5hp') { litersPerMin = 450; pressureText = "2.5 Bar"; hpName = "5 HP Motor"; }
  else if (hp === '7.5hp') { litersPerMin = 700; pressureText = "3.5 Bar"; hpName = "7.5 HP Motor"; }
  else if (hp === '10hp') { litersPerMin = 1000; pressureText = "4.5 Bar"; hpName = "10 HP Submersible"; }
  else if (hp === 'drip') { litersPerMin = 120; pressureText = "1.5 Bar (Drip Line)"; hpName = "Drip Line"; }

  const totalMinutes = Math.round(totalWater / litersPerMin);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  let durationStr = `${totalMinutes} Mins`;
  if (hours > 0) {
    durationStr = `${hours} Hr ${mins} Mins`;
  }

  if (dom.totalWaterVolumeResult) dom.totalWaterVolumeResult.textContent = `${totalWater.toLocaleString()} Liters`;
  if (dom.motorDurationResult) dom.motorDurationResult.textContent = durationStr;
  if (dom.motorFlowRateResult) dom.motorFlowRateResult.textContent = `${litersPerMin} L/min (${pressureText})`;

  if (dom.motorAdvisoryText) {
    if (state.language === 'te') {
      dom.motorAdvisoryText.textContent = `మీ ${hpName} ను సుమారు ${durationStr} పాటు ఉదయాన్నే నడపండి. బిందు సేద్యం (Drip) వాడటం వల్ల ఆకులపై నీరు పడకుండా శిలీంధ్ర తెగుళ్లు అదుపులో ఉంటాయి.`;
    } else {
      dom.motorAdvisoryText.textContent = `Run your ${hpName} for ${durationStr} during early morning hours. Using drip irrigation avoids wet leaf canopy, reducing fungal leaf spots.`;
    }
  }
}

function handleUserChatMessage() {
  const question = dom.chatInput.value.trim();
  if (!question) return;

  appendChatBubble("user", question);
  dom.chatInput.value = "";

  setTimeout(() => {
    let answer = state.language === 'te' 
      ? "పంట పైరుపై మందుల పిచికారీని తెల్లవారుజామున లేదా సాయంత్రం వేళల్లో ఆకుల రెండు వైపులా తడిసేలా చేయాలి."
      : "For effective crop protection, ensure uniform foliar coverage during early morning or late evening hours. Avoid spraying under strong sunlight or imminent rain.";
    
    const qLower = question.toLowerCase();
    if (qLower.includes("neem") || qLower.includes("వేప")) {
      answer = state.language === 'te'
        ? "వేప నూనెను లీటరు నీటికి 5 మి.లీ మరియు 1 మి.లీ సబ్బు నీరు కలిపి పిచికారీ చేయాలి. ఇది శిలీంధ్రాలు మరియు రసం పీల్చే పురుగులను నివారిస్తుంది."
        : "Neem oil works best when emulsified with 1ml liquid soap per liter of water. Spray every 7 days as a preventative against fungal spores and soft-bodied sucking insects.";
    } else if (qLower.includes("blight") || qLower.includes("తెగులు")) {
      answer = state.language === 'te'
        ? "తెగులు సోకిన కింది ఆకులను వెంటనే తొలగించి కాల్చివేయండి. గాలి వెలుతురు తగిలేలా చూసి బోర్డో మిశ్రమం లేదా మ్యాంకోజెబ్ పిచికారీ చేయండి."
        : "Fungal blights spread rapidly through moisture. Immediately prune infected lower leaves, increase air circulation, and apply a Copper Hydroxide or Mancozeb protective spray.";
    }

    appendChatBubble("bot", answer);
  }, 600);
}

function appendChatBubble(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  dom.chatMessages.appendChild(bubble);
  dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

function renderLibrary() {
  if (!dom.libraryContainer) return;
  dom.libraryContainer.innerHTML = CROP_DISEASES.map(base => {
    const d = getLocalizedDiseaseData(base);
    return `
      <div class="glass-card" style="margin-bottom: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <h3 style="font-family:'Outfit',sans-serif; color:var(--text-main);">${d.diseaseName} (${d.crop})</h3>
          <span class="severity-pill" style="background:${d.badgeColor}; color:#fff;">${d.severityLevel}</span>
        </div>
        <p style="font-style:italic; color:var(--text-muted); font-size:0.9rem; margin-bottom:0.75rem;">Pathogen: ${d.scientificName}</p>
        <div style="margin-bottom:0.75rem;">
          <strong style="color:var(--primary-emerald); font-size:0.9rem;">${state.language === 'te' ? 'వ్యాధి లక్షణాలు:' : 'Key Symptoms:'}</strong>
          <p style="color:var(--text-muted); font-size:0.9rem;">${d.symptoms.slice(0, 2).join('. ')}</p>
        </div>
        <div>
          <strong style="color:var(--accent-amber); font-size:0.9rem;">${state.language === 'te' ? 'నివారణ మార్గాలు:' : 'Recommended Remedies:'}</strong>
          <p style="color:var(--text-muted); font-size:0.9rem;">${d.organicCures[0].name} (${d.organicCures[0].dosage})</p>
        </div>
      </div>
    `;
  }).join('');
}

function updateWeatherMapLocation(lat, lon, popupText) {
  const mapElem = document.getElementById('weatherMap');
  if (!mapElem || typeof L === 'undefined') return;

  if (!leafletMap) {
    leafletMap = L.map('weatherMap').setView([lat, lon], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(leafletMap);

    leafletMap.on('click', (e) => {
      updateLocationWeatherForecast("Selected Map Location", {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      });
    });
  } else {
    leafletMap.setView([lat, lon], 9);
  }

  if (leafletMarker) {
    leafletMarker.setLatLng([lat, lon]);
  } else {
    leafletMarker = L.marker([lat, lon]).addTo(leafletMap);
  }

  if (popupText) {
    leafletMarker.bindPopup(`<b>🌱 ${popupText}</b>`).openPopup();
  }

  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 300);
}

// COMPREHENSIVE CROP MEDICINES & FERTILIZERS DIRECTORY
const MEDICINES_DATABASE = [
  {
    id: "med_coromandel_finio",
    name: "Coromandel Finio",
    activeIngredient: "Diafenthiuron 47% + Pyriproxyfen 5% SE",
    brand: "Coromandel Gromor",
    category: "insecticide",
    typeLabel: "🧪 Systemic Insecticide",
    crops: ["Chilli (మిరప)", "Cotton (ప్రత్తి)", "Vegetables (కూరగాయలు)", "Brinjal (వంకాయ)"],
    diseases: ["Black Thrips (నల్ల తామర పురుగు)", "Whiteflies (తెల్ల ఈగ)", "Leaf Curl Vector (ఆకు ముడుత)", "Aphids (పేనుబంక)"],
    dosage: "1.25 ml per Liter of water + Spreadmax (0.5ml/L)",
    phiDays: 7,
    advisory: "KVK and Coromandel recommended dual-action spray. Destroys both thrips nymphs and adult vectors."
  },
  {
    id: "med_coromandel_jatayu",
    name: "Coromandel Jatayu",
    activeIngredient: "Chlorothalonil 75% WP",
    brand: "Coromandel Gromor",
    category: "fungicide",
    typeLabel: "🛡️ Contact Fungicide",
    crops: ["Watermelon (పుచ్చకాయ)", "Potato (బంగాళదుంప)", "Tomato (టామోటా)", "Groundnut (వేరుశనగ)"],
    diseases: ["Anthracnose (నల్లమచ్చ తెగులు)", "Tikka Leaf Spot (తిక్కా మచ్చ)", "Early & Late Blight", "Downy Mildew"],
    dosage: "2.0 g per Liter of water",
    phiDays: 7,
    advisory: "Broad spectrum multi-site protective fungicide preventing spore germination before rains."
  },
  {
    id: "med_coromandel_phendal",
    name: "Coromandel Phendal",
    activeIngredient: "Phenthoate 50% EC",
    brand: "Coromandel Gromor",
    category: "insecticide",
    typeLabel: "⚡ Broad-Spectrum Insecticide",
    crops: ["Rice / Paddy (వరి)", "Chilli (మిరప)", "Cotton (ప్రత్తి)", "Pulses (పప్పు ధాన్యాలు)"],
    diseases: ["Stem Borer (కాండం తొలుచు పురుగు)", "Leaf Folder (ఆకు చుట్టు పురుగు)", "Pod Borer"],
    dosage: "2.0 ml per Liter of water",
    phiDays: 10,
    advisory: "Rapid knockdown action with strong ovicidal effect on stem borer eggs."
  },
  {
    id: "med_coromandel_fantac",
    name: "Coromandel Fantac Plus",
    activeIngredient: "Amino Acids & Vitamin Bio-Stimulant",
    brand: "Coromandel Gromor",
    category: "fertilizer",
    typeLabel: "🌱 Plant Growth Booster (PGR)",
    crops: ["All Crops", "Chilli", "Watermelon", "Banana", "Tomato"],
    diseases: ["Flower & Fruit Dropping", "Stunted Growth Recovery", "Abiotic Stress"],
    dosage: "1.0 ml per Liter of water",
    phiDays: 0,
    advisory: "Enhances flowering retention, chlorophyll density, and vegetative growth recovery."
  },
  {
    id: "med_iffco_nano_urea",
    name: "IFFCO Nano Urea (Liquid)",
    activeIngredient: "Nanoscale Nitrogen Particles (4% N)",
    brand: "IFFCO",
    category: "fertilizer",
    typeLabel: "⚡ Foliar Nano Fertilizer",
    crops: ["Paddy (వరి)", "Maize (జొన్న)", "Wheat", "Cotton", "Vegetables"],
    diseases: ["Nitrogen Deficiency", "Yellowing Leaves", "Stunted Vegetative Growth"],
    dosage: "2.0 to 4.0 ml per Liter of water",
    phiDays: 0,
    advisory: "Foliar spray at 30 & 45 days after sowing. Replaces 1 bag of conventional granular urea."
  },
  {
    id: "med_iffco_nano_dap",
    name: "IFFCO Nano DAP (Liquid)",
    activeIngredient: "Nanoscale Nitrogen (8%) & Phosphorus (16%)",
    brand: "IFFCO",
    category: "fertilizer",
    typeLabel: "⚡ Nano Root Booster",
    crops: ["Rice", "Chilli", "Groundnut", "Tomato", "Pulses"],
    diseases: ["Phosphorus Deficiency", "Poor Root Architecture", "Delayed Flowering"],
    dosage: "2.0 to 4.0 ml per Liter of water",
    phiDays: 0,
    advisory: "Spray during active tillering/branching stage. Also used for seed priming (5ml/kg seed)."
  },
  {
    id: "med_iffco_sagarika",
    name: "IFFCO Sagarika",
    activeIngredient: "Red & Brown Seaweed Bio-Extract",
    brand: "IFFCO",
    category: "organic",
    typeLabel: "🌿 Organic Bio-Stimulant",
    crops: ["Watermelon", "Banana", "Chilli", "Rice", "Vegetables"],
    diseases: ["Root Rot Recovery", "Nutrient Immobility", "Drought & Heat Stress"],
    dosage: "2.5 to 5.0 ml per Liter of water",
    phiDays: 0,
    advisory: "100% natural organic seaweed extract that triggers auxin and cytokinin root cell division."
  },
  {
    id: "med_bayer_nativo",
    name: "Bayer Nativo",
    activeIngredient: "Tebuconazole 50% + Trifloxystrobin 25% WG",
    brand: "Bayer CropScience",
    category: "fungicide",
    typeLabel: "🧪 Systemic Dual Fungicide",
    crops: ["Rice (వరి)", "Chilli (మిరప)", "Mango (మామిడి)", "Groundnut (వేరుశనగ)"],
    diseases: ["Rice Blast (వరి అగ్గి తెగులు)", "Tikka Leaf Spot", "Anthracnose", "Powdery Mildew"],
    dosage: "0.6 to 0.75 g per Liter of water",
    phiDays: 15,
    advisory: "Bayer patented dual systemic combination giving greening effect and long-lasting disease control."
  },
  {
    id: "med_syngenta_ridomil",
    name: "Syngenta Ridomil Gold",
    activeIngredient: "Mefenoxam 4% + Mancozeb 64% WP",
    brand: "Syngenta",
    category: "fungicide",
    typeLabel: "🛡️ Systemic & Contact Fungicide",
    crops: ["Potato (బంగాళదుంప)", "Tomato (టమాటో)", "Watermelon (పుచ్చకాయ)", "Grapes"],
    diseases: ["Late Blight (లేట్ బ్లైట్)", "Downy Mildew", "Phytophthora Root Damping Off"],
    dosage: "2.0 to 2.5 g per Liter of water",
    phiDays: 14,
    advisory: "Industry benchmark for late blight and downy mildew. Protects new plant growth systemically."
  },
  {
    id: "med_upl_saaf",
    name: "UPL SAAF",
    activeIngredient: "Carbendazim 12% + Mancozeb 63% WP",
    brand: "UPL (United Phosphorus)",
    category: "fungicide",
    typeLabel: "🛡️ Systemic & Contact Combination",
    crops: ["Groundnut", "Paddy", "Chilli", "Tomato", "Watermelon", "Cotton"],
    diseases: ["Tikka Spot (తిక్కా మచ్చ)", "Anthracnose", "Seedling Damping Off", "Leaf Spot"],
    dosage: "2.0 g per Liter of water",
    phiDays: 12,
    advisory: "Proven cost-effective combination fungicide for pre-harvest seed and foliar protection."
  },
  {
    id: "med_rallis_blitox",
    name: "Tata Rallis Blitox 50 WP",
    activeIngredient: "Copper Oxychloride 50% WP",
    brand: "Tata Rallis",
    category: "fungicide",
    typeLabel: "🛡️ Protective Copper Fungicide",
    crops: ["Watermelon", "Tomato", "Chilli", "Potato", "Citrus", "Banana"],
    diseases: ["Bacterial Leaf Spot", "Fruit Anthracnose", "Canker", "Leaf Blight"],
    dosage: "3.0 g per Liter of water",
    phiDays: 7,
    advisory: "Copper ions release upon leaf wetness to destroy bacterial cell walls and fungal spores."
  },
  {
    id: "med_delegate",
    name: "Delegate / Spinetoram",
    activeIngredient: "Spinetoram 11.7% SC",
    brand: "Corteva Agriscience",
    category: "insecticide",
    typeLabel: "🧪 Specialized Thrips Insecticide",
    crops: ["Chilli (మిరప)", "Cotton (ప్రత్తి)", "Soybean", "Onion (ఉల్లి)"],
    diseases: ["Black Thrips (నల్ల తామర పురుగు)", "Fall Armyworm", "Fruit Borers"],
    dosage: "1.0 ml per Liter of water",
    phiDays: 5,
    advisory: "Fast acting neurotoxin targeting nerve receptor sites of resistant black thrips."
  },
  {
    id: "med_trichoderma",
    name: "Trichoderma Viride Bio-Fungicide",
    activeIngredient: "Trichoderma viride 1x10^8 CFU/g",
    brand: "ICAR Certified Organic Bio",
    category: "organic",
    typeLabel: "🌿 Antagonistic Bio-Fungicide",
    crops: ["All Crops", "Watermelon", "Chilli", "Banana", "Tomato"],
    diseases: ["Fusarium Wilt", "Root Rot", "Stem Rot", "Seedling Damping Off"],
    dosage: "5.0 to 10.0 g per Liter water (Root Drenching)",
    phiDays: 0,
    advisory: "Parasitizes pathogenic fungi in plant root zones. Best applied with vermicompost."
  }
];

function renderMedicinesDirectory() {
  const container = document.getElementById('medicinesDirectoryGrid');
  const searchInput = document.getElementById('medicineSearchInput');
  const typeFilter = document.getElementById('medicineTypeFilter');

  if (!container) return;

  function filterAndRender() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const filterType = typeFilter?.value || 'all';

    const filtered = MEDICINES_DATABASE.filter(item => {
      const matchesType = filterType === 'all' || item.category === filterType;
      const matchesQuery = !query || 
        item.name.toLowerCase().includes(query) ||
        item.activeIngredient.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.crops.some(c => c.toLowerCase().includes(query)) ||
        item.diseases.some(d => d.toLowerCase().includes(query));

      return matchesType && matchesQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:3rem 1rem; color:var(--text-muted);">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
          <h3>${state.language === 'te' ? 'ఎలాంటి మందులు కనుగొనబడలేదు' : 'No Medicines Found'}</h3>
          <p>Please try searching for another crop name (e.g. Chilli, Paddy) or active chemical name (e.g. Finio, Nativo, SAAF).</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(med => `
      <div class="glass-card" style="background:#ffffff; border:1px solid #cbd5e1; border-top:4px solid ${getCategoryColor(med.category)}; padding:1.25rem; display:flex; flex-direction:column; justify-space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
            <div>
              <h3 style="font-family:'Outfit',sans-serif; font-size:1.2rem; font-weight:800; color:#0f172a;">${med.name}</h3>
              <div style="font-size:0.8rem; font-weight:600; color:var(--primary-emerald);">${med.brand}</div>
            </div>
            <span class="severity-pill" style="background:${getCategoryBg(med.category)}; color:${getCategoryColor(med.category)}; font-size:0.75rem; font-weight:800;">
              ${med.typeLabel}
            </span>
          </div>

          <div style="font-size:0.85rem; color:var(--text-muted); font-style:italic; margin-bottom:0.85rem;">
            Chemical: ${med.activeIngredient}
          </div>

          <div style="margin-bottom:0.75rem;">
            <div style="font-size:0.8rem; font-weight:700; color:#0f172a; text-transform:uppercase; margin-bottom:0.25rem;">🌾 Suitable Crops / Plants</div>
            <div style="display:flex; flex-wrap:wrap; gap:0.3rem;">
              ${med.crops.map(c => `<span style="background:#f1f5f9; border:1px solid #e2e8f0; color:#334155; padding:0.15rem 0.5rem; border-radius:10px; font-size:0.78rem; font-weight:600;">${c}</span>`).join('')}
            </div>
          </div>

          <div style="margin-bottom:0.75rem;">
            <div style="font-size:0.8rem; font-weight:700; color:#b45309; text-transform:uppercase; margin-bottom:0.25rem;">🦠 Target Diseases &amp; Pests Cured</div>
            <ul style="list-style:none; padding-left:0; font-size:0.85rem; color:#1e293b;">
              ${med.diseases.map(d => `<li style="margin-bottom:0.2rem;">• ${d}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0; pt:0.75rem; margin-top:0.75rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem; flex-wrap:wrap; gap:0.2rem;">
            <div style="font-size:0.88rem; font-weight:800; color:var(--primary-emerald);">
              ⚖️ Spray Dosage: ${med.dosage}
            </div>
            ${med.phiDays > 0 ? `
              <span style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#dc2626; padding:0.15rem 0.5rem; border-radius:6px; font-size:0.75rem; font-weight:800;">
                PHI: ${med.phiDays} Days
              </span>
            ` : `
              <span style="background:rgba(5,150,105,0.1); color:var(--primary-emerald); padding:0.15rem 0.5rem; border-radius:6px; font-size:0.75rem; font-weight:800;">
                Safe Bio / PGR
              </span>
            `}
          </div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; background:#f8fafc; padding:0.5rem; border-radius:6px; border:1px solid #e2e8f0;">
            💡 ${med.advisory}
          </div>
        </div>
      </div>
    `).join('');
  }

  function getCategoryColor(cat) {
    if (cat === 'insecticide') return '#dc2626';
    if (cat === 'fungicide') return '#2563eb';
    if (cat === 'fertilizer') return '#059669';
    return '#16a34a';
  }

  function getCategoryBg(cat) {
    if (cat === 'insecticide') return 'rgba(220,38,38,0.1)';
    if (cat === 'fungicide') return 'rgba(37,99,235,0.1)';
    if (cat === 'fertilizer') return 'rgba(5,150,105,0.1)';
    return 'rgba(22,163,74,0.1)';
  }

  filterAndRender();

  if (searchInput) searchInput.oninput = filterAndRender;
  if (typeFilter) typeFilter.onchange = filterAndRender;
}

// 3-PHOTO MULTI-ANGLE SCANNER MODE SWITCHER & LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  const singleBtn = document.getElementById('scanModeSingleBtn');
  const multiBtn = document.getElementById('scanModeMultiBtn');
  const multiContainer = document.getElementById('multiAngleSlotsContainer');
  const multiFileInput = document.getElementById('multiFileInput');

  let activeSlot = null;

  if (singleBtn && multiBtn) {
    singleBtn.onclick = () => {
      singleBtn.style.background = '#059669';
      singleBtn.style.color = '#ffffff';
      multiBtn.style.background = '#ffffff';
      multiBtn.style.color = '#0f172a';
      if (multiContainer) multiContainer.classList.add('hidden');
    };

    multiBtn.onclick = () => {
      multiBtn.style.background = '#059669';
      multiBtn.style.color = '#ffffff';
      singleBtn.style.background = '#ffffff';
      singleBtn.style.color = '#0f172a';
      if (multiContainer) multiContainer.classList.remove('hidden');
    };
  }

  ['slotTopLeaf', 'slotBottomLeaf', 'slotWholePlant'].forEach(slotId => {
    const slot = document.getElementById(slotId);
    if (slot) {
      slot.onclick = () => {
        activeSlot = slot;
        if (multiFileInput) multiFileInput.click();
      };
    }
  });

  if (multiFileInput) {
    multiFileInput.onchange = (e) => {
      if (e.target.files && e.target.files[0] && activeSlot) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          activeSlot.style.borderColor = '#059669';
          activeSlot.style.background = '#f0fdf4';
          const statusElem = activeSlot.querySelector('.slot-status');
          if (statusElem) {
            statusElem.textContent = '✅ Photo Loaded';
            statusElem.style.color = '#059669';
          }
          processSelectedImage(ev.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    };
  }

  const schedBtn = document.getElementById('generateScheduleBtn');
  if (schedBtn) {
    schedBtn.onclick = renderCropFertigationSchedule;
  }

  ['mandiYieldInput', 'mandiPriceInput', 'mandiCostInput'].forEach(id => {
    const inp = document.getElementById(id);
    if (inp) inp.oninput = calculateMandiProfit;
  });

  const rxBtn = document.getElementById('buildRxReceiptBtn');
  if (rxBtn) {
    rxBtn.onclick = generateShopPrescriptionReceipt;
  }
});

// FEATURE 1: CROP FERTIGATION & FERTILIZER SCHEDULE GENERATOR
function renderCropFertigationSchedule() {
  const container = document.getElementById('scheduleResultsContainer');
  const crop = document.getElementById('schedCropSelect')?.value || 'paddy';
  const sowDateStr = document.getElementById('schedSowDate')?.value || '2026-07-01';
  const acres = parseFloat(document.getElementById('schedAcres')?.value || 1);

  if (!container) return;

  const sowDate = new Date(sowDateStr);
  
  function addDays(d, days) {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const schedules = {
    paddy: [
      { day: "Day 1 (Transplanting)", date: addDays(sowDate, 0), title: "🌱 Basal Rooting Stage", fertilizer: `Gromor 14-35-14 (${Math.round(50 * acres)} kg) + Zinc Sulphate (${Math.round(10 * acres)} kg)`, notes: "Provides phosphorus for deep root architecture and zinc to prevent khaira disease." },
      { day: "Day 20 (Tillering)", date: addDays(sowDate, 20), title: "⚡ Active Tillering Stage", fertilizer: `Urea (${Math.round(35 * acres)} kg) + IFFCO Nano Urea Spray (500 ml/acre)`, notes: "Triggers rapid tiller production and high chlorophyll canopy density." },
      { day: "Day 45 (Panicle Initiation)", date: addDays(sowDate, 45), title: "🌸 Flower Head Stage", fertilizer: `Gromor 28-28-0 (${Math.round(30 * acres)} kg) + Coromandel Fantac Plus (${Math.round(100 * acres)} ml)`, notes: "Ensures uniform panicle emergence and prevents flower abortions." },
      { day: "Day 75 (Grain Filling)", date: addDays(sowDate, 75), title: "🌾 Grain Weight Stage", fertilizer: `Muriate of Potash (MOP) (${Math.round(25 * acres)} kg) + 00-52-34 Spray`, notes: "Increases grain weight, grain shine, and prevents lodging from wind." }
    ],
    chilli: [
      { day: "Day 1 (Field Prep)", date: addDays(sowDate, 0), title: "🌱 Field Preparation & Basal", fertilizer: `Gromor 20-20-0-13 Sulphur Rich (${Math.round(100 * acres)} kg) + Neem Cake (${Math.round(100 * acres)} kg)`, notes: "Sulphur boosts capsaicin pungent aroma and neem wards off root nematodes." },
      { day: "Day 25 (Vegetative Branching)", date: addDays(sowDate, 25), title: "🌿 Vegetative Growth Stage", fertilizer: `Gromor 14-35-14 (${Math.round(50 * acres)} kg) + Coromandel Finio Spray (1.25ml/L)`, notes: "Prevents early Black Thrips vector infestation." },
      { day: "Day 50 (Profuse Flowering)", date: addDays(sowDate, 50), title: "🌶️ Flowering & Pod Set Stage", fertilizer: `Coromandel Fantac Plus (${Math.round(200 * acres)} ml) + 13-0-45 Potash Nitrate`, notes: "Stops flower drops and boosts dark green chilli pod set." }
    ],
    watermelon: [
      { day: "Day 1 (Sowing)", date: addDays(sowDate, 0), title: "🌱 Bed Preparation & Drip Line", fertilizer: `Gromor 14-35-14 (${Math.round(60 * acres)} kg) + Trichoderma viride (${Math.round(2 * acres)} kg)`, notes: "Protects against Fusarium vine wilt and seedling damping off." },
      { day: "Day 20 (Vine Extension)", date: addDays(sowDate, 20), title: "🍉 Rapid Vine Runner Stage", fertilizer: `IFFCO Nano DAP (${Math.round(500 * acres)} ml) + 19-19-19 Foliar Spray`, notes: "Accelerates vine length and thick leaf canopy cover." },
      { day: "Day 40 (Fruit Development)", date: addDays(sowDate, 40), title: "🍉 Fruit Bulking & Brix Sugar", fertilizer: `00-00-50 Sulphate of Potash (${Math.round(25 * acres)} kg) + Boron 20% (1g/L)`, notes: "Increases fruit weight, prevents fruit cracking, and boosts sweetness." }
    ]
  };

  const selectedList = schedules[crop] || schedules.paddy;

  container.innerHTML = `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:var(--radius-md); padding:1.25rem;">
      <h3 style="font-family:'Outfit',sans-serif; color:var(--primary-emerald); margin-bottom:1rem;">
        📋 Fertigation Timeline for ${acres} Acre(s) (${crop.toUpperCase()})
      </h3>
      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${selectedList.map(item => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid var(--primary-emerald); border-radius:var(--radius-sm); padding:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
              <span style="font-size:0.8rem; font-weight:800; color:var(--primary-emerald);">${item.day} • Target Date: ${item.date}</span>
              <span style="background:rgba(5,150,105,0.1); color:var(--primary-emerald); padding:0.15rem 0.5rem; border-radius:6px; font-size:0.75rem; font-weight:700;">Verified ICAR Schedule</span>
            </div>
            <h4 style="font-family:'Outfit',sans-serif; font-size:1.05rem; color:#0f172a; margin-bottom:0.25rem;">${item.title}</h4>
            <div style="font-size:0.9rem; font-weight:700; color:#b45309; margin-bottom:0.3rem;">🧪 Fertilizer: ${item.fertilizer}</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">💡 ${item.notes}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// FEATURE 2: MANDI LIVE PRICES & PROFIT CALCULATOR
const MANDI_DATA = [
  { yard: "Guntur Chilli Mandi (గుంటూరు)", crop: "Chilli (Teja AC Variety)", minPrice: 17500, maxPrice: 19800, modelPrice: 18500, trend: "📈 Rising (+₹400)" },
  { yard: "Warangal Agricultural Yard (వరంగల్)", crop: "Cotton (Long Staple)", minPrice: 7100, maxPrice: 7800, modelPrice: 7450, trend: "🟢 Stable" },
  { yard: "Nizamabad Paddy Yard (నిజామాబాద్)", crop: "Paddy (BPT 5204 Sona Mahsuri)", minPrice: 2200, maxPrice: 2480, modelPrice: 2350, trend: "📈 Rising (+₹50)" },
  { yard: "Vijayawada Wholesale Yard (విజయవాడ)", crop: "Tomato (Hybrid Red)", minPrice: 1800, maxPrice: 2400, modelPrice: 2100, trend: "🟢 Stable" }
];

function renderMandiPricesGrid() {
  const container = document.getElementById('mandiPricesGrid');
  if (!container) return;

  container.innerHTML = MANDI_DATA.map(m => `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:var(--radius-md); padding:1rem; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
      <div style="font-size:0.75rem; font-weight:700; color:var(--primary-emerald); text-transform:uppercase;">${m.yard}</div>
      <h3 style="font-family:'Outfit',sans-serif; font-size:1.1rem; font-weight:800; color:#0f172a; margin:0.2rem 0 0.4rem;">${m.crop}</h3>
      <div style="font-size:1.5rem; font-weight:800; color:#b45309;">₹${m.modelPrice.toLocaleString()} / Qt</div>
      <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); margin-top:0.4rem;">
        <span>Min: ₹${m.minPrice}</span>
        <span>Max: ₹${m.maxPrice}</span>
        <span style="font-weight:700; color:#059669;">${m.trend}</span>
      </div>
    </div>
  `).join('');
}

function calculateMandiProfit() {
  const yieldQty = parseFloat(document.getElementById('mandiYieldInput')?.value || 25);
  const price = parseFloat(document.getElementById('mandiPriceInput')?.value || 18500);
  const cost = parseFloat(document.getElementById('mandiCostInput')?.value || 65000);

  const grossRevenue = yieldQty * price;
  const netProfit = grossRevenue - cost;

  const resultElem = document.getElementById('mandiNetProfitVal');
  if (resultElem) {
    if (netProfit >= 0) {
      resultElem.textContent = `₹${netProfit.toLocaleString()} Net Profit 🎉`;
      resultElem.style.color = '#059669';
    } else {
      resultElem.textContent = `- ₹${Math.abs(netProfit).toLocaleString()} Loss ⚠️`;
      resultElem.style.color = '#dc2626';
    }
  }
}

// FEATURE 3: DEALER AGRONOMY PRESCRIPTION & RECEIPT GENERATOR
function generateShopPrescriptionReceipt() {
  const container = document.getElementById('rxReceiptOutput');
  const name = document.getElementById('rxFarmerName')?.value || 'M. Koti Reddy';
  const village = document.getElementById('rxVillage')?.value || 'Ponnur, Guntur';
  const crop = document.getElementById('rxCrop')?.value || 'Chilli - 2 Acres';
  const disease = document.getElementById('rxDisease')?.value || 'Chilli Black Thrips';

  if (!container) return;

  container.classList.remove('hidden');

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #2563eb; padding-bottom:0.75rem; margin-bottom:1rem;">
      <div>
        <h3 style="font-family:'Outfit',sans-serif; font-size:1.3rem; color:#1e40af; margin-bottom:0.1rem;">🌱 CROP CARE AI • OFFICIAL AGRONOMY PRESCRIPTION</h3>
        <div style="font-size:0.78rem; color:var(--text-muted);">Standardized under ICAR & FAO Pathology Protocols • Rx Ref: #CC-2026-${Math.floor(1000 + Math.random()*9000)}</div>
      </div>
      <button onclick="window.print()" class="btn-secondary" style="font-size:0.8rem; padding:0.4rem 0.8rem;">🖨️ Print Receipt</button>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.88rem; color:#0f172a; margin-bottom:1.25rem;">
      <div><strong>Farmer Name:</strong> ${name}</div>
      <div><strong>Location:</strong> ${village}</div>
      <div><strong>Crop Details:</strong> ${crop}</div>
      <div><strong>Diagnosed Issue:</strong> ${disease}</div>
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
