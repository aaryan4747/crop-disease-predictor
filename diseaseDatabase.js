/**
 * Crop Disease & Cure Database
 * Comprehensive pathology database covering field crops, cash crops, fruits, and vegetables.
 */

export const CROP_DISEASES = [
  {
    id: "watermelon_anthracnose",
    crop: "Watermelon (పుచ్చకాయ)",
    diseaseName: "Watermelon Anthracnose & Wilt (పుచ్చకాయ నల్ల మచ్చ & వాడిపోయే తెగులు)",
    scientificName: "Colletotrichum orbiculare / Fusarium oxysporum",
    type: "Fungal Pathogen",
    severityLevel: "High",
    severityScore: 84,
    badgeColor: "#ea580c",
    colorSignatures: { hueMin: 25, hueMax: 55, darknessThreshold: 0.38, spotRatioMin: 0.16 },
    symptoms: [
      "Circular water-soaked spots on leaves turning dark brown to black",
      "Sunken circular lesions on watermelon rind filled with pinkish spore masses",
      "Vines wilting suddenly during fruit expansion"
    ],
    rootCauses: [
      "Warm humid weather (24°C-30°C) with frequent rain or overhead sprinkler irrigation",
      "Fungal spores surviving in soil debris from previous cucurbit crops"
    ],
    organicCures: [
      {
        name: "Trichoderma viride + Soil Solarization",
        dosage: "5g per Liter soil drench",
        application: "Drench soil around vine roots before flowering."
      },
      {
        name: "Copper Hydroxide 77% WP",
        dosage: "2.5g per Liter of water",
        application: "Foliar spray at early fruit set."
      }
    ],
    chemicalCures: [
      {
        name: "Azoxystrobin 23% SC (Amistar)",
        dosage: "1ml per Liter of water",
        application: "Spray every 10-14 days during fruit growth."
      },
      {
        name: "Carbendazim 50% WP",
        dosage: "1g per Liter of water",
        application: "Preventive drench for fusarium wilt."
      }
    ],
    preventionProtocol: [
      "Practice 3-year crop rotation with non-cucurbit crops.",
      "Use drip irrigation and silver-black plastic mulch beds."
    ]
  },
  {
    id: "banana_sigatoka",
    crop: "Banana (అరటి)",
    diseaseName: "Banana Sigatoka Leaf Spot (అరటి సిగటోకా ఆకు మచ్చ తెగులు)",
    scientificName: "Mycosphaerella musicola / fijiensis",
    type: "Fungal Pathogen",
    severityLevel: "Severe",
    severityScore: 88,
    badgeColor: "#ef4444",
    colorSignatures: { hueMin: 30, hueMax: 65, darknessThreshold: 0.35, spotRatioMin: 0.18 },
    symptoms: [
      "Pale yellow-green streaks parallel to leaf veins turning dark brown",
      "Sunken gray centers with dark reddish-brown borders on mature leaves",
      "Premature leaf drying leading to small, unmarketable banana bunches"
    ],
    rootCauses: [
      "High humidity above 90% and continuous warm temperatures (27°C-30°C)",
      "Overcrowded banana plantation limiting sunlight and airflow"
    ],
    organicCures: [
      {
        name: "Mineral Oil / Horticultural Spray Oil",
        dosage: "10ml per Liter of water + 1g Soap",
        application: "Spray on young emerging banana leaves."
      }
    ],
    chemicalCures: [
      {
        name: "Propiconazole 25% EC (Tilt) + Mineral Oil",
        dosage: "1ml Tilt + 10ml Mineral oil per Liter",
        application: "Spray at first streak initiation during monsoon."
      }
    ],
    preventionProtocol: [
      "De-trashing: Promptly cut and remove dried, infected lower leaves.",
      "Maintain wider spacing (1.8m x 1.8m) and control sucker density."
    ]
  },
  {
    id: "papaya_ring_spot",
    crop: "Papaya (బొప్పాయి)",
    diseaseName: "Papaya Ring Spot Virus & Anthracnose (బొప్పాయి రింగ్ స్పాట్ వైరస్ & కాయ కుళ్ళు)",
    scientificName: "Papaya Ringspot Virus (Aphid Vectored)",
    type: "Viral & Fungal Complex",
    severityLevel: "Critical",
    severityScore: 95,
    badgeColor: "#dc2626",
    colorSignatures: { hueMin: 40, hueMax: 80, darknessThreshold: 0.30, spotRatioMin: 0.20 },
    symptoms: [
      "Yellow mosaic mottling and leaf shoe-stringing (leaves reduced to main veins)",
      "Dark green oily rings and streaks on young stems and green papaya fruits",
      "Stunted crown growth and bitter, small fruits"
    ],
    rootCauses: [
      "Transmitted by Aphids (Aphis gossypii) migrating from nearby cucurbit fields",
      "Warm dry weather boosting aphid populations"
    ],
    organicCures: [
      {
        name: "Neem Oil 10,000 PPM + Sticky Traps",
        dosage: "3ml per Liter of water",
        application: "Weekly spray to suppress aphid vector feeding."
      },
      {
        name: "Foliar Micronutrient Spray (Zinc + Boron)",
        dosage: "2g Zinc + 1g Boron per Liter",
        application: "Enhances papaya physiological vigor against virus."
      }
    ],
    chemicalCures: [
      {
        name: "Dimethoate 30% EC or Thiamethoxam 25% WG",
        dosage: "1.7ml Dimethoate or 0.3g Thiamethoxam per Liter",
        application: "Systemic insecticide to eliminate aphid vector colonies."
      }
    ],
    preventionProtocol: [
      "Roughing: Eradicate and burn virus-infected plants immediately.",
      "Avoid planting papaya near cucumber, watermelon, or pumpkin crops."
    ]
  },
  {
    id: "okra_yellow_vein",
    crop: "Okra / Lady's Finger (బెండకాయ)",
    diseaseName: "Okra Yellow Vein Mosaic Virus (బెండకాయ పసుపు ఈనెల మోజాయిక్ తెగులు)",
    scientificName: "Okra Yellow Vein Mosaic Virus (Whitefly Vectored)",
    type: "Viral Pathogen",
    severityLevel: "Severe",
    severityScore: 90,
    badgeColor: "#b91c1c",
    colorSignatures: { hueMin: 45, hueMax: 85, darknessThreshold: 0.20, spotRatioMin: 0.25 },
    symptoms: [
      "Networks of bright yellow veins contrasting against green leaf blade",
      "Complete yellowing of leaves in severe cases with small upright leaves",
      "Fruits become small, pale yellow, hard, and unmarketable"
    ],
    rootCauses: [
      "Whiteflies (Bemisia tabaci) transmitting the virus while feeding on plant sap",
      "High summer temperatures favoring rapid whitefly multiplication"
    ],
    organicCures: [
      {
        name: "Yellow Sticky Traps + Neem Oil 5%",
        dosage: "5ml Neem Oil per Liter of water",
        application: "Install 20 yellow sticky traps per acre; spray Neem weekly."
      }
    ],
    chemicalCures: [
      {
        name: "Acetamiprid 20% SP or Imidacloprid 17.8% SL",
        dosage: "0.2g Acetamiprid or 0.5ml Imidacloprid per Liter",
        application: "Spray at 10-15 day intervals for whitefly control."
      }
    ],
    preventionProtocol: [
      "Sow resistant okra varieties (e.g., Arka Anamika, Parbhani Kranti).",
      "Remove weeds like Abutilon indicum which act as alternate viral hosts."
    ]
  },
  {
    id: "brinjal_shoot_borer",
    crop: "Brinjal / Eggplant (వంకాయ)",
    diseaseName: "Brinjal Little Leaf & Fruit Borer (వంకాయ చిన్న ఆకు & కాయ తొలుచు తెగులు)",
    scientificName: "Phytoplasma (Leafhopper Vectored) / Leucinodes orbonalis",
    type: "Phytoplasma & Insect Complex",
    severityLevel: "High",
    severityScore: 86,
    badgeColor: "#ea580c",
    colorSignatures: { hueMin: 35, hueMax: 70, darknessThreshold: 0.32, spotRatioMin: 0.15 },
    symptoms: [
      "Extremely small, narrow, crowded leaves producing bushy 'witch's broom' appearance",
      "Drooping shoots and wilting tender terminal tips",
      "Holes in brinjal fruits filled with insect frass"
    ],
    rootCauses: [
      "Phytoplasma spread by Leafhoppers (Hishimonus phycitis)",
      "Continuous brinjal cultivation without crop rotation"
    ],
    organicCures: [
      {
        name: "Pheromone Traps + Bacillus thuringiensis (Bt)",
        dosage: "2g Bt per Liter of water",
        application: "Install 10 Pheromone traps per acre; spray Bt every 7 days."
      }
    ],
    chemicalCures: [
      {
        name: "Emamectin Benzoate 5% SG",
        dosage: "0.4g per Liter of water",
        application: "Spray for shoot and fruit borer caterpillar control."
      },
      {
        name: "Dimethoate 30% EC (for Leafhopper Vector)",
        dosage: "1.7ml per Liter of water",
        application: "Spray to control little leaf vector leafhoppers."
      }
    ],
    preventionProtocol: [
      "Clip and destroy wilted shoot tips weekly.",
      "Uproot and burn little-leaf infected bushy plants."
    ]
  },
  {
    id: "onion_purple_blotch",
    crop: "Onion (ఉల్లిపాయ)",
    diseaseName: "Onion Purple Blotch (ఉల్లిపాయ ఊదా రంగు మచ్చ తెగులు)",
    scientificName: "Alternaria porri",
    type: "Fungal Pathogen",
    severityLevel: "Moderate to High",
    severityScore: 78,
    badgeColor: "#d97706",
    colorSignatures: { hueMin: 20, hueMax: 50, darknessThreshold: 0.40, spotRatioMin: 0.14 },
    symptoms: [
      "Small sunken water-soaked spots on leaves expanding into oval purple lesions",
      "Yellow zone surrounding purple spots; leaves break and fall over",
      "Bulb neck rot during storage"
    ],
    rootCauses: [
      "Warm humid climate (25°C-30°C) with frequent rainfall or heavy dew",
      "Thrips feeding injuries providing entry points for fungal spores"
    ],
    organicCures: [
      {
        name: "Trichoderma viride + Neem Oil 5%",
        dosage: "5g Trichoderma + 5ml Neem oil per Liter",
        application: "Spray at 10-day intervals."
      }
    ],
    chemicalCures: [
      {
        name: "Mancozeb 75% WP + Sticker Agent",
        dosage: "2.5g Mancozeb + 1ml Sandovit sticker per Liter",
        application: "Spray thoroughly ensuring liquid sticks to waxy onion leaves."
      },
      {
        name: "Tebuconazole 25.9% EC",
        dosage: "1ml per Liter of water",
        application: "Systemic spray for purple blotch control."
      }
    ],
    preventionProtocol: [
      "Always add a non-ionic spreader/sticker to spray tank for onion crops.",
      "Ensure proper bulb drying/curing before post-harvest storage."
    ]
  },
  {
    id: "mango_powdery_mildew",
    crop: "Mango (మామిడి)",
    diseaseName: "Mango Powdery Mildew & Anthracnose (మామిడి బూడిద & నల్ల మచ్చ తెగులు)",
    scientificName: "Oidium mangiferae / Colletotrichum gloeosporioides",
    type: "Fungal Pathogen",
    severityLevel: "High",
    severityScore: 82,
    badgeColor: "#eab308",
    colorSignatures: { hueMin: 45, hueMax: 75, darknessThreshold: 0.25, spotRatioMin: 0.14 },
    symptoms: [
      "White powdery coating on inflorescence blossom panicles and young leaves",
      "Dark brown necrotic tear-stain spots on fruits (Anthracnose)"
    ],
    rootCauses: [
      "Cool humid nights during flowering stage (February-March)"
    ],
    organicCures: [
      {
        name: "Wettable Sulfur 80% WP",
        dosage: "3g per Liter of water",
        application: "Spray at early panicle emergence."
      }
    ],
    chemicalCures: [
      {
        name: "Hexaconazole 5% EC (Contaf)",
        dosage: "1ml per Liter of water",
        application: "Spray at full blossom stage."
      }
    ],
    preventionProtocol: [
      "Prune overcrowding inner branches to allow sunlight penetration."
    ]
  },
  {
    id: "rice_blast",
    crop: "Rice (వరి)",
    diseaseName: "Rice Blast (వరి అగ్గి తెగులు)",
    scientificName: "Magnaporthe oryzae",
    type: "Fungal Pathogen",
    severityLevel: "Severe",
    severityScore: 92,
    badgeColor: "#b91c1c",
    colorSignatures: { hueMin: 30, hueMax: 65, darknessThreshold: 0.32, spotRatioMin: 0.20 },
    symptoms: [
      "Spindle-shaped diamond spots with ash-gray center on leaves",
      "Blackening and breaking of stem nodes (Nodal Blast)"
    ],
    rootCauses: [
      "Excessive nitrogen fertilizer application and cool humid nights"
    ],
    organicCures: [
      {
        name: "Pseudomonas fluorescens Bio-Control",
        dosage: "10g per Liter of water",
        application: "Spray at tillering stage."
      }
    ],
    chemicalCures: [
      {
        name: "Tricyclazole 75% WP (Baan)",
        dosage: "0.6g per Liter of water",
        application: "Preventive spray at boot leaf stage."
      }
    ],
    preventionProtocol: [
      "Avoid excessive nitrogen fertilization."
    ]
  },
  {
    id: "chilli_leaf_curl",
    crop: "Chilli (మిరప)",
    diseaseName: "Chilli Leaf Curl & Dieback (మిరప ఆకు ముడుత & కొమ్మ ఎండు తెగులు)",
    scientificName: "Chilli Leaf Curl Virus",
    type: "Viral & Fungal Complex",
    severityLevel: "Critical",
    severityScore: 94,
    badgeColor: "#dc2626",
    colorSignatures: { hueMin: 40, hueMax: 80, darknessThreshold: 0.30, spotRatioMin: 0.18 },
    symptoms: [
      "Upward and downward curling of leaves, stunted plant growth",
      "Dieback of tender branches from top downward"
    ],
    rootCauses: [
      "Transmission by Thrips and Whiteflies during dry hot spells"
    ],
    organicCures: [
      {
        name: "Neem Seed Kernel Extract (NSKE 5%)",
        dosage: "50ml NSKE + 1ml soap per Liter",
        application: "Weekly spray."
      }
    ],
    chemicalCures: [
      {
        name: "Fipronil 5% SC / Imidacloprid 17.8% SL",
        dosage: "1.5ml Fipronil or 0.5ml Imidacloprid per Liter",
        application: "Spray for vector control."
      }
    ],
    preventionProtocol: [
      "Install Yellow & Blue Sticky Traps."
    ]
  },
  {
    id: "healthy_leaf",
    crop: "General Crop (అన్ని రకాల పంటలు)",
    diseaseName: "Healthy Plant Leaf (ఆరోగ్యకరమైన ఆకు)",
    scientificName: "Normal Physiological State",
    type: "No Pathogen Detected",
    severityLevel: "Healthy",
    severityScore: 0,
    badgeColor: "#10b981",
    colorSignatures: { hueMin: 80, hueMax: 150, darknessThreshold: 0.15, spotRatioMin: 0.02 },
    symptoms: [
      "Uniform green pigmentation across the leaf surface",
      "Intact leaf margins without necrotic spots"
    ],
    rootCauses: [
      "Optimal soil moisture, balanced N-P-K nutrition, and adequate sunlight"
    ],
    organicCures: [
      {
        name: "Preventative Seaweed Extract Foliar Spray",
        dosage: "2ml per Liter of water",
        application: "Monthly biostimulant spray."
      }
    ],
    chemicalCures: [
      {
        name: "Balanced N-P-K (19-19-19) Foliar Nutrition",
        dosage: "3g to 5g per Liter of water",
        application: "Apply every 15-20 days."
      }
    ],
    preventionProtocol: [
      "Maintain consistent soil moisture."
    ]
  }
];

export const CROP_LIST = [
  "All Crops (అన్ని పంటలు)",
  "Watermelon (పుచ్చకాయ)",
  "Banana (అరటి)",
  "Papaya (బొప్పాయి)",
  "Okra / Lady's Finger (బెండకాయ)",
  "Brinjal / Eggplant (వంకాయ)",
  "Onion (ఉల్లిపాయ)",
  "Mango (మామిడి)",
  "Rice (వరి)",
  "Chilli (మిరప)",
  "Cotton (ప్రత్తి)",
  "Groundnut (వేరుశనగ)",
  "Sugarcane (చెరకు)",
  "Tomato (టమోటా)",
  "Maize (మొక్కజొన్న)",
  "Turmeric (పసుపు)"
];
