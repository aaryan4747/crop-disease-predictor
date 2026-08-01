/**
 * Comprehensive Master Global Agricultural Pathology & Geography Database
 * Standardized with FAO, ICAR, World Crops Database, and RNLK Agricultural Geography Standards:
 * 1. Food Crops: Rice, Wheat, Maize, Millets (Jowar/Sorghum, Bajra, Ragi), Rye, Pulses (Gram, Tur)
 * 2. Cash Crops: Cotton, Jute, Sugarcane, Mustard Seed, Tobacco, Groundnut, Sesamum, Linseed
 * 3. Plantation Crops: Tea, Coffee, Spices (Cardamom, Chillies, Ginger, Turmeric), Coconut, Rubber
 * 4. Horticulture: Fruits (Apple, Mango, Banana, Watermelon, Citrus, Papaya, Pomegranate), Vegetables (Tomato, Brinjal, Okra, Onion)
 */

export const CROP_DISEASES = [
  // 1. CHILLI
  {
    id: "chilli_leaf_curl",
    crop: "Chilli (మిరప)",
    diseaseName: "Chilli Black Thrips & Leaf Curl (మిరప నల్ల తామర పురుగు & ఆకు ముడుత)",
    scientificName: "Thrips parvispinus & Scirtothrips dorsalis / Chilli Leaf Curl Virus",
    type: "Insect Vector & Viral Complex",
    severityLevel: "Critical",
    severityScore: 96,
    badgeColor: "#dc2626",
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
      }
    ],
    chemicalCures: [
      {
        name: "Coromandel Finio (Diafenthiuron + Pyriproxyfen)",
        dosage: "1.25ml per Liter of water + Coromandel Spreadmax (0.5ml/L)",
        application: "Coromandel Gromor recommended dual-action insecticide targeting nymph & adult Black Thrips.",
        phiDays: 7
      },
      {
        name: "Spinetoram 11.7% SC (Delegate) or Fipronil 5% SC",
        dosage: "1ml Spinetoram or 1.5ml Fipronil per Liter of water",
        application: "KVK recommended rotation spray targeting thrips underneath leaves.",
        phiDays: 5
      }
    ],
    preventionProtocol: [
      "Install 30 yellow and blue sticky traps per acre at crop height",
      "Avoid excess nitrogenous urea fertilizers which attract sucking pests"
    ],
    mineralDeficiency: "Nitrogen excess causes tender growth attracting sucking thrips. Balance with Potassium and Sulphur."
  },

  // 2. TOMATO
  {
    id: "tomato_late_blight",
    crop: "Tomato (టమోటా)",
    diseaseName: "Tomato Late Blight & Leaf Spot (టమోటా లేట్ బ్లైట్ & ఆకు మచ్చ తెగులు)",
    scientificName: "Phytophthora infestans & Alternaria solani",
    type: "Fungal Pathogen Complex",
    severityLevel: "Severe",
    severityScore: 94,
    badgeColor: "#dc2626",
    symptoms: [
      "Large dark brown to black water-soaked lesions on tomato leaves",
      "White fungal mold growth on the leaf underside during humid weather",
      "Stems developing dark brown rot patches leading to vine collapse"
    ],
    rootCauses: [
      "Excessive leaf moisture, high relative humidity (>85%), and cool temperatures (18°C-24°C)",
      "Airborne sporangia spores spread by rain splashes and wind"
    ],
    organicCures: [
      {
        name: "Copper Hydroxide 77% WP (Kocide @ 2.5g/L) + Trichoderma viride",
        dosage: "2.5g Copper Hydroxide + 5g Trichoderma per Liter water",
        application: "Spray during early morning hours to prevent fungal spore germination."
      }
    ],
    chemicalCures: [
      {
        name: "Syngenta Ridomil Gold (Mefenoxam 4% + Mancozeb 64% WP)",
        dosage: "2.0g to 2.5g per Liter of water",
        application: "Systemic protective spray targeting active Phytophthora late blight lesions.",
        phiDays: 14
      },
      {
        name: "Azoxystrobin 23% SC (Amistar) or Coromandel Jatayu (Chlorothalonil)",
        dosage: "1ml Azoxystrobin or 2g Chlorothalonil per Liter of water",
        application: "Rotate every 10 days to prevent fungal resistance.",
        phiDays: 7
      }
    ],
    preventionProtocol: [
      "Avoid overhead sprinkler irrigation; use drip lines under plastic mulch",
      "Remove and burn severely infected lower leaves"
    ],
    mineralDeficiency: "Calcium (Ca) deficiency causing Blossom End Rot and Nitrogen chlorosis."
  },

  // 3. WATERMELON & MELON
  {
    id: "watermelon_anthracnose",
    crop: "Watermelon (పుచ్చకాయ)",
    diseaseName: "Watermelon Anthracnose & Vine Wilt (పుచ్చకాయ నల్లమచ్చ తెగులు)",
    scientificName: "Colletotrichum orbiculare & Fusarium oxysporum",
    type: "Fungal Soil & Foliar Complex",
    severityLevel: "Severe",
    severityScore: 91,
    badgeColor: "#ea580c",
    symptoms: [
      "Dark brown circular water-soaked leaf spots drying out to shot-holes",
      "Sunken circular lesions with pinkish spore masses on watermelon rind",
      "Sudden vine wilting during fruit bulking stage"
    ],
    rootCauses: [
      "Warm rainy weather (24°C-30°C) with prolonged leaf wetness"
    ],
    organicCures: [
      {
        name: "Trichoderma Viride Bio-Fungicide + Copper Hydroxide",
        dosage: "5g Trichoderma drenching + 2.5g Kocide per Liter water",
        application: "Drench vine root zone at 20 and 40 days after planting."
      }
    ],
    chemicalCures: [
      {
        name: "Azoxystrobin 23% SC (Amistar) or Coromandel Jatayu",
        dosage: "1ml Azoxystrobin or 2g Chlorothalonil per Liter of water",
        application: "Foliar spray prior to canopy closure.",
        phiDays: 7
      }
    ],
    preventionProtocol: [
      "Use drip irrigation lines under silver-black plastic mulch"
    ],
    mineralDeficiency: "Calcium (Ca) deficiency causes blossom end rot and rind cracking."
  },

  // 4. RICE / PADDY
  {
    id: "rice_blast",
    crop: "Rice (వరి)",
    diseaseName: "Rice Blast & Sheath Blight (వరి అగ్గి తెగులు & పొట్ట కుళ్ళు తెగులు)",
    scientificName: "Pyricularia oryzae & Rhizoctonia solani",
    type: "Fungal Pathogen Complex",
    severityLevel: "Severe",
    severityScore: 94,
    badgeColor: "#dc2626",
    symptoms: [
      "Spindle-shaped diamond spots with ash-gray center and brown margins on leaf",
      "Node rot leading to stem breakage and empty white panicles ('Neck Blast')"
    ],
    rootCauses: [
      "Cool night temperatures (20°C-24°C) with high relative humidity (>90%) and dew"
    ],
    organicCures: [
      {
        name: "Pseudomonas fluorescens 1% WP",
        dosage: "10g per Liter of water (Foliar spray)",
        application: "Spray at tillering and panicle emergence stages."
      }
    ],
    chemicalCures: [
      {
        name: "Tricyclazole 75% WP (Baan / Beam) or Bayer Nativo",
        dosage: "0.6g Tricyclazole or 0.75g Nativo per Liter of water",
        application: "Preventative spray at panicle initiation stage.",
        phiDays: 21
      }
    ],
    preventionProtocol: [
      "Avoid split nitrogen applications during cloudy cool weather"
    ],
    mineralDeficiency: "Silicon (Si) deficiency reduces leaf cuticle resistance to fungal hyphae."
  },

  // 5. BANANA
  {
    id: "banana_sigatoka",
    crop: "Banana (అరటి)",
    diseaseName: "Banana Sigatoka Leaf Spot & Panama Wilt (అరటి సిగటోకా తెగులు)",
    scientificName: "Mycosphaerella musicola / Fusarium oxysporum",
    type: "Fungal Vascular & Foliar Disease",
    severityLevel: "Severe",
    severityScore: 89,
    badgeColor: "#ea580c",
    symptoms: [
      "Pale yellow-green streaks parallel to leaf veins turning dark brown",
      "Large necrotic areas drying out leaf canopy reducing bunch size"
    ],
    rootCauses: [
      "High humidity (>80%), frequent rainfall, and stagnant field water"
    ],
    organicCures: [
      {
        name: "Horticultural Mineral Oil (10ml/L) + Pseudomonas fluorescens",
        dosage: "10ml Mineral oil + 10g Pseudomonas per Liter water",
        application: "Monthly foliar emulsion spray targeting lower leaf surfaces."
      }
    ],
    chemicalCures: [
      {
        name: "Propiconazole 25% EC (Tilt @ 1ml/L) + Mineral Oil (10ml/L)",
        dosage: "1ml Propiconazole + 10ml Mineral Spray Oil per Liter water",
        application: "Foliar emulsified spray during monsoon season.",
        phiDays: 30
      }
    ],
    preventionProtocol: [
      "De-trash infected lower yellow leaves monthly and burn outside field"
    ],
    mineralDeficiency: "Potassium (K) deficiency causing leaf tip firing and reduced bunch weight."
  },

  // 6. MANGO
  {
    id: "mango_anthracnose",
    crop: "Mango (మామిడి)",
    diseaseName: "Mango Anthracnose & Powdery Mildew (మామిడి నల్లమచ్చ & బూడిద తెగులు)",
    scientificName: "Colletotrichum gloeosporioides & Oidium mangiferae",
    type: "Fungal Inflorescence & Fruit Pathogen",
    severityLevel: "Severe",
    severityScore: 90,
    badgeColor: "#dc2626",
    symptoms: [
      "Black angular necrotic spots on tender young mango leaves and shoots",
      "White powdery growth on flowering panicles causing severe blossom drop"
    ],
    rootCauses: [
      "Cloudy humid weather and rain showers during flowering stage"
    ],
    organicCures: [
      {
        name: "Wettable Sulphur 80% WP + Neem Oil",
        dosage: "3g Sulphur + 3ml Neem Oil per Liter of water",
        application: "Spray before flower bud opening."
      }
    ],
    chemicalCures: [
      {
        name: "Hexaconazole 5% EC (Contaf @ 2ml/L) or Bayer Nativo",
        dosage: "2ml Hexaconazole or 0.75g Nativo per Liter of water",
        application: "Spray at flower panicle emergence and fruit set stage.",
        phiDays: 14
      }
    ],
    preventionProtocol: [
      "Prune criss-cross branches to allow sunlight penetration into canopy"
    ],
    mineralDeficiency: "Boron (B) deficiency causing internal fruit necrosis and seed cracking."
  },

  // 7. COTTON
  {
    id: "cotton_pink_bollworm",
    crop: "Cotton (ప్రత్తి)",
    diseaseName: "Cotton Pink Bollworm & Alternaria Spot (ప్రత్తి గులాబీ రంగు పురుగు & ఆకు మచ్చ)",
    scientificName: "Pectinophora gossypiella & Alternaria macrospora",
    type: "Insect Pest & Fungal Complex",
    severityLevel: "Critical",
    severityScore: 95,
    badgeColor: "#dc2626",
    symptoms: [
      "Rosetted pinkish flowers that fail to open properly",
      "Bore holes in green bolls plugged with larval excreta"
    ],
    rootCauses: [
      "Staggered sowing and late season cotton crop extension"
    ],
    organicCures: [
      {
        name: "Pheromone Traps (Pectino-lure) + Trichogramma Wasps",
        dosage: "Install 8 Pheromone traps/acre + 60,000 egg cards",
        application: "Biological egg parasitoid release at flower initiation."
      }
    ],
    chemicalCures: [
      {
        name: "Profenofos 50% EC or Chlorantraniliprole 18.5% SC (Coragen)",
        dosage: "2ml Profenofos or 0.4ml Coragen per Liter of water",
        application: "Foliar spray at peak moth catch threshold.",
        phiDays: 14
      }
    ],
    preventionProtocol: [
      "Destroy crop stubble and avoid ratoon cotton cultivation"
    ],
    mineralDeficiency: "Magnesium (Mg) deficiency causes reddening of cotton leaves."
  },

  // 8. BRINJAL
  {
    id: "brinjal_borer",
    crop: "Brinjal / Eggplant (వంకాయ)",
    diseaseName: "Brinjal Fruit & Shoot Borer (వంకాయ కాండం & కాయ తొలుచు పురుగు)",
    scientificName: "Leucinodes orbonalis",
    type: "Lepidopteran Insect Pest",
    severityLevel: "Critical",
    severityScore: 92,
    badgeColor: "#dc2626",
    symptoms: [
      "Withered and drooping tender shoot tips in young brinjal plants",
      "Bore holes in brinjal fruits filled with larval frass"
    ],
    rootCauses: [
      "High humidity and warm temperatures favoring moth oviposition"
    ],
    organicCures: [
      {
        name: "Pheromone Traps (Lucin-lure) + Bt",
        dosage: "Install 12 Pheromone traps/acre + Bt @ 2g/L water",
        application: "Attracts male moths and destroys young larvae."
      }
    ],
    chemicalCures: [
      {
        name: "Emamectin Benzoate 5% SG (Proclaim @ 0.5g/L) or Coromandel Finio",
        dosage: "0.5g Emamectin Benzoate per Liter of water",
        application: "Foliar spray at 15-day intervals.",
        phiDays: 5
      }
    ],
    preventionProtocol: [
      "Clip off and destroy wilted shoot tips weekly"
    ],
    mineralDeficiency: "Potassium deficiency causing leaf tip marginal burning."
  },

  // 9. OKRA
  {
    id: "okra_yellow_vein",
    crop: "Okra / Lady's Finger (బెండకాయ)",
    diseaseName: "Okra Yellow Vein Mosaic (బెండ పసుపు మోజాయిక్ తెగులు)",
    scientificName: "Bhendi Yellow Vein Mosaic Virus (BYVMV)",
    type: "Viral Disease (Whitefly Vector)",
    severityLevel: "Severe",
    severityScore: 90,
    badgeColor: "#ea580c",
    symptoms: [
      "Yellowing of leaf veins forming a bright yellow network",
      "Stunted plant growth and small yellowed okra pods"
    ],
    rootCauses: [
      "Whitefly (*Bemisia tabaci*) vector transmitting Gemini virus"
    ],
    organicCures: [
      {
        name: "Neem Seed Kernel Extract 5% (NSKE 50ml/L) + Yellow Sticky Traps",
        dosage: "50ml NSKE/L + Install 25 yellow sticky traps per acre",
        application: "Target whitefly vector populations on leaf undersides."
      }
    ],
    chemicalCures: [
      {
        name: "Acetamiprid 20% SP or Coromandel Finio",
        dosage: "0.5g Acetamiprid or 1.25ml Finio per Liter water",
        application: "Spray at early onset of whitefly vectors.",
        phiDays: 7
      }
    ],
    preventionProtocol: [
      "Use virus-resistant okra varieties like Arka Anamika or Samrat"
    ],
    mineralDeficiency: "Nitrogen and Iron deficiency causing interveinal yellowing."
  },

  // 10. ONION & GARLIC
  {
    id: "onion_purple_blotch",
    crop: "Onion / Garlic (ఉల్లిపాయ / వెల్లుల్లి)",
    diseaseName: "Onion Purple Blotch & Stemphylium Blight (ఉల్లి ఊదా రంగు మచ్చ తెగులు)",
    scientificName: "Alternaria porri & Stemphylium vesicarium",
    type: "Fungal Foliar Pathogen",
    severityLevel: "Severe",
    severityScore: 88,
    badgeColor: "#ea580c",
    symptoms: [
      "Small white sunken spots on leaves developing purple centers",
      "Leaves girdled, falling over, and drying prematurely before bulb maturity"
    ],
    rootCauses: [
      "High relative humidity (>80%) and warm humid winds"
    ],
    organicCures: [
      {
        name: "Trichoderma viride + Neem Oil 10,000 PPM",
        dosage: "5g Trichoderma + 3ml Neem oil per Liter water",
        application: "Spray at 15-day intervals during leaf growth."
      }
    ],
    chemicalCures: [
      {
        name: "Mancozeb 75% WP (M-45 @ 2.5g/L) or Tebuconazole (Folicur)",
        dosage: "2.5g Mancozeb or 1ml Tebuconazole per Liter of water",
        application: "Add 1ml silicone sticker (Spreadmax) per liter of spray.",
        phiDays: 14
      }
    ],
    preventionProtocol: [
      "Avoid close plant spacing; ensure proper field drainage"
    ],
    mineralDeficiency: "Potassium deficiency reduces onion bulb shelf life."
  },

  // 11. PAPAYA
  {
    id: "papaya_ring_spot",
    crop: "Papaya (బొప్పాయి)",
    diseaseName: "Papaya Ring Spot Virus & Anthracnose (బొప్పాయి రింగ్ స్పాట్ వైరస్ & కాయ మచ్చ)",
    scientificName: "Papaya Ringspot Virus (PRSV) & Colletotrichum gloeosporioides",
    type: "Viral & Fungal Pathogen",
    severityLevel: "Critical",
    severityScore: 93,
    badgeColor: "#dc2626",
    symptoms: [
      "Yellow mosaic mottle and shoe-string distortion on papaya leaves",
      "Dark green oily streaks on leaf petioles and trunk",
      "Concentric ring spots on green and ripening papaya fruits"
    ],
    rootCauses: [
      "Aphid insect vectors transmitting potyvirus from weed hosts"
    ],
    organicCures: [
      {
        name: "Micronutrient Foliar Spray + Yellow Sticky Traps",
        dosage: "2g Zinc + 1g Boron per Liter water + 25 traps/acre",
        application: "Boost plant immunity and control aphid vector populations."
      }
    ],
    chemicalCures: [
      {
        name: "Imidacloprid 17.8% SL (0.5ml/L) + Copper Oxychloride (Blitox 3g/L)",
        dosage: "0.5ml Imidacloprid + 3g Blitox per Liter of water",
        application: "Target aphid vectors and fruit anthracnose spots.",
        phiDays: 7
      }
    ],
    preventionProtocol: [
      "Plant border rows of Maize or Sorghum around papaya orchard"
    ],
    mineralDeficiency: "Boron (B) deficiency causes bumpy, deformed papaya fruits with latex bleeding."
  },

  // 12. CITRUS
  {
    id: "citrus_canker",
    crop: "Citrus / Lemon (నిమ్మ / నారింజ)",
    diseaseName: "Citrus Canker & Gummosis (నిమ్మ పిడుదు / కాన్కర్ తెగులు)",
    scientificName: "Xanthomonas citri subsp. citri & Phytophthora spp.",
    type: "Bacterial & Oomycete Pathogen",
    severityLevel: "Severe",
    severityScore: 89,
    badgeColor: "#ea580c",
    symptoms: [
      "Raised corky brown scab lesions surrounded by yellow halos on leaves and fruits",
      "Gum oozing from bark cracks at trunk base (Gummosis)"
    ],
    rootCauses: [
      "Bacterial ingress through leaf miner feeding wounds during rain storms"
    ],
    organicCures: [
      {
        name: "Bordeaux Mixture 1% (Copper Sulphate + Lime)",
        dosage: "10g Copper Sulphate + 10g Lime per Liter of water",
        application: "Spray after pruning dead twigs."
      }
    ],
    chemicalCures: [
      {
        name: "Streptocycline (100 PPM) + Copper Oxychloride (Blitox 3g/L)",
        dosage: "1g Streptocycline per 10 Liters + 3g Blitox per Liter water",
        application: "Spray at new flush emergence and after monsoon rains.",
        phiDays: 15
      }
    ],
    preventionProtocol: [
      "Control Citrus Leaf Miner insect using Abamectin to prevent entry wounds"
    ],
    mineralDeficiency: "Zinc (Zn) deficiency causes mottle leaf (interveinal yellowing) in citrus."
  },

  // 13. POTATO
  {
    id: "potato_early_late_blight",
    crop: "Potato (బంగాళదుంప)",
    diseaseName: "Potato Early & Late Blight (బంగాళదుంప లేట్ బ్లైట్ తెగులు)",
    scientificName: "Phytophthora infestans & Alternaria solani",
    type: "Fungal Foliar Pathogen",
    severityLevel: "Critical",
    severityScore: 95,
    badgeColor: "#dc2626",
    symptoms: [
      "Purplish-black water-soaked leaf margins drying to brown paper texture",
      "Target-board concentric brown rings on potato leaves (Early Blight)"
    ],
    rootCauses: [
      "High humidity (>90%) with cool misty weather"
    ],
    organicCures: [
      {
        name: "Copper Hydroxide 77% WP (Kocide @ 2.5g/L)",
        dosage: "2.5g per Liter of water",
        application: "Preventative foliar spray prior to canopy row closure."
      }
    ],
    chemicalCures: [
      {
        name: "Syngenta Ridomil Gold (Mefenoxam + Mancozeb @ 2.5g/L)",
        dosage: "2.5g per Liter of water",
        application: "Apply at first sign of late blight lesions.",
        phiDays: 14
      }
    ],
    preventionProtocol: [
      "Use certified disease-free seed tubers"
    ],
    mineralDeficiency: "Potassium (K) deficiency causes leaf tip bronzing."
  },

  // 14. POMEGRANATE
  {
    id: "pomegranate_bacterial_blight",
    crop: "Pomegranate (దానిమ్మ)",
    diseaseName: "Pomegranate Bacterial Oily Spot / Telya (దానిమ్మ మచ్చ తెగులు - తేలియా)",
    scientificName: "Xanthomonas axonopodis pv. punicae",
    type: "Bacterial Vascular & Fruit Disease",
    severityLevel: "Critical",
    severityScore: 97,
    badgeColor: "#dc2626",
    symptoms: [
      "Dark brown water-soaked translucent oily spots on leaves and branches",
      "L-shaped or Y-shaped cracks on pomegranate fruits oozing bacterial fluid"
    ],
    rootCauses: [
      "Rain splashes, high humidity, and wind-blown bacterial droplets during monsoon"
    ],
    organicCures: [
      {
        name: "Bactericide Bio-Spray + Streptomyces bio-agent",
        dosage: "2g Bio-bactericide per Liter of water",
        application: "Spray after Hasta or Mrig bahar pruning."
      }
    ],
    chemicalCures: [
      {
        name: "Streptocycline (500 PPM) + Copper Hydroxide (Kocide 2g/L) + Bronopol (2g/L)",
        dosage: "0.5g Streptocycline + 2g Kocide + 0.5g Bronopol per Liter water",
        application: "Spray at 10-day intervals during rainy spells.",
        phiDays: 20
      }
    ],
    preventionProtocol: [
      "Paste cut ends with Bordeaux paste (10%) after pruning"
    ],
    mineralDeficiency: "Boron and Calcium deficiency causes fruit aril cracking."
  },

  // 15. MAIZE
  {
    id: "maize_fall_armyworm",
    crop: "Maize / Corn (మొక్కజొన్న)",
    diseaseName: "Maize Fall Armyworm & Common Rust (మొక్కజొన్న కత్తెర పురుగు & తుప్పు తెగులు)",
    scientificName: "Spodoptera frugiperda & Puccinia sorghi",
    type: "Lepidopteran Pest & Fungal Complex",
    severityLevel: "Severe",
    severityScore: 93,
    badgeColor: "#dc2626",
    symptoms: [
      "Ragged pinholes and extensive leaf whorl damage packed with frass",
      "Larvae with Y-shaped mark on head feeding inside maize cob whorl"
    ],
    rootCauses: [
      "Warm dry weather favoring rapid armyworm moth migration"
    ],
    organicCures: [
      {
        name: "Metarhizium anisopliae or Sand-Neem Cake Whorl Application",
        dosage: "5g Metarhizium or 10g Sand-Neem cake mix into plant whorl",
        application: "Directly drop into maize leaf whorls."
      }
    ],
    chemicalCures: [
      {
        name: "Chlorantraniliprole 18.5% SC (Coragen) or Spinetoram 11.7% SC",
        dosage: "0.4ml Coragen or 0.5ml Spinetoram per Liter of water",
        application: "Direct nozzle spray inside central plant leaf whorl.",
        phiDays: 14
      }
    ],
    preventionProtocol: [
      "Intercrop maize with cowpea to push-pull armyworm moths"
    ],
    mineralDeficiency: "Zinc (Zn) deficiency causes 'White Bud' disease in maize."
  },

  // 16. GROUNDNUT
  {
    id: "groundnut_tikka",
    crop: "Groundnut (వేరుశనగ)",
    diseaseName: "Groundnut Tikka Leaf Spot & Stem Rot (వేరుశనగ తిక్కా ఆకు మచ్చ తెగులు)",
    scientificName: "Cercospora arachidicola & Sclerotium rolfsii",
    type: "Fungal Foliar & Root Disease",
    severityLevel: "Severe",
    severityScore: 89,
    badgeColor: "#ea580c",
    symptoms: [
      "Dark circular leaf spots with bright yellow halos causing leaf drop",
      "White cottony fungal mycelium at soil collar region causing stem rot"
    ],
    rootCauses: [
      "High humidity with warm soil temperatures (28°C-32°C)"
    ],
    organicCures: [
      {
        name: "Trichoderma viride + Vermicompost Soil Treatment",
        dosage: "2kg Trichoderma mixed in 100kg Vermicompost per acre",
        application: "Apply at sowing and basal fertilizer stage."
      }
    ],
    chemicalCures: [
      {
        name: "UPL SAAF (Carbendazim 12% + Mancozeb 63% WP) or Bayer Nativo",
        dosage: "2.0g SAAF or 0.75g Nativo per Liter of water",
        application: "Foliar spray at 35 and 50 days after sowing.",
        phiDays: 14
      }
    ],
    preventionProtocol: [
      "Treat groundnut seeds with Mancozeb 3g/kg seed before sowing"
    ],
    mineralDeficiency: "Calcium (Ca) deficiency causes 'Pop Pods' (empty groundnut shells)."
  },

  // 17. PULSES & LEGUMES (CHICKPEA / RED GRAM)
  {
    id: "pulses_wilt_podborer",
    crop: "Pulses / Red Gram / Chickpea (కందులు / శనగ)",
    diseaseName: "Pulses Fusarium Wilt & Helicoverpa Pod Borer (కంది వడలు తెగులు & కాయ తొలుచు పురుగు)",
    scientificName: "Fusarium udum & Helicoverpa armigera",
    type: "Soil Fungal & Insect Pest Complex",
    severityLevel: "Severe",
    severityScore: 92,
    badgeColor: "#dc2626",
    symptoms: [
      "Interveinal yellowing and sudden wilting of adult pigeon pea branches",
      "Bore holes in green pods with larvae feeding with head inside pod",
      "Black vascular discoloration inside split stem wood"
    ],
    rootCauses: [
      "Soil-borne Fusarium chlamydospores persisting in dry soils"
    ],
    organicCures: [
      {
        name: "Trichoderma harzianum + HaNPV (Helicoverpa Nuclear Polyhedrosis Virus)",
        dosage: "5g Trichoderma soil drench + 250 LE HaNPV spray per acre",
        application: "Apply NPV spray during early larval instar emergence."
      }
    ],
    chemicalCures: [
      {
        name: "Flubendiamide 39.35% SC (Fame @ 0.2ml/L) or Chlorantraniliprole (Coragen)",
        dosage: "0.2ml Flubendiamide or 0.4ml Coragen per Liter water",
        application: "Foliar spray at 50% flowering stage.",
        phiDays: 10
      }
    ],
    preventionProtocol: [
      "Intercrop redgram with sorghum in 1:4 ratio to reduce pod borer egg laying"
    ],
    mineralDeficiency: "Molybdenum (Mo) deficiency impairs Rhizobium root nodule nitrogen fixation."
  },

  // 18. SPICES (TURMERIC & GINGER)
  {
    id: "turmeric_rhizome_rot",
    crop: "Turmeric / Ginger (పసుపు / అల్లం)",
    diseaseName: "Turmeric Leaf Blotch & Ginger Rhizome Rot (పసుపు ఆకు మచ్చ & అల్లం దుంప కుళ్ళు)",
    scientificName: "Taphrina maculans & Pythium aphanidermatum",
    type: "Soil Oomycete & Foliar Fungal Complex",
    severityLevel: "Critical",
    severityScore: 94,
    badgeColor: "#dc2626",
    symptoms: [
      "Small reddish-brown spots on upper and lower surfaces of turmeric leaves",
      "Water-soaked brown rotting of ginger pseudostem base pulling out easily",
      "Foul smelling soft decay of subterranean rhizomes"
    ],
    rootCauses: [
      "Waterlogging, poor soil drainage, and heavy monsoon rains"
    ],
    organicCures: [
      {
        name: "Trichoderma harzianum + Pseudomonas Soil Drenching",
        dosage: "10g Trichoderma + 10g Pseudomonas per Liter water",
        application: "Soil drenching around plant hills every 20 days during monsoon."
      }
    ],
    chemicalCures: [
      {
        name: "Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold @ 2.5g/L)",
        dosage: "2.5g per Liter water (Soil drenching + Foliar spray)",
        application: "Drench 100-150ml solution per clump at first sign of soft rot.",
        phiDays: 21
      }
    ],
    preventionProtocol: [
      "Plant on raised beds (30cm height) with broad drainage channels",
      "Treat seed rhizomes with Mancozeb 3g/L for 30 minutes before planting"
    ],
    mineralDeficiency: "Fe & Mn deficiency causes interveinal chlorosis in young leaves."
  },

  // 19. WHEAT RUST
  {
    id: "wheat_rust",
    crop: "Wheat (గోధుమ)",
    diseaseName: "Wheat Rust & Leaf Stripe (గోధుమ తుప్పు తెగులు)",
    scientificName: "Puccinia striiformis & Puccinia triticina",
    type: "Fungal Spore Complex",
    severityLevel: "Severe",
    severityScore: 92,
    badgeColor: "#dc2626",
    symptoms: [
      "Bright yellow and orange pustule stripes running parallel along wheat leaf blades",
      "Powdery yellow spores rubbing off easily on fingers when touching leaves"
    ],
    rootCauses: [
      "Cool moist weather (10°C-20°C) with prolonged dew periods during early spring",
      "Airborne urediniospores blown across regions by wind currents"
    ],
    organicCures: [
      {
        name: "5% Neem Leaf Extract + Fermented Sour Butter Milk Spray",
        dosage: "50ml Neem extract + 20ml sour curd whey per Liter of water",
        application: "Foliar spray to suppress spore germination on leaf blades."
      }
    ],
    chemicalCures: [
      {
        name: "Propiconazole 25% EC (Tilt) or Tebuconazole 25.9% EC (Folicur)",
        dosage: "1.0 ml per Liter of water",
        application: "KVK recommended systemic spray at first appearance of yellow rust stripes.",
        phiDays: 30
      }
    ],
    preventionProtocol: [
      "Sow certified rust-resistant varieties recommended by ICAR-IARI",
      "Avoid late sowing and excessive nitrogenous fertilizer application"
    ],
    mineralDeficiency: "Potassium deficiency increases cell wall permeability to rust fungal germ tubes."
  },

  // 20. SUGARCANE RED ROT
  {
    id: "sugarcane_red_rot",
    crop: "Sugarcane (చెరకు)",
    diseaseName: "Sugarcane Red Rot (చెరకు ఎర్రకుళ్లు తెగులు)",
    scientificName: "Colletotrichum falcatum",
    type: "Fungal Systemic Pathogen",
    severityLevel: "Critical",
    severityScore: 97,
    badgeColor: "#dc2626",
    symptoms: [
      "Third or fourth leaf from crown showing yellowing and drying along margins",
      "Reddening of internal stalk pith tissue with distinct transverse white patches",
      "Stalk emitting an alcoholic sour fermentation odor when split open"
    ],
    rootCauses: [
      "Infected setts used for planting combined with waterlogging during monsoon",
      "Pathogen surviving in crop debris and transmitted by irrigation water"
    ],
    organicCures: [
      {
        name: "Trichoderma harzianum Sett Treatment + Pseudomonas fluorescens",
        dosage: "10 grams Trichoderma + 10 grams Pseudomonas per Liter of water",
        application: "Soak sugarcane setts for 30 minutes prior to planting."
      }
    ],
    chemicalCures: [
      {
        name: "Carbendazim 50% WP (Bavistin) Sett Dip Treatment",
        dosage: "2.0 grams per Liter of water",
        application: "Dip setts for 15 minutes before planting to eliminate seed-borne inoculum.",
        phiDays: 45
      }
    ],
    preventionProtocol: [
      "Use certified disease-free setts from nursery seed plots",
      "Adopt 2-year crop rotation with non-host crops like paddy or pulses"
    ],
    mineralDeficiency: "Potash and Calcium deficiency weakens rind hardness, aiding fungal hyphae penetration."
  },

  // 21. HEALTHY LEAF (ALL CROPS)
  {
    id: "healthy_leaf",
    crop: "General Crop (అన్ని రకాల పంటలు)",
    diseaseName: "Healthy Plant Leaf (ఆరోగ్యకరమైన ఆకు)",
    scientificName: "Normal Physiological State",
    type: "No Pathogen Detected",
    severityLevel: "Healthy",
    severityScore: 0,
    badgeColor: "#10b981",
    symptoms: [
      "Uniform green pigmentation across the leaf surface"
    ],
    rootCauses: [
      "Optimal soil moisture and balanced nutrition"
    ],
    organicCures: [
      {
        name: "Seaweed Extract Foliar Spray (IFFCO Sagarika)",
        dosage: "2ml per Liter of water",
        application: "Monthly bio-stimulant spray."
      }
    ],
    chemicalCures: [
      {
        name: "Balanced N-P-K (19-19-19) or IFFCO Nano Urea",
        dosage: "3g 19-19-19 or 2ml Nano Urea per Liter water",
        application: "Apply every 15-20 days for vegetative growth.",
        phiDays: 0
      }
    ],
    preventionProtocol: [
      "Maintain consistent soil moisture and weed-free field"
    ],
    mineralDeficiency: "No deficiencies detected. Maintain balanced fertilization."
  }
];

export const CROP_LIST = [
  "All Crops (అన్ని పంటలు)",
  "Chilli (మిరప)",
  "Tomato (టమోటా)",
  "Rice (వరి)",
  "Watermelon (పుచ్చకాయ)",
  "Banana (అరటి)",
  "Mango (మామిడి)",
  "Cotton (ప్రత్తి)",
  "Brinjal / Eggplant (వంకాయ)",
  "Okra / Lady's Finger (బెండకాయ)",
  "Onion / Garlic (ఉల్లిపాయ)",
  "Papaya (బొప్పాయి)",
  "Citrus / Lemon (నిమ్మ / నారింజ)",
  "Potato (బంగాళదుంప)",
  "Pomegranate (దానిమ్మ)",
  "Maize / Corn (మొక్కజొన్న)",
  "Groundnut (వేరుశనగ)",
  "Pulses / Red Gram / Chickpea (కందులు / శనగ)",
  "Turmeric / Ginger (పసుపు / అల్లం)",
  "Wheat (గోధుమ)",
  "Sugarcane (చెరకు)"
];
