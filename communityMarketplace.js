/**
 * Farmer Community Photo Gallery, Q&A Chat, and Agri Marketplace Store Locator
 */

export const COMMUNITY_POSTS = [
  {
    farmerName: "K. Venkateswara Rao",
    location: "Tenali, Guntur",
    crop: "Chilli (మిరప)",
    timeAgo: "2 hours ago",
    comment: "Used Coromandel Finio (1.25ml/L) + Blue sticky traps for Black Thrips. Got 95% recovery in 5 days!",
    rating: "⭐⭐⭐⭐⭐ (5/5 Effectiveness)",
    likes: 42
  },
  {
    farmerName: "M. Koti Reddy",
    location: "Narasaraopet, Palnadu",
    crop: "Watermelon (పుచ్చకాయ)",
    timeAgo: "5 hours ago",
    comment: "Syngenta Amistar (1ml/L) completely stopped Anthracnose leaf spots. Rind is clean now.",
    rating: "⭐⭐⭐⭐⭐ (5/5 Effectiveness)",
    likes: 38
  }
];

export const MARKETPLACE_STORES = [
  {
    storeName: "Sri Lakshmi Agronomy Store",
    dealerName: "K. Ramaiah",
    location: "Guntur Market Yard, AP",
    phone: "98480 12345",
    products: ["Coromandel Finio", "Syngenta Ridomil Gold", "Bayer Nativo", "IFFCO Sagarika"],
    discount: "10% Kisan Discount Available"
  },
  {
    storeName: "Raaitu Seva Kendra",
    dealerName: "Government Agri Center",
    location: "Warangal Town, TS",
    phone: "1800-180-1551",
    products: ["Coragen", "Profenofos", "Blue Sticky Traps", "Pheromone Traps"],
    discount: "Subsidized Government Rates"
  }
];

export function renderCommunityGallery(containerId) {
  const elem = document.getElementById(containerId);
  if (!elem) return;
  elem.innerHTML = COMMUNITY_POSTS.map(p => `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:1.15rem; margin-bottom:1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
        <div style="font-weight:800; font-size:1rem; color:#0f172a;">👨‍🌾 ${p.farmerName} (${p.location})</div>
        <div style="font-size:0.78rem; color:#64748b;">${p.timeAgo}</div>
      </div>
      <div style="font-size:0.82rem; font-weight:700; color:var(--primary-emerald); margin-bottom:0.4rem;">Crop: ${p.crop} • ${p.rating}</div>
      <div style="font-size:0.9rem; color:#334155; line-height:1.5;">"${p.comment}"</div>
      <div style="margin-top:0.5rem; font-size:0.8rem; color:#0284c7; font-weight:700; cursor:pointer;">👍 ${p.likes} Farmers Found This Helpful</div>
    </div>
  `).join('');
}

export function renderMarketplaceStores(containerId) {
  const elem = document.getElementById(containerId);
  if (!elem) return;
  elem.innerHTML = MARKETPLACE_STORES.map(s => `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:1.15rem; margin-bottom:1rem; border-top:4px solid var(--primary-emerald);">
      <div style="font-weight:800; font-size:1.1rem; color:#0f172a;">🏪 ${s.storeName}</div>
      <div style="font-size:0.85rem; color:#64748b; margin-bottom:0.4rem;">Dealer: ${s.dealerName} • 📍 ${s.location}</div>
      <div style="font-size:0.88rem; margin-bottom:0.4rem;"><strong>Certified Stock:</strong> ${s.products.join(', ')}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
        <span style="font-weight:700; font-size:0.82rem; color:#dc2626;">🏷️ ${s.discount}</span>
        <a href="tel:${s.phone.replace(/[^0-9]/g, '')}" style="background:var(--primary-emerald); color:#ffffff; padding:0.3rem 0.8rem; border-radius:8px; text-decoration:none; font-size:0.8rem; font-weight:700;">📞 Call Store (${s.phone})</a>
      </div>
    </div>
  `).join('');
}
