/**
 * Soil N-P-K, pH & Crop Profit Recommendation Engine
 * Recommends best crops, expected profit (₹/acre), and stage-wise fertilizer plans
 */

export function recommendBestCropFromSoil({ ph = 6.8, nitrogen = 140, phosphorus = 45, potassium = 180, rainfallMm = 850 }) {
  let recommendedCrop = "Chilli (మిరప)";
  let expectedProfitPerAcre = "₹1,85,000 – ₹2,40,000";
  let fertilizerPlan = [
    "Basal: Gromor 20-20-0-13 @ 50kg/acre + Neem Cake 100kg",
    "Vegetative: 19-19-19 Foliar spray @ 3g/L + Nano Urea",
    "Fruiting: 13-0-45 (Potassium Nitrate) @ 5g/L + Boron 20%"
  ];

  if (ph >= 6.0 && ph <= 7.5 && rainfallMm > 1000) {
    recommendedCrop = "Rice / Paddy (వరి)";
    expectedProfitPerAcre = "₹65,000 – ₹90,000";
    fertilizerPlan = [
      "Basal: DAP @ 50kg + Zinc Sulphate @ 10kg/acre",
      "Tillering: Urea @ 35kg + Neem oil spray",
      "Panicle Emergence: MOP (Potash) @ 25kg/acre"
    ];
  } else if (ph >= 5.8 && ph <= 7.2 && potassium > 150) {
    recommendedCrop = "Watermelon (పుచ్చకాయ)";
    expectedProfitPerAcre = "₹1,20,000 – ₹1,75,000";
    fertilizerPlan = [
      "Basal: SSP 100kg + Vermicompost 2 Tons + Trichoderma",
      "Vining: 12-61-0 (MAP) Drip fertigation @ 3kg/acre",
      "Fruit Bulking: 0-0-50 (SOP) @ 4kg/acre for high brix sweetness"
    ];
  } else if (nitrogen > 150) {
    recommendedCrop = "Cotton (ప్రత్తి)";
    expectedProfitPerAcre = "₹95,000 – ₹1,40,000";
    fertilizerPlan = [
      "Basal: 28-28-0 @ 50kg/acre",
      "Squaring: Magnesium Sulphate @ 10kg + Boron 1g/L",
      "Boll Development: 13-0-45 @ 5g/L foliar spray"
    ];
  }

  return {
    recommendedCrop,
    expectedProfitPerAcre,
    fertilizerPlan,
    suitabilityScore: 94
  };
}
