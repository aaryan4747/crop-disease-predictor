import { CROP_DISEASES, CROP_LIST } from './diseaseDatabase.js';
import { SAMPLE_GALLERY } from './sampleImages.js';
import { analyzeLeafImage } from './imageAnalyzer.js';

// Application State
const state = {
  currentCropFilter: "All Crops",
  selectedImage: null,
  isScanning: false,
  activeTab: "root_cause",
  currentAnalysis: null,
  chatHistory: [
    { sender: "bot", text: "Hello! I'm your AI Agronomist. Ask me any question about plant leaf symptoms, fungicide spray schedules, or soil nutrition!" }
  ],
  history: JSON.parse(localStorage.getItem('crop_scan_history') || '[]')
};

// DOM References
let dom = {};

document.addEventListener('DOMContentLoaded', () => {
  initDomReferences();
  renderCropSelector();
  renderSampleGallery();
  bindEvents();
});

function initDomReferences() {
  dom = {
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
    
    // Tabs & Contents
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabRootCause: document.getElementById('tabRootCause'),
    tabOrganic: document.getElementById('tabOrganic'),
    tabChemical: document.getElementById('tabChemical'),
    tabPrevention: document.getElementById('tabPrevention'),
    
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
    sectionLibrary: document.getElementById('sectionLibrary'),
    sectionCalculator: document.getElementById('sectionCalculator'),
    libraryContainer: document.getElementById('libraryContainer')
  };
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
  // Dropzone drag & drop
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

  // Camera capture
  if (dom.cameraBtn) {
    dom.cameraBtn.addEventListener('click', startWebcamCapture);
  }

  // Crop Selector
  if (dom.cropSelect) {
    dom.cropSelect.addEventListener('change', (e) => {
      state.currentCropFilter = e.target.value;
      if (state.selectedImage) {
        runAnalysis(state.selectedImage);
      }
    });
  }

  // Tab switching
  dom.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTab = btn.dataset.tab;
      renderTabContent();
    });
  });

  // Dosage calculator inputs
  if (dom.calcArea && dom.calcRate) {
    dom.calcArea.addEventListener('input', calculateDosage);
    dom.calcRate.addEventListener('input', calculateDosage);
  }

  // Chat input
  if (dom.sendChatBtn && dom.chatInput) {
    dom.sendChatBtn.addEventListener('click', handleUserChatMessage);
    dom.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserChatMessage();
    });
  }

  // Navigation tabs
  dom.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sec = btn.dataset.section;

      dom.sectionPredictor.classList.add('hidden');
      dom.sectionLibrary.classList.add('hidden');
      dom.sectionCalculator.classList.add('hidden');

      if (sec === 'predictor') dom.sectionPredictor.classList.remove('hidden');
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
      video.style.cssText = `max-width: 90%; max-height: 70vh; border-radius: 12px; border: 2px solid #10b981;`;
      
      const capBtn = document.createElement('button');
      capBtn.className = 'btn-primary';
      capBtn.textContent = '📸 Snap Leaf Photo';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn-secondary';
      cancelBtn.textContent = 'Cancel';

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
      alert("Unable to access camera. Please select a leaf photo or sample image instead.");
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

  // Trigger analysis simulation laser window
  setTimeout(async () => {
    const analysis = await analyzeLeafImage(imgElement, state.currentCropFilter);
    state.currentAnalysis = analysis;
    state.isScanning = false;
    dom.scannerOverlay.classList.add('hidden');
    
    // Save to history
    saveToHistory(analysis);
    displayAnalysisResults(analysis);
  }, 1800);
}

function displayAnalysisResults(analysis) {
  const d = analysis.disease;
  
  dom.placeholderCard.classList.add('hidden');
  dom.resultCard.classList.remove('hidden');

  dom.diseaseName.textContent = d.diseaseName;
  dom.scientificName.textContent = d.scientificName;
  
  dom.severityPill.textContent = d.severityLevel;
  dom.severityPill.style.backgroundColor = d.badgeColor;
  dom.severityPill.style.color = '#ffffff';

  dom.confidenceVal.textContent = `${analysis.confidence}%`;
  dom.confidenceFill.style.width = `${analysis.confidence}%`;

  // Pre-fill calculation default rate from medicine
  if (d.chemicalCures && d.chemicalCures[0] && dom.calcRate) {
    const match = d.chemicalCures[0].dosage.match(/([\d\.]+)/);
    if (match) dom.calcRate.value = match[1];
  }

  renderTabContent();
}

function renderTabContent() {
  if (!state.currentAnalysis) return;
  const d = state.currentAnalysis.disease;

  dom.tabRootCause.classList.add('hidden');
  dom.tabOrganic.classList.add('hidden');
  dom.tabChemical.classList.add('hidden');
  dom.tabPrevention.classList.add('hidden');

  if (state.activeTab === 'root_cause') {
    dom.tabRootCause.classList.remove('hidden');
    dom.tabRootCause.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h4 style="color:#a7f3d0; margin-bottom:0.5rem; font-family:'Outfit',sans-serif;">🔍 Observed Symptoms</h4>
        <ul class="info-list">
          ${d.symptoms.map(s => `<li class="info-item"><span class="bullet-icon">●</span> ${s}</li>`).join('')}
        </ul>
      </div>
      <div>
        <h4 style="color:#fcd34d; margin-bottom:0.5rem; font-family:'Outfit',sans-serif;">🌧️ Root Causes & Triggers</h4>
        <ul class="info-list">
          ${d.rootCauses.map(r => `<li class="info-item"><span class="bullet-icon">▲</span> ${r}</li>`).join('')}
        </ul>
      </div>
    `;
  } else if (state.activeTab === 'organic') {
    dom.tabOrganic.classList.remove('hidden');
    dom.tabOrganic.innerHTML = d.organicCures.map(med => `
      <div class="medicine-card" style="border-left-color: #10b981;">
        <div class="medicine-name">🌿 ${med.name}</div>
        <div class="medicine-dosage">Recommended Dosage: ${med.dosage}</div>
        <div class="medicine-app">Application Guide: ${med.application}</div>
      </div>
    `).join('');
  } else if (state.activeTab === 'chemical') {
    dom.tabChemical.classList.remove('hidden');
    dom.tabChemical.innerHTML = d.chemicalCures ? d.chemicalCures.map(med => `
      <div class="medicine-card" style="border-left-color: #3b82f6;">
        <div class="medicine-name">🧪 ${med.name}</div>
        <div class="medicine-dosage">Active Dosage: ${med.dosage}</div>
        <div class="medicine-app">Application Guide: ${med.application}</div>
      </div>
    `).join('') : '<p style="color:var(--text-muted);">No synthetic chemical sprays required. Organic management recommended.</p>';
  } else if (state.activeTab === 'prevention') {
    dom.tabPrevention.classList.remove('hidden');
    dom.tabPrevention.innerHTML = `
      <h4 style="color:#34d399; margin-bottom:0.75rem; font-family:'Outfit',sans-serif;">🛡️ Step-by-Step Crop Recovery & Prevention Protocol</h4>
      <ul class="info-list">
        ${d.preventionProtocol.map((step, idx) => `
          <li class="info-item">
            <span style="background:rgba(16,185,129,0.2); color:#34d399; font-weight:700; border-radius:50%; width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; flex-shrink:0;">${idx + 1}</span>
            ${step}
          </li>
        `).join('')}
      </ul>
    `;
  }
}

function calculateDosage() {
  const area = parseFloat(dom.calcArea?.value || 1); // liters or acres
  const rate = parseFloat(dom.calcRate?.value || 2.5); // grams or ml per liter

  const totalWaterLitres = Math.round(area * 200); // ~200L spray water per acre
  const totalMedicineGrams = (totalWaterLitres * rate).toFixed(1);

  if (dom.calcVolumeResult) dom.calcVolumeResult.textContent = `${totalWaterLitres} Liters`;
  if (dom.calcMedicineResult) dom.calcMedicineResult.textContent = `${totalMedicineGrams} g/ml`;
}

function handleUserChatMessage() {
  const question = dom.chatInput.value.trim();
  if (!question) return;

  // Add user bubble
  appendChatBubble("user", question);
  dom.chatInput.value = "";

  // Generate intelligent response based on keywords or current diagnosis
  setTimeout(() => {
    let answer = "For effective crop protection, ensure uniform foliar coverage during early morning or late evening hours. Avoid spraying under strong sunlight or imminent rain.";
    
    const qLower = question.toLowerCase();
    if (qLower.includes("neem") || qLower.includes("organic")) {
      answer = "Neem oil works best when emulsified with 1ml liquid soap per liter of water. Spray every 7 days as a preventative against fungal spores and soft-bodied sucking insects.";
    } else if (qLower.includes("blight") || qLower.includes("spot")) {
      answer = "Fungal blights spread rapidly through moisture. Immediately prune infected lower leaves, increase air circulation, and apply a Copper Hydroxide or Mancozeb protective spray.";
    } else if (qLower.includes("dose") || qLower.includes("water") || qLower.includes("mix")) {
      answer = "Always mix powders in a small quantity of water to form a smooth paste before adding to the full spray tank. Maintain 200 Liters of water per acre for standard field crops.";
    } else if (state.currentAnalysis) {
      answer = `Regarding your current scan (${state.currentAnalysis.disease.diseaseName}): Follow the organic and chemical remedies listed in the diagnostic card. Maintain clean crop field sanitation.`;
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
  dom.libraryContainer.innerHTML = CROP_DISEASES.map(d => `
    <div class="glass-card" style="margin-bottom: 1.25rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <h3 style="font-family:'Outfit',sans-serif; color:#fff;">${d.diseaseName} (${d.crop})</h3>
        <span class="severity-pill" style="background:${d.badgeColor}; color:#fff;">${d.severityLevel}</span>
      </div>
      <p style="font-style:italic; color:var(--text-muted); font-size:0.9rem; margin-bottom:0.75rem;">Pathogen: ${d.scientificName}</p>
      <div style="margin-bottom:0.75rem;">
        <strong style="color:#a7f3d0; font-size:0.9rem;">Key Symptoms:</strong>
        <p style="color:#d1d5db; font-size:0.9rem;">${d.symptoms.slice(0, 2).join('. ')}</p>
      </div>
      <div>
        <strong style="color:#fcd34d; font-size:0.9rem;">Recommended Remedies:</strong>
        <p style="color:#d1d5db; font-size:0.9rem;">${d.organicCures[0].name} (${d.organicCures[0].dosage})</p>
      </div>
    </div>
  `).join('');
}

function saveToHistory(analysis) {
  state.history.unshift({
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    crop: analysis.disease.crop,
    diseaseName: analysis.disease.diseaseName,
    confidence: analysis.confidence
  });
  if (state.history.length > 10) state.history.pop();
  localStorage.setItem('crop_scan_history', JSON.stringify(state.history));
}
