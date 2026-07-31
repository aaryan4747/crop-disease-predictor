/**
 * Regional Disease Outbreak Map Engine
 * Generates interactive district outbreak risk heatmap data for AP, Telangana, and South/North India
 */

export const OUTBREAK_MAP_DATA = [
  {
    state: "Andhra Pradesh",
    district: "Guntur",
    riskLevel: "CRITICAL",
    color: "#dc2626", // Red
    activeDisease: "Chilli Black Thrips & Leaf Curl",
    trend: "+24% Outbreak Spurt",
    humidity: "88%",
    advisory: "Apply Coromandel Finio (1.25ml/L). Install blue sticky traps."
  },
  {
    state: "Andhra Pradesh",
    district: "Anantapur",
    riskLevel: "HIGH",
    color: "#ea580c", // Orange
    activeDisease: "Groundnut Tikka Leaf Spot",
    trend: "+12% Moisture Spurt",
    humidity: "82%",
    advisory: "Apply UPL SAAF (2g/L) or Bayer Nativo (0.75g/L)."
  },
  {
    state: "Andhra Pradesh",
    district: "Kurnool",
    riskLevel: "MEDIUM",
    color: "#eab308", // Yellow
    activeDisease: "Onion Purple Blotch",
    trend: "Stable",
    humidity: "75%",
    advisory: "Spray Mancozeb M-45 (2.5g/L) with silicone sticker."
  },
  {
    state: "Telangana",
    district: "Warangal",
    riskLevel: "CRITICAL",
    color: "#dc2626", // Red
    activeDisease: "Cotton Pink Bollworm & Alternaria Spot",
    trend: "+30% Larval Catch",
    humidity: "86%",
    advisory: "Install Pheromone traps (8/acre). Spray Coragen (0.4ml/L)."
  },
  {
    state: "Telangana",
    district: "Khammam",
    riskLevel: "HIGH",
    color: "#ea580c", // Orange
    activeDisease: "Watermelon Anthracnose & Vine Wilt",
    trend: "+18% Humidity Spurt",
    humidity: "84%",
    advisory: "Spray Syngenta Amistar (1ml/L) or Kocide (2.5g/L)."
  },
  {
    state: "Telangana",
    district: "Karimnagar",
    riskLevel: "LOW",
    color: "#10b981", // Green
    activeDisease: "Healthy Crop Growth - Normal Risk",
    trend: "Decreasing",
    humidity: "65%",
    advisory: "Apply 19-19-19 balanced N-P-K foliar spray."
  }
];

export function renderOutbreakHeatmapGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = OUTBREAK_MAP_DATA.map(item => `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:1.15rem; border-left:5px solid ${item.color};">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
        <div style="font-weight:800; font-size:1.05rem; color:#0f172a;">${item.district}, ${item.state}</div>
        <span style="background:${item.color}; color:#ffffff; font-size:0.75rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:12px;">${item.riskLevel}</span>
      </div>
      <div style="font-size:0.9rem; font-weight:700; color:var(--primary-emerald); margin-bottom:0.25rem;">🦠 ${item.activeDisease}</div>
      <div style="display:flex; gap:0.75rem; font-size:0.8rem; color:#64748b; margin-bottom:0.5rem;">
        <span>📈 Trend: <strong>${item.trend}</strong></span>
        <span>💧 Humidity: <strong>${item.humidity}</strong></span>
      </div>
      <div style="font-size:0.82rem; background:#f8fafc; border:1px solid #e2e8f0; padding:0.5rem; border-radius:6px; color:#334155;">
        <strong>🛡️ District Advisory:</strong> ${item.advisory}
      </div>
    </div>
  `).join('');
}
