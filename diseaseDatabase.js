/**
 * Crop Disease & Cure Database
 * Includes features missing in Plantix & Agrio:
 * - Pre-Harvest Interval (PHI) Toxic Waiting Days
 * - Soil N-P-K Mineral Deficiency Symptoms & Remedies
 */

export const CROP_DISEASES = [
  {
    id: "chilli_leaf_curl",
    crop: "Chilli (మిరప)",
    diseaseName: "Chilli Black Thrips & Leaf Curl (మిరప నల్ల తామర పురుగు & ఆకు ముడుత)",
    scientificName: "Thrips parvispinus & Scirtothrips dorsalis / Chilli Leaf Curl Virus",
    type: "Insect Vector & Viral Complex",
    severityLevel: "Critical",
    severityScore: 96,
    badgeColor: "#dc2626",
    colorSignatures: { hueMin: 40, hueMax: 80, darknessThreshold: 0.30, spotRatioMin: 0.18 },
    symptoms: [
      "Upward and downward boat-shaped leaf curling with puckered veins",
      "Flower dropping, deformed chilli pods, and silvering on leaf underside",
      "Blackening of tender shoot tips and dieback of flowering branches"
    ],
    rootCauses: [
      "Heavy infestation of Black Thrips (*Thrips parvispinus*) during dry hot spells",
      "High temperature (30°C-36°C) accelerating insect vector breeding"
    ],
    organicCures: [
      {
        name: "5% Neem Seed Kernel Extract (NSKE 50ml/L) + Blue/Yellow Sticky Traps",
        dosage: "50ml NSKE + 1ml liquid soap per Liter (Install 30 traps/acre)",
        application: "Weekly foliar spray to disrupt thrips feeding and trap flying vectors."
      },
      {
        name: "Agniastra Bio-Pesticide (Garlic + Green Chilli + Neem)",
        dosage: "20ml per Liter of water",
        application: "Botanical organic spray targeting nymph colonies on leaf undersides."
      }
    ],
    chemicalCures: [
      {
        name: "Spinetoram 11.7% SC (Delegate) or Spinosad 45% SC (Tracer)",
        dosage: "1ml Spinetoram or 0.3ml Spinosad per Liter of water",
        application: "KVK recommended rotation spray targeting thrips underneath leaves.",
        phiDays: 5
      },
      {
        name: "Fipronil 5% SC or Fipronil 80% WG",
        dosage: "1.5ml SC or 0.2g WG per Liter of water",
        application: "Systemic contact spray for severe thrips infestation.",
        phiDays: 7
      }
    ],
    preventionProtocol: [
      "Plant 3 border rows of Sorghum (Jowar) or Bajra around chilli field as physical wind barrier.",
      "Avoid excess nitrogenous fertilizers which attract sucking pests."
    ],
    mineralDeficiency: "Nitrogen (N) excess causing succulent tender growth that heavily attracts sucking thrips pests."
  },
  {
    id: "rice_bph",
    crop: "Rice (వరి)",
    diseaseName: "Paddy Brown Plant Hopper - BPH (వరి సుడి దోమ తెగులు)",
    scientificName: "Nilaparvata lugens",
    type: "Sucking Insect Pest",
    severityLevel: "Severe",
    severityScore: 94,
    badgeColor: "#b91c1c",
    colorSignatures: { hueMin: 35, hueMax: 70, darknessThreshold: 0.35, spotRatioMin: 0.22 },
    symptoms: [
      "Circular patches of yellowing and drying plants in the field ('Hopper Burn')",
      "Base of paddy tillers swarming with brown nymphs and adult hoppers near water line",
      "Sooty mold fungus developing on honey-dew excreted by hoppers"
    ],
    rootCauses: [
      "High humidity in dense crop canopy with standing water",
      "Indiscriminate use of synthetic pyrethroids killing natural predator spiders"
    ],
    organicCures: [
      {
        name: "Temporary Field Draining & Aeration",
        dosage: "Drain water for 3-4 days",
        application: "Drop humidity at soil level to interrupt hopper nymph development."
      },
      {
        name: "Neem Oil 10,000 PPM",
        dosage: "3ml per Liter of water",
        application: "Spray targeted directly at the base of paddy tillers."
      }
    ],
    chemicalCures: [
      {
        name: "Pymetrozine 50% WDG (Chess)",
        dosage: "0.6g per Liter of water",
        application: "KVK recommended spray directed at plant base.",
        phiDays: 19
      },
      {
        name: "Dinotefuran 20% SG (Token)",
        dosage: "0.4g per Liter of water",
        application: "Systemic action paralyzing hopper feeding.",
        phiDays: 14
      }
    ],
    preventionProtocol: [
      "Form 'Alleyways' (passing lanes of 30cm every 2 meters) during transplanting for aeration.",
      "Avoid continuous standing water; practice alternate wetting and drying (AWD)."
    ],
    mineralDeficiency: "Potassium (K) deficiency weakening tiller straw strength and lowering hopper pest resistance."
  },
  {
    id: "cotton_pink_bollworm",
    crop: "Cotton (ప్రత్తి)",
    diseaseName: "Cotton Pink Bollworm (ప్రత్తి గులాబీ రంగు పురుగు తెగులు)",
    scientificName: "Pectinophora gossypiella",
    type: "Lepidopteran Insect Pest",
    severityLevel: "Severe",
    severityScore: 92,
    badgeColor: "#dc2626",
    colorSignatures: { hueMin: 20, hueMax: 50, darknessThreshold: 0.36, spotRatioMin: 0.16 },
    symptoms: [
      "'Rosette' flowers (petals tied together like a rosette)",
      "Entry holes in young bolls plugged with larval excreted frass",
      "Stained lint and premature shedding of green bolls"
    ],
    rootCauses: [
      "Carry-over of larvae in un-destroyed crop stalks from previous season",
      "Late-season irrigation extending crop duration beyond 160 days"
    ],
    organicCures: [
      {
        name: "Pheromone Traps + Rosette Flower Plucking",
        dosage: "5 Pheromone traps per acre",
        application: "Manual destruction of rosette flowers and trapping adult male moths."
      }
    ],
    chemicalCures: [
      {
        name: "Thiodicarb 75% WP (Larvin)",
        dosage: "2g per Liter of water",
        application: "Spray at 60-90 days after sowing upon reaching 10% rosette flower threshold.",
        phiDays: 30
      },
      {
        name: "Chlorpyrifos 20% EC",
        dosage: "2ml per Liter of water",
        application: "Foliar spray during boll formation stage.",
        phiDays: 21
      }
    ],
    preventionProtocol: [
      "Sow early-maturing short-duration cotton hybrids.",
      "Destroy and burn cotton stalks immediately after final picking."
    ],
    mineralDeficiency: "Magnesium (Mg) deficiency causing reddening of leaves during boll development."
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
        application: "Preventive spray at boot leaf stage.",
        phiDays: 30
      }
    ],
    preventionProtocol: [
      "Avoid excessive nitrogen fertilization."
    ],
    mineralDeficiency: "Silicon (Si) deficiency weakening leaf epidermal cell walls against fungal hyphae penetration."
  },
  {
    id: "watermelon_anthracnose",
    crop: "Watermelon (పుచ్చకాయ)",
    diseaseName: "Watermelon Anthracnose & Wilt (పుచ్చకాయ నల్ల మచ్చ & వాడిపోయే తెగులు)",
    scientificName: "Colletotrichum orbiculare",
    type: "Fungal Pathogen",
    severityLevel: "High",
    severityScore: 84,
    badgeColor: "#ea580c",
    colorSignatures: { hueMin: 25, hueMax: 55, darknessThreshold: 0.38, spotRatioMin: 0.16 },
    symptoms: [
      "Circular water-soaked spots on leaves turning dark brown to black",
      "Sunken circular lesions on watermelon rind filled with pinkish spore masses"
    ],
    rootCauses: [
      "Warm humid weather (24°C-30°C) with frequent rain"
    ],
    organicCures: [
      {
        name: "Trichoderma viride + Soil Solarization",
        dosage: "5g per Liter soil drench",
        application: "Drench soil around vine roots."
      }
    ],
    chemicalCures: [
      {
        name: "Azoxystrobin 23% SC (Amistar)",
        dosage: "1ml per Liter of water",
        application: "Spray every 10-14 days.",
        phiDays: 7
      }
    ],
    preventionProtocol: [
      "Use drip irrigation and plastic mulch."
    ],
    mineralDeficiency: "Zinc (Zn) & Calcium (Ca) deficiency causing blossom end rot and rind cracking."
  },
  {
    id: "banana_sigatoka",
    crop: "Banana (అరటి)",
    diseaseName: "Banana Sigatoka Leaf Spot (అరటి సిగటోకా తెగులు)",
    scientificName: "Mycosphaerella musicola",
    type: "Fungal Pathogen",
    severityLevel: "Severe",
    severityScore: 88,
    badgeColor: "#ef4444",
    colorSignatures: { hueMin: 30, hueMax: 65, darknessThreshold: 0.35, spotRatioMin: 0.18 },
    symptoms: [
      "Yellow-green streaks parallel to leaf veins turning dark brown"
    ],
    rootCauses: [
      "High humidity above 90% and continuous warm temperatures"
    ],
    organicCures: [
      {
        name: "Horticultural Mineral Oil",
        dosage: "10ml per Liter + 1g Soap",
        application: "Spray on young leaves."
      }
    ],
    chemicalCures: [
      {
        name: "Tilt (Propiconazole 1ml/L + Mineral oil)",
        dosage: "1ml per Liter of water",
        application: "Spray during monsoon.",
        phiDays: 30
      }
    ],
    preventionProtocol: [
      "De-trashing infected lower leaves."
    ],
    mineralDeficiency: "Potassium (K) deficiency causing leaf tip firing and reduced bunch weight."
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
      "Uniform green pigmentation across the leaf surface"
    ],
    rootCauses: [
      "Optimal soil moisture and balanced nutrition"
    ],
    organicCures: [
      {
        name: "Seaweed Extract Foliar Spray",
        dosage: "2ml per Liter of water",
        application: "Monthly spray."
      }
    ],
    chemicalCures: [
      {
        name: "Balanced N-P-K (19-19-19)",
        dosage: "3g to 5g per Liter of water",
        application: "Apply every 15-20 days.",
        phiDays: 0
      }
    ],
    preventionProtocol: [
      "Maintain consistent soil moisture."
    ],
    mineralDeficiency: "No deficiencies detected. Maintain balanced fertilization."
  }
];

export const CROP_LIST = [
  "All Crops (అన్ని పంటలు)",
  "Chilli (మిరప)",
  "Rice (వరి)",
  "Cotton (ప్రత్తి)",
  "Watermelon (పుచ్చకాయ)",
  "Banana (అరటి)",
  "Papaya (బొప్పాయి)",
  "Okra / Lady's Finger (బెండకాయ)",
  "Brinjal / Eggplant (వంకాయ)",
  "Onion (ఉల్లిపాయ)",
  "Mango (మామిడి)",
  "Groundnut (వేరుశనగ)",
  "Sugarcane (చెరకు)",
  "Tomato (టమోటా)",
  "Maize (మొక్కజొన్న)",
  "Turmeric (పసుపు)"
];
