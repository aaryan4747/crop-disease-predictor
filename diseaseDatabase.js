/**
 * Crop Disease & Cure Database
 * Specialized dataset including major commercial & staple crops grown across Telugu-speaking regions (AP & Telangana).
 */

export const CROP_DISEASES = [
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
      "Spindle-shaped diamond spots with ash-gray center and brown margins on leaves",
      "Blackening and breaking of stem nodes (Nodal Blast)",
      "Neck rot causing panicle head loss and empty grain chaff"
    ],
    rootCauses: [
      "Excessive nitrogen fertilizer application",
      "Cool humid nights (20°C-25°C) coupled with prolonged morning dew and overcast skies"
    ],
    organicCures: [
      {
        name: "Pseudomonas fluorescens Bio-Control",
        dosage: "10g per Liter of water",
        application: "Foliar spray at tillering and panicle initiation stage."
      },
      {
        name: "Silicon Amendment (Calcium Silicate)",
        dosage: "100kg per acre",
        application: "Apply to soil to strengthen silica cell wall defense against fungal penetration."
      }
    ],
    chemicalCures: [
      {
        name: "Tricyclazole 75% WP (Baan / Beam)",
        dosage: "0.6g per Liter of water",
        application: "Systemic preventive spray at boot leaf stage."
      },
      {
        name: "Isoprothiolane 40% EC (Fuji-one)",
        dosage: "1.5ml per Liter of water",
        application: "Curative spray upon first appearance of leaf blast spots."
      }
    ],
    preventionProtocol: [
      "Avoid excessive nitrogen fertilization; split N into 3 balanced doses.",
      "Maintain 5cm standing water level in paddy fields."
    ]
  },
  {
    id: "chilli_leaf_curl",
    crop: "Chilli (మిరప)",
    diseaseName: "Chilli Leaf Curl & Dieback (మిరప ఆకు ముడుత & కొమ్మ ఎండు తెగులు)",
    scientificName: "Chilli Leaf Curl Virus (Thrips & Whitefly Vectored)",
    type: "Viral & Fungal Complex",
    severityLevel: "Critical",
    severityScore: 94,
    badgeColor: "#dc2626",
    colorSignatures: { hueMin: 40, hueMax: 80, darknessThreshold: 0.30, spotRatioMin: 0.18 },
    symptoms: [
      "Upward and downward curling of young leaves ('boat-shaped' leaves)",
      "Stunted plant growth, puckering, and vein thickening",
      "Dieback of tender branches from top downward with black necrotic tips",
      "Fruit rot and premature chilli drop"
    ],
    rootCauses: [
      "Transmission by Thrips (Scirtothrips dorsalis) and Whiteflies (Bemisia tabaci) during dry hot spells",
      "High temperature (30°C-36°C) accelerating insect vector breeding"
    ],
    organicCures: [
      {
        name: "Neem Seed Kernel Extract (NSKE 5%) + Soap",
        dosage: "50ml NSKE + 1ml soap per Liter of water",
        application: "Weekly foliar spray to control vector insects."
      },
      {
        name: "Agniastra Bio-Pesticide (Garlic + Green Chilli + Neem)",
        dosage: "20ml per Liter of water",
        application: "Natural organic botanical spray against sucking pests."
      }
    ],
    chemicalCures: [
      {
        name: "Fipronil 5% SC / Imidacloprid 17.8% SL",
        dosage: "1.5ml Fipronil or 0.5ml Imidacloprid per Liter",
        application: "Systemic insecticide to eliminate thrips and whiteflies."
      },
      {
        name: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)",
        dosage: "1ml per Liter of water",
        application: "Spray for dieback and fruit rot control."
      }
    ],
    preventionProtocol: [
      "Install Yellow & Blue Sticky Traps (20 per acre) to catch thrips and whiteflies.",
      "Grow border crops of Maize or Sorghum (3 rows) around chilli field as barrier."
    ]
  },
  {
    id: "cotton_leaf_spot",
    crop: "Cotton (ప్రత్తి)",
    diseaseName: "Cotton Alternaria Leaf Spot (ప్రత్తి ఆకు మచ్చ తెగులు)",
    scientificName: "Alternaria macrospora",
    type: "Fungal Pathogen",
    severityLevel: "Moderate to High",
    severityScore: 76,
    badgeColor: "#ea580c",
    colorSignatures: { hueMin: 20, hueMax: 50, darknessThreshold: 0.38, spotRatioMin: 0.15 },
    symptoms: [
      "Small circular brown spots with purple-red borders on leaves",
      "Concentric rings inside mature lesions leading to leaf perforation ('shot-hole')",
      "Premature defoliation of lower boll-bearing leaves"
    ],
    rootCauses: [
      "Potash nutrient stress during heavy boll loading stage",
      "Intermittent rainfall and high humidity above 85%"
    ],
    organicCures: [
      {
        name: "Cow Urine + Sour Buttermilk Ferment",
        dosage: "50ml Fermented mixture per Liter of water",
        application: "Spray every 10 days as bio-fungicide and leaf fertilizer."
      }
    ],
    chemicalCures: [
      {
        name: "Copper Oxychloride 50% WP (Blitox)",
        dosage: "3g per Liter of water",
        application: "Foliar spray at early lesion development."
      },
      {
        name: "Propiconazole 25% EC (Tilt)",
        dosage: "1ml per Liter of water",
        application: "Systemic triazole fungicide spray."
      }
    ],
    preventionProtocol: [
      "Apply recommended doses of Muriate of Potash (MOP) to prevent leaf weakening.",
      "Remove and burn fallen infected leaf litter."
    ]
  },
  {
    id: "groundnut_tikka",
    crop: "Groundnut (వేరుశనగ)",
    diseaseName: "Groundnut Tikka Leaf Spot (వేరుశనగ తిక్కా ఆకు మచ్చ తెగులు)",
    scientificName: "Cercospora arachidicola / Phaeoisariopsis personata",
    type: "Fungal Pathogen",
    severityLevel: "High",
    severityScore: 80,
    badgeColor: "#d97706",
    colorSignatures: { hueMin: 25, hueMax: 55, darknessThreshold: 0.42, spotRatioMin: 0.16 },
    symptoms: [
      "Small dark brown to black circular spots surrounded by yellow halo on leaf upper surface",
      "Carbon-black cushion-like fungal tufts on leaf underside",
      "Severe leaf shedding leading to pod filling failure"
    ],
    rootCauses: [
      "Warm humid conditions (26°C-30°C) with continuous wet foliage",
      "Soil-borne fungal spores overwintering in groundnut crop debris"
    ],
    organicCures: [
      {
        name: "Trichoderma viride + Vermicompost Soil Application",
        dosage: "2kg Trichoderma + 100kg Vermicompost per acre",
        application: "Apply to soil at field preparation."
      }
    ],
    chemicalCures: [
      {
        name: "Tebuconazole 50% + Trifloxystrobin 25% WG (Nativo)",
        dosage: "0.75g per Liter of water",
        application: "Spray 35-40 days after sowing."
      },
      {
        name: "Mancozeb 75% WP + Carbendazim 12% WP (SAAF)",
        dosage: "2g per Liter of water",
        application: "Foliar spray at first spot appearance."
      }
    ],
    preventionProtocol: [
      "Practice crop rotation with Cereals (Maize, Sorghum).",
      "Treat seeds with Carbendazim 2g/kg before planting."
    ]
  },
  {
    id: "sugarcane_red_rot",
    crop: "Sugarcane (చెరకు)",
    diseaseName: "Sugarcane Red Rot (చెరకు ఎర్ర కుళ్ళు తెగులు)",
    scientificName: "Colletotrichum falcatum",
    type: "Fungal Pathogen",
    severityLevel: "Severe",
    severityScore: 90,
    badgeColor: "#b91c1c",
    colorSignatures: { hueMin: 15, hueMax: 40, darknessThreshold: 0.35, spotRatioMin: 0.22 },
    symptoms: [
      "Third and fourth leaves turn yellow and wither from margin inward",
      "Internal stalk tissues show reddening with characteristic white transverse bands",
      "Stalks emit alcoholic sour odor when split open"
    ],
    rootCauses: [
      "Infected seed setts used during planting",
      "Waterlogging and poor field drainage during monsoon flooding"
    ],
    organicCures: [
      {
        name: "Hot Water Seed Sett Treatment (52°C for 30 min)",
        dosage: "Pre-planting dip",
        application: "Treat seed setts before planting to destroy internal fungus."
      }
    ],
    chemicalCures: [
      {
        name: "Carbendazim 50% WP (Bavistin)",
        dosage: "2g per Liter of water",
        application: "Soak seed setts for 15 minutes before planting."
      }
    ],
    preventionProtocol: [
      "Plant red-rot resistant sugarcane varieties.",
      "Ensure proper field drainage ditches to prevent standing water."
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
      "Dark brown necrotic tear-stain spots on fruits (Anthracnose)",
      "Blossom dropping leading to complete fruit set loss"
    ],
    rootCauses: [
      "Cool humid nights during flowering stage (February-March)",
      "High humidity and morning dew during bloom"
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
        dosage: "1ml to 1.5ml per Liter of water",
        application: "Spray at full blossom stage."
      },
      {
        name: "Carbendazim 50% WP",
        dosage: "1g per Liter of water",
        application: "Spray for anthracnose control."
      }
    ],
    preventionProtocol: [
      "Prune overcrowding inner branches to allow sunlight penetration into canopy.",
      "Keep orchard floor clear of fallen leaves and decaying fruits."
    ]
  },
  {
    id: "turmeric_rhizome_rot",
    crop: "Turmeric (పసుపు)",
    diseaseName: "Turmeric Leaf Spot & Rhizome Rot (పసుపు ఆకు మచ్చ & దుంప కుళ్ళు తెగులు)",
    scientificName: "Taphrina maculans / Pythium aphanidermatum",
    type: "Fungal Pathogen Complex",
    severityLevel: "High",
    severityScore: 84,
    badgeColor: "#ea580c",
    colorSignatures: { hueMin: 30, hueMax: 60, darknessThreshold: 0.35, spotRatioMin: 0.16 },
    symptoms: [
      "Numerous yellow spots on both leaf surfaces turning brown and dry",
      "Basal stem rotting and rhizomes turning soft, water-soaked, and foul smelling"
    ],
    rootCauses: [
      "Heavy monsoon rains and waterlogging in raised beds",
      "Un-treated seed rhizomes infected with Pythium fungus"
    ],
    organicCures: [
      {
        name: "Trichoderma harzianum Bio-Treatment",
        dosage: "50g per seed rhizome basket + Soil drench",
        application: "Apply to soil and rhizomes before planting."
      }
    ],
    chemicalCures: [
      {
        name: "Metalaxyl 4% + Mancozeb 64% (Ridomil Gold Soil Drench)",
        dosage: "2.5g per Liter of water",
        application: "Drench soil around plants upon waterlogging."
      }
    ],
    preventionProtocol: [
      "Plant turmeric in raised beds (30cm height) with adequate drainage channels."
    ]
  },
  {
    id: "tomato_late_blight",
    crop: "Tomato (టమోటా)",
    diseaseName: "Tomato Late Blight (టమోటా ఎండు తెగులు)",
    scientificName: "Phytophthora infestans",
    type: "Oomycete Pathogen",
    severityLevel: "Severe",
    severityScore: 88,
    badgeColor: "#ef4444",
    colorSignatures: { hueMin: 15, hueMax: 45, darknessThreshold: 0.35, spotRatioMin: 0.15 },
    symptoms: [
      "Large, irregular water-soaked dark brown to black spots on leaves",
      "White cottony fungal growth on the undersides of leaves during high humidity",
      "Stems develop dark brown oily lesions causing vine collapse"
    ],
    rootCauses: [
      "Prolonged leaf wetness (>10 hours) combined with moderate temperatures (15°C - 22°C)"
    ],
    organicCures: [
      {
        name: "Copper Hydroxide / Bordeaux Mixture 1%",
        dosage: "3g to 4g per Liter of water",
        application: "Foliar spray every 5-7 days during damp conditions."
      }
    ],
    chemicalCures: [
      {
        name: "Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold)",
        dosage: "2g per Liter of water",
        application: "Systemic curative action upon first lesion sign."
      }
    ],
    preventionProtocol: [
      "Destroy and burn all infected crop residues immediately."
    ]
  },
  {
    id: "corn_common_rust",
    crop: "Maize (మొక్కజొన్న)",
    diseaseName: "Maize Common Rust (మొక్కజొన్న తుప్పు తెగులు)",
    scientificName: "Puccinia sorghi",
    type: "Fungal Pathogen",
    severityLevel: "Moderate",
    severityScore: 64,
    badgeColor: "#eab308",
    colorSignatures: { hueMin: 10, hueMax: 35, darknessThreshold: 0.30, spotRatioMin: 0.18 },
    symptoms: [
      "Elongated cinnamon-brown to reddish pustules on both upper and lower leaf surfaces"
    ],
    rootCauses: [
      "Cool to moderate temperatures (16°C - 23°C) with continuous high moisture"
    ],
    organicCures: [
      {
        name: "Wettable Sulfur 80% WP",
        dosage: "3g per Liter of water",
        application: "Foliar application when reddish rust pustules first emerge."
      }
    ],
    chemicalCures: [
      {
        name: "Tebuconazole 25.9% EC",
        dosage: "1ml per Liter of water",
        application: "Triazole systemic fungicide at early tasseling stage."
      }
    ],
    preventionProtocol: [
      "Plant rust-resistant hybrid corn varieties."
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
      "Intact leaf margins without necrotic spots or yellow halos"
    ],
    rootCauses: [
      "Optimal soil moisture, balanced N-P-K nutrition, and adequate sunlight"
    ],
    organicCures: [
      {
        name: "Preventative Seaweed Extract Foliar Spray",
        dosage: "2ml per Liter of water",
        application: "Monthly biostimulant spray to enhance stress resistance."
      }
    ],
    chemicalCures: [
      {
        name: "Balanced N-P-K (19-19-19) Foliar Nutrition",
        dosage: "3g to 5g per Liter of water",
        application: "Apply every 15-20 days for optimum crop growth."
      }
    ],
    preventionProtocol: [
      "Maintain consistent soil moisture and organic mulch cover."
    ]
  }
];

export const CROP_LIST = [
  "All Crops (అన్ని పంటలు)",
  "Rice (వరి)",
  "Chilli (మిరప)",
  "Cotton (ప్రత్తి)",
  "Groundnut (వేరుశనగ)",
  "Sugarcane (చెరకు)",
  "Mango (మామిడి)",
  "Tomato (టమోటా)",
  "Maize (మొక్కజొన్న)",
  "Turmeric (పసుపు)"
];
