/**
 * Personalized Farmer Dashboard, Timeline Monitoring & Treatment Feedback Loop Engine
 */

export const FARMER_PROFILE = {
  name: "M. Koti Reddy",
  location: "Ponnur, Guntur District, AP",
  totalAcres: 5,
  cropsGrown: ["Chilli (మిరప)", "Watermelon (పుచ్చకాయ)"],
  scansProcessed: 18,
  recoveryRate: "94% Average Crop Recovery",
  moneySpent: "₹14,500 (Pesticides & Fertilizers)",
  fields: [
    { fieldId: "F1", name: "North Block - Chilli", acres: 3, status: "🟢 Healthy (Day 20)" },
    { fieldId: "F2", name: "South Block - Watermelon", acres: 2, status: "🟡 Recovering (Day 10)" }
  ]
};

export const TIMELINE_LOGS = [
  { day: "Day 1", date: "2026-07-15", status: "🔴 Severe Infection Detected", note: "Chilli Black Thrips & Leaf Curl detected. Applied Coromandel Finio @ 1.25ml/L." },
  { day: "Day 5", date: "2026-07-20", status: "🟡 65% Lesion Drying", note: "Curling puckering reduced. Blue sticky traps caught 450 thrips." },
  { day: "Day 10", date: "2026-07-25", status: "🟢 92% Recovery Achieved", note: "New green tender shoots emerging without leaf curl." },
  { day: "Day 20", date: "2026-07-31", status: "✨ 100% Healthy Crop Harvest", note: "Harvest yield estimation: 38 Quintals per Acre." }
];

export function renderFarmerDashboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:1.5rem; margin-bottom:1.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
        <div>
          <h2 style="font-family:'Outfit',sans-serif; font-size:1.6rem; font-weight:800; color:var(--primary-emerald);">
            👨‍🌾 Farmer Farm Profile: ${FARMER_PROFILE.name}
          </h2>
          <div style="font-size:0.9rem; color:#64748b;">📍 ${FARMER_PROFILE.location} • Total Land: ${FARMER_PROFILE.totalAcres} Acres</div>
        </div>
        <div style="background:#f0fdf4; border:1px solid var(--primary-emerald); padding:0.6rem 1rem; border-radius:12px; font-weight:800; color:var(--primary-emerald); font-size:0.95rem;">
          🏆 ${FARMER_PROFILE.recoveryRate}
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1rem; border-radius:10px; text-align:center;">
          <div style="font-size:0.8rem; color:#64748b; font-weight:700;">TOTAL SCANS</div>
          <div style="font-size:1.6rem; font-weight:800; color:#0f172a;">${FARMER_PROFILE.scansProcessed}</div>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1rem; border-radius:10px; text-align:center;">
          <div style="font-size:0.8rem; color:#64748b; font-weight:700;">TOTAL EXPENSE</div>
          <div style="font-size:1.6rem; font-weight:800; color:#dc2626;">${FARMER_PROFILE.moneySpent}</div>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1rem; border-radius:10px; text-align:center;">
          <div style="font-size:0.8rem; color:#64748b; font-weight:700;">ACTIVE CROPS</div>
          <div style="font-size:1.1rem; font-weight:800; color:var(--primary-emerald);">${FARMER_PROFILE.cropsGrown.join(', ')}</div>
        </div>
      </div>

      <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.75rem;">📅 Day 1 → Day 20 Crop Recovery Timeline Tracker</h3>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        ${TIMELINE_LOGS.map(log => `
          <div style="background:#f8fafc; border-left:4px solid var(--primary-emerald); padding:0.85rem; border-radius:6px;">
            <div style="display:flex; justify-content:space-between; font-weight:800; font-size:0.92rem; margin-bottom:0.2rem;">
              <span>${log.day} (${log.date})</span>
              <span>${log.status}</span>
            </div>
            <div style="font-size:0.85rem; color:#334155;">${log.note}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
