/**
 * Self-Contained SVG Vector Leaf Visuals for Sample Gallery Testing
 */

function createLeafSvgDataUri(diseaseId) {
  let innerSvg = "";

  if (diseaseId === "tomato_late_blight") {
    // Tomato Leaf with dark necrotic blight spots and chlorosis
    innerSvg = `
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0f2214"/>
        <path d="M100 20 C130 50, 160 80, 150 130 C140 170, 100 185, 100 185 C100 185, 60 170, 50 130 C40 80, 70 50, 100 20 Z" fill="#2d6a3f" stroke="#1b4326" stroke-width="2"/>
        <path d="M100 20 L100 185 M100 60 L140 85 M100 90 L60 115 M100 120 L145 145 M100 140 L55 160" stroke="#163820" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Blight Necrotic Spots -->
        <circle cx="85" cy="75" r="18" fill="#3b2314" opacity="0.9"/>
        <circle cx="85" cy="75" r="12" fill="#1c0f07"/>
        <ellipse cx="125" cy="115" rx="22" ry="16" fill="#422718" opacity="0.9"/>
        <ellipse cx="125" cy="115" rx="14" ry="10" fill="#1f1008"/>
        <circle cx="70" cy="135" r="14" fill="#382112" opacity="0.85"/>
        <!-- Chlorosis Halo -->
        <circle cx="85" cy="75" r="24" fill="#84cc16" opacity="0.25"/>
        <ellipse cx="125" cy="115" rx="28" ry="22" fill="#84cc16" opacity="0.2"/>
      </svg>
    `;
  } else if (diseaseId === "potato_early_blight") {
    // Potato Leaf with concentric ring brown spots
    innerSvg = `
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0f2214"/>
        <path d="M100 25 C140 50, 155 90, 145 140 C135 175, 100 185, 100 185 C100 185, 65 175, 55 140 C45 90, 60 50, 100 25 Z" fill="#347846" stroke="#1b4326" stroke-width="2"/>
        <path d="M100 25 L100 185 M100 70 L135 90 M100 105 L65 125 M100 135 L138 150" stroke="#1b4326" stroke-width="2"/>
        <!-- Concentric Ring Target Spots -->
        <g transform="translate(80, 80)">
          <circle cx="0" cy="0" r="20" fill="#facc15" opacity="0.3"/>
          <circle cx="0" cy="0" r="15" fill="#78350f"/>
          <circle cx="0" cy="0" r="10" fill="#f59e0b"/>
          <circle cx="0" cy="0" r="5" fill="#451a03"/>
        </g>
        <g transform="translate(120, 130)">
          <circle cx="0" cy="0" r="18" fill="#facc15" opacity="0.3"/>
          <circle cx="0" cy="0" r="13" fill="#78350f"/>
          <circle cx="0" cy="0" r="8" fill="#f59e0b"/>
          <circle cx="0" cy="0" r="4" fill="#451a03"/>
        </g>
      </svg>
    `;
  } else if (diseaseId === "corn_common_rust") {
    // Corn Leaf blade with reddish-brown rust pustules
    innerSvg = `
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0f2214"/>
        <!-- Long corn leaf blade -->
        <path d="M40 180 C70 120, 90 70, 160 20 C130 60, 100 110, 80 180 Z" fill="#4d925d" stroke="#235431" stroke-width="2"/>
        <path d="M40 180 C70 120, 90 70, 160 20" stroke="#235431" stroke-width="2.5"/>
        <!-- Reddish Rust Pustules -->
        <ellipse cx="90" cy="110" rx="4" ry="10" fill="#dc2626" transform="rotate(-30 90 110)"/>
        <ellipse cx="105" cy="90" rx="3" ry="8" fill="#b91c1c" transform="rotate(-30 105 90)"/>
        <ellipse cx="120" cy="70" rx="4" ry="9" fill="#ea580c" transform="rotate(-30 120 70)"/>
        <ellipse cx="80" cy="130" rx="3" ry="7" fill="#dc2626" transform="rotate(-30 80 130)"/>
        <ellipse cx="135" cy="50" rx="4" ry="8" fill="#b91c1c" transform="rotate(-30 135 50)"/>
      </svg>
    `;
  } else if (diseaseId === "rice_blast") {
    // Rice Leaf blade with spindle-shaped gray spots
    innerSvg = `
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0f2214"/>
        <path d="M30 185 C60 130, 100 70, 175 15 C130 75, 80 135, 55 185 Z" fill="#3f8a52" stroke="#1d4d29" stroke-width="2"/>
        <path d="M30 185 Q100 100 175 15" stroke="#1d4d29" stroke-width="2"/>
        <!-- Spindle Diamond Blast Spots -->
        <g transform="translate(85, 120) rotate(-40)">
          <path d="M-15 0 Q0 -7 15 0 Q0 7 -15 0 Z" fill="#78350f"/>
          <path d="M-10 0 Q0 -4 10 0 Q0 4 -10 0 Z" fill="#d1d5db"/>
        </g>
        <g transform="translate(125, 75) rotate(-40)">
          <path d="M-18 0 Q0 -8 18 0 Q0 8 -18 0 Z" fill="#78350f"/>
          <path d="M-12 0 Q0 -5 12 0 Q0 5 -12 0 Z" fill="#e5e7eb"/>
        </g>
      </svg>
    `;
  } else if (diseaseId === "chilli_leaf_curl") {
    // Chilli Leaf with upward puckered curling
    innerSvg = `
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0f2214"/>
        <!-- Puckered boat-shaped leaf -->
        <path d="M100 30 C135 55, 140 100, 125 150 C110 175, 100 180, 100 180 C100 180, 90 175, 75 150 C60 100, 65 55, 100 30 Z" fill="#2d6a3f" stroke="#1b4326" stroke-width="2"/>
        <path d="M100 30 L100 180 M100 70 Q130 85 115 120 M100 100 Q70 115 85 140" stroke="#facc15" stroke-width="2.5" fill="none"/>
        <circle cx="100" cy="85" r="18" fill="#a3e635" opacity="0.25"/>
      </svg>
    `;
  } else if (diseaseId === "watermelon_anthracnose") {
    // Watermelon leaf with dark spots
    innerSvg = `
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0f2214"/>
        <path d="M100 25 C145 45, 160 95, 140 145 C125 175, 100 185, 100 185 C100 185, 75 175, 60 145 C40 95, 55 45, 100 25 Z" fill="#3b824f" stroke="#1b4326" stroke-width="2"/>
        <circle cx="90" cy="80" r="14" fill="#1c0f07"/>
        <circle cx="120" cy="120" r="16" fill="#2b1408"/>
        <circle cx="75" cy="130" r="12" fill="#1c0f07"/>
      </svg>
    `;
  } else {
    // Healthy Vibrant Green Leaf
    innerSvg = `
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0f2214"/>
        <path d="M100 20 C145 50, 160 90, 150 140 C140 175, 100 185, 100 185 C100 185, 60 175, 50 140 C40 90, 55 50, 100 20 Z" fill="url(#greenGrad)" stroke="#10b981" stroke-width="2.5"/>
        <path d="M100 20 L100 185 M100 60 L140 85 M100 90 L60 115 M100 120 L145 145 M100 140 L55 160" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
        <defs>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(innerSvg.trim())}`;
}

export const SAMPLE_GALLERY = [
  {
    id: "tomato_late_blight",
    diseaseName: "Late Blight",
    crop: "Tomato",
    svgVisual: createLeafSvgDataUri("tomato_late_blight")
  },
  {
    id: "potato_early_blight",
    diseaseName: "Early Blight",
    crop: "Potato",
    svgVisual: createLeafSvgDataUri("potato_early_blight")
  },
  {
    id: "corn_common_rust",
    diseaseName: "Common Rust",
    crop: "Maize / Corn",
    svgVisual: createLeafSvgDataUri("corn_common_rust")
  },
  {
    id: "rice_blast",
    diseaseName: "Rice Blast",
    crop: "Rice / Paddy",
    svgVisual: createLeafSvgDataUri("rice_blast")
  },
  {
    id: "chilli_leaf_curl",
    diseaseName: "Chilli Leaf Curl",
    crop: "Chilli",
    svgVisual: createLeafSvgDataUri("chilli_leaf_curl")
  },
  {
    id: "watermelon_anthracnose",
    diseaseName: "Anthracnose",
    crop: "Watermelon",
    svgVisual: createLeafSvgDataUri("watermelon_anthracnose")
  },
  {
    id: "healthy_leaf",
    diseaseName: "Healthy Leaf",
    crop: "General Crop",
    svgVisual: createLeafSvgDataUri("healthy_leaf")
  }
];
