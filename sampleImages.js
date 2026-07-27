/**
 * Sample gallery dataset with pre-generated leaf visuals and disease hints
 */

export const SAMPLE_GALLERY = [
  {
    id: "tomato_late_blight",
    crop: "Tomato",
    diseaseName: "Late Blight",
    badge: "High Severity",
    badgeColor: "#ef4444",
    description: "Dark oily water-soaked spots with yellow border halo",
    svgVisual: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%"><defs><radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23451a03"/><stop offset="60%" stop-color="%23854d0e"/><stop offset="85%" stop-color="%23eab308"/><stop offset="100%" stop-color="%2315803d"/></radialGradient></defs><rect width="200" height="200" rx="16" fill="%23052e16"/><path d="M100 20 Q160 50 150 120 T100 180 Q40 120 50 50 Z" fill="%23166534" stroke="%2322c55e" stroke-width="2"/><ellipse cx="90" cy="85" rx="35" ry="28" fill="url(%23g1)" opacity="0.95"/><ellipse cx="120" cy="130" rx="25" ry="20" fill="url(%23g1)" opacity="0.9"/><path d="M100 30 L100 170 M100 70 L135 50 M100 100 L65 80 M100 130 L140 115" stroke="%234ade80" stroke-width="2" opacity="0.4"/></svg>`
  },
  {
    id: "potato_early_blight",
    crop: "Potato",
    diseaseName: "Early Blight",
    badge: "Moderate Severity",
    badgeColor: "#f97316",
    description: "Target-board concentric brown rings with chlorosis",
    svgVisual: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%"><rect width="200" height="200" rx="16" fill="%23064e3b"/><path d="M100 15 C150 30 170 90 140 160 C100 185 60 170 50 120 C40 60 70 30 100 15 Z" fill="%2315803d" stroke="%234ade80" stroke-width="2"/><circle cx="95" cy="80" r="26" fill="%23ca8a04"/><circle cx="95" cy="80" r="18" fill="%2378350f"/><circle cx="95" cy="80" r="10" fill="%23451a03"/><circle cx="95" cy="80" r="4" fill="%231c1917"/><circle cx="125" cy="125" r="18" fill="%23ca8a04"/><circle cx="125" cy="125" r="11" fill="%2378350f"/><circle cx="125" cy="125" r="5" fill="%23451a03"/></svg>`
  },
  {
    id: "corn_common_rust",
    crop: "Corn",
    diseaseName: "Common Rust",
    badge: "Rust Pustules",
    badgeColor: "#eab308",
    description: "Elongated powdery reddish pustules on leaf surface",
    svgVisual: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%"><rect width="200" height="200" rx="16" fill="%2314532d"/><rect x="60" y="10" width="80" height="180" rx="40" fill="%2316a34a" stroke="%2386efac" stroke-width="2"/><ellipse cx="85" cy="50" rx="8" ry="14" fill="%23b45309"/><ellipse cx="115" cy="75" rx="7" ry="16" fill="%239a3412"/><ellipse cx="90" cy="110" rx="9" ry="18" fill="%23b45309"/><ellipse cx="110" cy="140" rx="8" ry="15" fill="%237c2d12"/><line x1="100" y1="10" x2="100" y2="190" stroke="%23bbf7d0" stroke-width="3" opacity="0.6"/></svg>`
  },
  {
    id: "rice_blast",
    crop: "Rice",
    diseaseName: "Rice Blast",
    badge: "Severe Lesions",
    badgeColor: "#b91c1c",
    description: "Spindle-shaped diamond spots with ash gray center",
    svgVisual: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%"><rect width="200" height="200" rx="16" fill="%23022c22"/><path d="M100 10 Q145 100 120 190 Q80 190 55 100 Z" fill="%2315803d" stroke="%234ade80" stroke-width="2"/><polygon points="90,50 110,65 90,80 70,65" fill="%23e5e7eb" stroke="%23991b1b" stroke-width="3"/><polygon points="105,100 125,120 105,140 85,120" fill="%23e5e7eb" stroke="%23991b1b" stroke-width="3"/><polygon points="85,145 100,158 85,170 70,158" fill="%23d1d5db" stroke="%237f1d1d" stroke-width="2.5"/></svg>`
  },
  {
    id: "healthy_leaf",
    crop: "General Crop",
    diseaseName: "Healthy Leaf",
    badge: "Pristine",
    badgeColor: "#10b981",
    description: "Uniform green pigment without lesions or spots",
    svgVisual: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%"><rect width="200" height="200" rx="16" fill="%23064e3b"/><path d="M100 20 Q165 60 145 140 Q100 185 55 140 Q35 60 100 20 Z" fill="%2310b981" stroke="%236ee7b7" stroke-width="3"/><path d="M100 25 L100 175 M100 65 L135 45 M100 95 L65 75 M100 125 L135 105 M100 150 L70 135" stroke="%23ecfdf5" stroke-width="2" opacity="0.6"/></svg>`
  }
];
