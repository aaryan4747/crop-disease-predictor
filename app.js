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

// BULLETPROOF GLOBAL DELEGATION FOR ALL NAVIGATION TABS & MOBILE TOUCHES
document.addEventListener('click', (e) => {
  const navBtn = e.target.closest('[data-section]');
  if (!navBtn) return;
  e.preventDefault();

  const sec = navBtn.getAttribute('data-section');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  navBtn.classList.add('active');

  const predictor = document.getElementById('sectionPredictor');
  const weather = document.getElementById('sectionWeather');
  const library = document.getElementById('sectionLibrary');
  const calculator = document.getElementById('sectionCalculator');

  if (predictor) predictor.classList.add('hidden');
  if (weather) weather.classList.add('hidden');
  if (library) library.classList.add('hidden');
  if (calculator) calculator.classList.add('hidden');

  if (sec === 'predictor' && predictor) {
    predictor.classList.remove('hidden');
  } else if (sec === 'weather' && weather) {
    weather.classList.remove('hidden');
    updateLocationWeatherForecast(document.getElementById('weatherLocationInput')?.value || "Guntur");
    if (leafletMap) {
      setTimeout(() => leafletMap.invalidateSize(), 300);
    }
  } else if (sec === 'library' && library) {
    library.classList.remove('hidden');
    renderLibrary();
  } else if (sec === 'calculator' && calculator) {
    calculator.classList.remove('hidden');
    calculateDosage();
    calculateMotorIrrigation();
  }

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
        <img src="${sample.svgVisual}" alt="${sample.diseaseName}" />
      </div>
      <div class="sample-name">${sample.diseaseName}</div>
      <div class="sample-crop">${sample.crop}</div>
    </div>
  `).join('');

  dom.sampleGrid.querySelectorAll('.sample-card').forEach(card => {
    card.addEventListener('click', () => {
      const sampleId = card.dataset.sampleId;
      const sample = SAMPLE_GALLERY.find(s => s.id === sampleId);
      if (sample) {
        processSelectedImage(sample.svgVisual, sampleId);
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

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    const temp = Math.round(current.temperature_2m);
    const humidity = Math.round(current.relative_humidity_2m);
    const wind = Math.round(current.wind_speed_10m);
    const wCode = current.weather_code;

    if (cityTitle) cityTitle.textContent = `📍 ${displayName}`;
    if (tempVal) tempVal.textContent = `${temp}°C`;
    if (humidityVal) humidityVal.textContent = `${humidity}%`;
    if (windVal) windVal.textContent = `${wind} km/h`;

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
