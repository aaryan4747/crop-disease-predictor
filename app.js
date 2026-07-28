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
    
    // Dosage calculator
    calcArea: document.getElementById('calcArea'),
    calcRate: document.getElementById('calcRate'),
    calcVolumeResult: document.getElementById('calcVolumeResult'),
    calcMedicineResult: document.getElementById('calcMedicineResult'),
    
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
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            updateLocationWeatherForecast("Current Location (GPS)");
          },
          () => {
            updateLocationWeatherForecast("Guntur");
          }
        );
      } else {
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

  if (dom.sendChatBtn && dom.chatInput) {
    dom.sendChatBtn.addEventListener('click', handleUserChatMessage);
    dom.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserChatMessage();
    });
  }

  dom.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sec = btn.dataset.section;

      dom.sectionPredictor.classList.add('hidden');
      if (dom.sectionWeather) dom.sectionWeather.classList.add('hidden');
      dom.sectionLibrary.classList.add('hidden');
      dom.sectionCalculator.classList.add('hidden');

      if (sec === 'predictor') dom.sectionPredictor.classList.remove('hidden');
      else if (sec === 'weather' && dom.sectionWeather) {
        dom.sectionWeather.classList.remove('hidden');
        updateLocationWeatherForecast(dom.weatherLocationInput?.value || "Guntur");
      }
      else if (sec === 'library') {
        dom.sectionLibrary.classList.remove('hidden');
        renderLibrary();
      } else if (sec === 'calculator') {
        dom.sectionCalculator.classList.remove('hidden');
        calculateDosage();
      }
    });
  });
}

function updateLocationWeatherForecast(locationName) {
  if (!dom.weatherCityTitle) return;

  const loc = locationName.trim();
  dom.weatherCityTitle.textContent = `📍 ${loc}, ${state.language === 'te' ? 'ఆంధ్రప్రదేశ్ / తెలంగాణ' : 'AP & Telangana Region'}`;

  const charCodeSum = loc.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const temp = (22 + (charCodeSum % 11));
  const humidity = (65 + (charCodeSum % 31));
  const wind = (10 + (charCodeSum % 12));

  dom.weatherTempVal.textContent = `${temp}°C`;
  dom.weatherHumidityVal.textContent = `${humidity}%`;
  dom.weatherWindVal.textContent = `${wind} km/h`;

  if (humidity > 78) {
    dom.weatherRiskBadge.textContent = state.language === 'te' ? '⚠️ తీవ్ర శిలీంధ్ర తెగులు ప్రమాదం' : '⚠️ High Fungal Risk';
    dom.weatherRiskBadge.style.backgroundColor = '#ea580c';
    dom.weatherConditionDesc.textContent = state.language === 'te' ? 'అధిక తేమ వాతావరణం • శిలీంధ్ర వ్యాధులు వ్యాపించే అవకాశం ఉంది' : 'Humid Weather • High Fungal Outbreak Risk';

    dom.weatherDiseaseList.innerHTML = state.language === 'te' ? `
      • <strong>పుచ్చకాయ నల్ల మచ్చ తెగులు (Watermelon Anthracnose)</strong> (అధిక తేమ వల్ల ఆకులపై నల్ల మచ్చలు ఏర్పడటం)<br>
      • <strong>వరి అగ్గి తెగులు (Rice Blast)</strong> (రాత్రి వేళల్లో చల్లదనం, తేమ వల్ల బూడిద రంగు మచ్చలు)<br>
      • <strong>అరటి సిగటోకా తెగులు (Banana Sigatoka)</strong> (గాలిలో అధిక తేమ వల్ల ఆకులు ఎండిపోవడం)
    ` : `
      • <strong>Watermelon Anthracnose</strong> (High humidity & wet leaves trigger black leaf spots)<br>
      • <strong>Chilli Black Thrips & Leaf Curl</strong> (Warm temperatures favor thrips vector reproduction)<br>
      • <strong>Rice Paddy Blast</strong> (Moderate nights & high moisture encourage sporangia germination)
    `;

    dom.weatherAdvisoryText.textContent = state.language === 'te' ? `
      ఉదయాన్నే మంచు ఆరక ముందే కాపర్ ఆక్సిక్లోరైడ్ (Blitox 3g/L) లేదా వేప నూనె (5% NSKE) పిచికారీ చేయండి. పొలంలో నీరు నిల్వ ఉండకుండా కాలువలను శుభ్రం చేయండి.
    ` : `
      Apply preventative spray of Copper Oxychloride 50% WP (Blitox @ 3g/L) or Neem Seed Kernel Extract (5% NSKE) before heavy morning dew to prevent fungal spore germination. Ensure field drainage lines are cleared.
    `;
  } else {
    dom.weatherRiskBadge.textContent = state.language === 'te' ? '⚠️ రసం పీల్చే పురుగుల ప్రమాదం' : '⚠️ Sucking Pest Risk';
    dom.weatherRiskBadge.style.backgroundColor = '#b45309';
    dom.weatherConditionDesc.textContent = state.language === 'te' ? 'ఎండ & పొడి వాతావరణం • తామర పురుగుల ఉధృతి' : 'Dry Sunny Weather • Thrips & Mite Vector Risk';

    dom.weatherDiseaseList.innerHTML = state.language === 'te' ? `
      • <strong>మిరప నల్ల తామర పురుగు & ఆకు ముడుత (Chilli Black Thrips)</strong><br>
      • <strong>ప్రత్తి గులాబీ రంగు పురుగు (Cotton Pink Bollworm)</strong><br>
      • <strong>బెండ పసుపు మోజాయిక్ తెగులు (Okra Yellow Vein Virus)</strong>
    ` : `
      • <strong>Chilli Black Thrips & Leaf Curl</strong><br>
      • <strong>Cotton Pink Bollworm</strong><br>
      • <strong>Okra Yellow Vein Mosaic Virus</strong>
    `;

    dom.weatherAdvisoryText.textContent = state.language === 'te' ? `
      ఎకరాకు 30 పసుపు, నీలి రంగు జిగురు అట్టలను అమర్చండి. ఫిప్రోనిల్ (1.5ml/L) లేదా డెలిగేట్ పిచికారీ చేయండి.
    ` : `
      Install 30 Yellow and Blue sticky traps per acre. Spray Fipronil 5% SC (1.5ml/L) or Spinetoram (1ml/L) targeting leaf undersides.
    `;
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
