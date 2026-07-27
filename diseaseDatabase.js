/**
 * Crop Disease & Cure Database
 * Contains detailed pathology records for common agricultural crops.
 */

export const CROP_DISEASES = [
  {
    id: "tomato_late_blight",
    crop: "Tomato",
    diseaseName: "Late Blight",
    scientificName: "Phytophthora infestans",
    type: "Oomycete / Fungal-like Pathogen",
    severityLevel: "Severe",
    severityScore: 88,
    badgeColor: "#ef4444",
    colorSignatures: { hueMin: 15, hueMax: 45, darknessThreshold: 0.35, spotRatioMin: 0.15 },
    symptoms: [
      "Large, irregular water-soaked dark brown to black spots on leaves",
      "White cottony fungal growth on the undersides of leaves during high humidity",
      "Stems develop dark brown oily lesions causing vine collapse",
      "Fruit develops firm, dark brown greasy patches"
    ],
    rootCauses: [
      "Prolonged leaf wetness (>10 hours) combined with moderate temperatures (15°C - 22°C)",
      "High relative humidity above 90%",
      "Wind-blown sporangia from nearby infected fields or infected seed tubers",
      "Poor field air circulation and overcrowded planting layout"
    ],
    organicCures: [
      {
        name: "Copper Hydroxide / Bordeaux Mixture",
        dosage: "3g to 4g per Liter of water",
        application: "Foliar spray every 5-7 days during damp conditions. Cover both sides of leaves."
      },
      {
        name: "Bio-fungicide (Trichoderma viride / harzianum)",
        dosage: "5g to 10g per Liter of water",
        application: "Soil drenching and foliar spray at early onset."
      },
      {
        name: "Neem Seed Kernel Extract (5% Concentration)",
        dosage: "50ml per Liter of water + 1ml liquid soap surfactant",
        application: "Spray preventive every 7 days."
      }
    ],
    chemicalCures: [
      {
        name: "Mancozeb 75% WP",
        dosage: "2.5g per Liter of water",
        application: "Preventive spray before canopy closure and high humidity periods."
      },
      {
        name: "Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold)",
        dosage: "2g per Liter of water",
        application: "Systemic curative action. Apply at first sign of lesions; max 2 sprays per season."
      },
      {
        name: "Cymoxanil 8% + Mancozeb 64% WP",
        dosage: "2g per Liter of water",
        application: "Curative application within 48 hours of infection."
      }
    ],
    preventionProtocol: [
      "Destroy and burn all infected crop residues immediately (do not compost).",
      "Adopt drip irrigation instead of overhead sprinklers to keep foliage dry.",
      "Maintain wide row spacing (60cm x 45cm) for maximum airflow and sunlight penetration.",
      "Apply crop rotation with non-solanaceous crops (e.g., corn, legumes) for at least 3 years."
    ]
  },
  {
    id: "potato_early_blight",
    crop: "Potato",
    diseaseName: "Early Blight",
    scientificName: "Alternaria solani",
    type: "Fungal Pathogen",
    severityLevel: "Moderate to High",
    severityScore: 72,
    badgeColor: "#f97316",
    colorSignatures: { hueMin: 25, hueMax: 55, darknessThreshold: 0.40, spotRatioMin: 0.12 },
    symptoms: [
      "Concentric ring dark brown spots ('target-board' pattern) on older leaves",
      "Yellow halo (chlorosis) surrounding brown necrotic lesions",
      "Lower leaves wither, dry up, and drop prematurely",
      "Sunken brown lesions on tubers near harvest"
    ],
    rootCauses: [
      "Warm temperatures (24°C - 29°C) coupled with alternating wet and dry periods",
      "Nitrogen and potassium nutrient stress in aging plants",
      "Fungal spores overwintering in infected plant debris and solanaceous weeds",
      "Dew or sprinkler irrigation creating periodic wet foliage"
    ],
    organicCures: [
      {
        name: "Potassium Bicarbonate + Horticultural Oil",
        dosage: "5g Potassium Bicarbonate + 5ml oil per Liter of water",
        application: "Spray thoroughly at first appearance of target spots."
      },
      {
        name: "Bacillus subtilis Bio-Fungicide",
        dosage: "4ml to 6ml per Liter of water",
        application: "Weekly preventative application during foliage growth."
      }
    ],
    chemicalCures: [
      {
        name: "Chlorothalonil 75% WP",
        dosage: "2g per Liter of water",
        application: "Broad-spectrum protectant spray every 7-10 days."
      },
      {
        name: "Azoxystrobin 23% SC",
        dosage: "1ml per Liter of water",
        application: "Systemic strobilurin fungicide spray at early disease initiation."
      },
      {
        name: "Propineb 70% WP",
        dosage: "3g per Liter of water",
        application: "Contact protective spray with zinc nutrition benefit."
      }
    ],
    preventionProtocol: [
      "Ensure balanced soil fertilization; avoid late-stage nitrogen deficiency.",
      "Mulch soil around plants to prevent fungal spores from splashing onto lower leaves.",
      "Remove infected lower leaves promptly.",
      "Use certified disease-free seed tubers."
    ]
  },
  {
    id: "corn_common_rust",
    crop: "Corn (Maize)",
    diseaseName: "Common Rust",
    scientificName: "Puccinia sorghi",
    type: "Fungal Pathogen",
    severityLevel: "Moderate",
    severityScore: 64,
    badgeColor: "#eab308",
    colorSignatures: { hueMin: 10, hueMax: 35, darknessThreshold: 0.30, spotRatioMin: 0.18 },
    symptoms: [
      "Elongated cinnamon-brown to reddish pustules on both upper and lower leaf surfaces",
      "Pustules rupture exposing powdery reddish-brown rust spores",
      "Severe infection causes leaf chlorosis, yellowing, and premature leaf death",
      "Reduced kernel filling and stalk weakening"
    ],
    rootCauses: [
      "Cool to moderate temperatures (16°C - 23°C) with continuous high moisture",
      "Airborne urediniospores blown long distances from southern corn fields",
      "Continuous cropping of susceptible hybrid corn varieties"
    ],
    organicCures: [
      {
        name: "Sulfur Dusting / Wettable Sulfur 80% WP",
        dosage: "3g per Liter of water",
        application: "Foliar application when reddish rust pustules first emerge."
      },
      {
        name: "Compost Tea + Neem Oil Extract",
        dosage: "100ml compost tea + 5ml neem oil per Liter",
        application: "Spray early morning to boost leaf microbial defense."
      }
    ],
    chemicalCures: [
      {
        name: "Tebuconazole 25.9% EC",
        dosage: "1ml to 1.5ml per Liter of water",
        application: "Triazole systemic fungicide at early tassel/tasseling stage."
      },
      {
        name: "Pyraclostrobin 20% WG",
        dosage: "0.5g to 0.75g per Liter of water",
        application: "Apply at first sign of rust pustules prior to silk stage."
      }
    ],
    preventionProtocol: [
      "Plant rust-resistant hybrid corn varieties.",
      "Plant early in the season to avoid peak spore migration windows.",
      "Ensure proper crop spacing and weed control."
    ]
  },
  {
    id: "grape_black_rot",
    crop: "Grape",
    diseaseName: "Black Rot",
    scientificName: "Guignardia bidwellii",
    type: "Fungal Pathogen",
    severityLevel: "High to Severe",
    severityScore: 82,
    badgeColor: "#dc2626",
    colorSignatures: { hueMin: 20, hueMax: 50, darknessThreshold: 0.45, spotRatioMin: 0.14 },
    symptoms: [
      "Small reddish-brown circular spots on leaves with dark brown borders",
      "Tiny black pinpoint dots (pycnidia) inside the brown spots",
      "Infected grapes shrivel into hard, black, wrinkled 'mummies'",
      "Cane lesions turn dark brown and cracked"
    ],
    rootCauses: [
      "Warm moist spring weather (21°C - 27°C) with extended leaf wetness (6-7 hours)",
      "Overwintered mummified berries left on vines or ground",
      "Dense canopy restricting sunlight and canopy drying"
    ],
    organicCures: [
      {
        name: "Liquid Lime Sulfur Solution",
        dosage: "15ml to 20ml per Liter of water",
        application: "Dormant spray before bud break."
      },
      {
        name: "Copper Sulfate + Hydrated Lime (Bordeaux)",
        dosage: "4g Copper + 4g Lime per Liter of water",
        application: "Apply post-bloom through early fruit set."
      }
    ],
    chemicalCures: [
      {
        name: "Myclobutanil 10% WP",
        dosage: "0.4g to 0.5g per Liter of water",
        application: "Apply from pre-bloom until 4 weeks post-bloom."
      },
      {
        name: "Mancozeb + Difenoconazole",
        dosage: "2g Mancozeb + 0.5ml Difenoconazole per Liter",
        application: "Foliar spray at 10-14 day intervals."
      }
    ],
    preventionProtocol: [
      "Sanitation: Prune out all mummified berries and infected canes in winter.",
      "Trellis management: Open up canopy by shoot positioning and leaf pulling around fruit zones.",
      "Keep ground free of leaf litter."
    ]
  },
  {
    id: "apple_scab",
    crop: "Apple",
    diseaseName: "Apple Scab",
    scientificName: "Venturia inaequalis",
    type: "Fungal Pathogen",
    severityLevel: "High",
    severityScore: 78,
    badgeColor: "#ea580c",
    colorSignatures: { hueMin: 35, hueMax: 70, darknessThreshold: 0.38, spotRatioMin: 0.16 },
    symptoms: [
      "Olive-green to dark velvety brown spots on leaves with feathery margins",
      "Leaves turn yellow and drop early (severe defoliation)",
      "Scabby, corky, dark brown cracked lesions on apple fruit surface"
    ],
    rootCauses: [
      "Cool rainy spring weather (12°C - 20°C) with prolonged leaf wetness",
      "Overwintering ascopores in fallen leaf litter on the orchard floor",
      "Susceptible apple varieties (e.g., McIntosh, Red Delicious)"
    ],
    organicCures: [
      {
        name: "Sulfur 80% WDG",
        dosage: "3g to 5g per Liter of water",
        application: "Apply from green tip stage through petal fall."
      },
      {
        name: "Neem Oil 70% EC",
        dosage: "5ml per Liter of water",
        application: "Preventative bio-pesticide spray."
      }
    ],
    chemicalCures: [
      {
        name: "Captan 50% WP",
        dosage: "2.5g per Liter of water",
        application: "Standard protective fungicide spray prior to rain events."
      },
      {
        name: "Difenoconazole 25% EC",
        dosage: "0.5ml per Liter of water",
        application: "Curative systemic triazole fungicide within 48h of rain."
      }
    ],
    preventionProtocol: [
      "Rake and destroy fallen leaves in autumn or apply 5% urea spray to speed leaf decomposition.",
      "Prune trees to maintain open canopy structure.",
      "Plant scab-resistant cultivars (e.g., Enterprise, Liberty, Prima)."
    ]
  },
  {
    id: "rice_blast",
    crop: "Rice",
    diseaseName: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    type: "Fungal Pathogen",
    severityLevel: "Severe",
    severityScore: 92,
    badgeColor: "#b91c1c",
    colorSignatures: { hueMin: 30, hueMax: 65, darknessThreshold: 0.32, spotRatioMin: 0.20 },
    symptoms: [
      "Diamond/spindle-shaped lesions with gray-white centers and reddish-brown borders",
      "Nodal blast turning stem nodes black and prone to breaking",
      "Neck rot causing complete head loss ('blank panicles' or empty grains)"
    ],
    rootCauses: [
      "High nitrogen fertilizer application exceeding recommended levels",
      "Frequent dew periods, high humidity (>90%), and temperatures (25°C - 28°C)",
      "Low soil moisture stress (aerobic / dry soil conditions)"
    ],
    organicCures: [
      {
        name: "Pseudomonas fluorescens Bio-Control",
        dosage: "10g per Liter of water",
        application: "Seed treatment + foliar spray at tillering and panicle initiation."
      },
      {
        name: "Silicon Soil Amendment (Calcium Silicate)",
        dosage: "100kg - 200kg per hectare",
        application: "Enhances cell wall strength against fungal penetration."
      }
    ],
    chemicalCures: [
      {
        name: "Tricyclazole 75% WP",
        dosage: "0.6g per Liter of water",
        application: "Highly effective preventive melanin-synthesis inhibitor. Spray at boot stage."
      },
      {
        name: "Isoprothiolane 40% EC",
        dosage: "1.5ml per Liter of water",
        application: "Curative and systemic spray at early neck blast stage."
      },
      {
        name: "Kasugamycin 3% SL",
        dosage: "2ml per Liter of water",
        application: "Antibiotic fungicide spray."
      }
    ],
    preventionProtocol: [
      "Avoid excessive nitrogen fertilization; split nitrogen into multiple balanced applications.",
      "Maintain adequate water depth in paddy fields (5cm - 10cm continuous standing water).",
      "Burn or plow under infected crop stubble after harvest."
    ]
  },
  {
    id: "citrus_greening",
    crop: "Citrus (Orange/Lemon)",
    diseaseName: "Citrus Greening (Huanglongbing)",
    scientificName: "Candidatus Liberibacter asiaticus",
    type: "Bacterial Pathogen (Vectored by Asian Citrus Psyllid)",
    severityLevel: "Critical / Severe",
    severityScore: 95,
    badgeColor: "#991b1b",
    colorSignatures: { hueMin: 45, hueMax: 85, darknessThreshold: 0.25, spotRatioMin: 0.25 },
    symptoms: [
      "Asymmetrical yellow mottling (blotchy mottle) on leaves crossing leaf veins",
      "Small, narrow, upright leaves with zinc-deficiency-like symptoms",
      "Lopsided, small, bitter green fruit that fails to color properly",
      "Twig dieback and gradual root system decay"
    ],
    rootCauses: [
      "Transmission by Asian Citrus Psyllid (Diaphorina citri) insects feeding on young flushes",
      "Infected nursery rootstock or budwood grafting material"
    ],
    organicCures: [
      {
        name: "Psyllid Vector Control - Neem Oil + Insecticidal Soap",
        dosage: "10ml Neem oil + 5ml Soap per Liter",
        application: "Weekly spray during young shoot flushes to control psyllid vector."
      },
      {
        name: "Foliar Micronutrient Cocktail (Zinc + Iron + Manganese + Boron)",
        dosage: "2g Zinc Sulfate + 2g Ferrous Sulfate per Liter",
        application: "Frequent nutritional sprays to sustain tree vigor."
      }
    ],
    chemicalCures: [
      {
        name: "Imidacloprid 17.8% SL (Vector Control)",
        dosage: "0.5ml per Liter of water or soil drench",
        application: "Systemic insecticide to eliminate feeding psyllids."
      },
      {
        name: "Oxytetracycline / Streptomycin Trunk Injection (Where approved)",
        dosage: "Follow local agronomist prescription",
        application: "Direct antibiotic trunk injection for commercial orchards."
      }
    ],
    preventionProtocol: [
      "Use certified disease-free nursery stock from screenhouses.",
      "Eradicate infected trees immediately upon positive diagnostic testing.",
      "Deploy yellow sticky traps for psyllid monitoring."
    ]
  },
  {
    id: "healthy_leaf",
    crop: "General Crop",
    diseaseName: "Healthy & Vibrant Plant Leaf",
    scientificName: "Normal Physiological State",
    type: "No Pathogen Detected",
    severityLevel: "Healthy",
    severityScore: 0,
    badgeColor: "#10b981",
    colorSignatures: { hueMin: 80, hueMax: 150, darknessThreshold: 0.15, spotRatioMin: 0.02 },
    symptoms: [
      "Uniform green pigmentation across the leaf surface",
      "Intact leaf margins without necrotic spots or yellow halos",
      "Proper turgor pressure and crisp leaf texture",
      "Strong vein structure without discoloration"
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
      "Maintain consistent soil moisture and organic mulch cover.",
      "Monitor fields weekly for early insect or fungal vectors.",
      "Practice clean field sanitation."
    ]
  }
];

export const CROP_LIST = [
  "All Crops",
  "Tomato",
  "Potato",
  "Corn (Maize)",
  "Grape",
  "Apple",
  "Rice",
  "Citrus (Orange/Lemon)"
];
