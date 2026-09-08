export const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Products", icon: "Sparkles" },
  { id: "home-living", name: "Home & Living", icon: "Home" },
  { id: "personal-care", name: "Personal Care", icon: "Smile" },
  { id: "kitchen-dining", name: "Kitchen & Dining", icon: "Coffee" },
  { id: "fashion-accessories", name: "Fashion & Accessories", icon: "ShoppingBag" },
  { id: "zero-waste", name: "Zero Waste Stationery", icon: "Leaf" },
  { id: "organic-foods", name: "Organic Pantry", icon: "Apple" }
];

export const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Hand-Carved Coconut Shell Candle (Lavender & Cedar)",
    category: "home-living",
    price: 18.5,
    originalPrice: 24,
    rating: 4.9,
    reviewsCount: 42,
    stock: 35,
    ecoScore: "A+",
    carbonSavedKg: 3.2,
    plasticAvoided: 4,
    badge: "Artisan Handcrafted",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b8?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Reclaimed Coconut Shell", "Pure Soy Wax", "Organic Lavender Essential Oil", "Wood Wick"],
    description: "Each candle is hand-poured into discarded coconut shells sourced from local coastal farm cooperatives. 100% soot-free natural soy wax infused with wild lavender and cedarwood oils, featuring a crackling organic wood wick.",
    artisan: {
      id: "art-1",
      name: "Prakriti Naturals",
      founder: "Meera Pillai",
      location: "Alappuzha, Kerala",
      msmeType: "Women-Led Rural Enterprise",
      msmeRegNo: "UDYAM-KL-02-004819",
      verifiedMsme: true,
      story: "Meera employs 14 women from fishing villages, transforming agricultural coconut waste into sustainable luxury aromatherapy essentials."
    },
    certifications: ["Cruelty-Free", "Zero Waste Certified", "Fair Trade"]
  },
  {
    id: "prod-2",
    name: "Organic Bamboo Charcoal Dental Kit (4-Pack)",
    category: "personal-care",
    price: 14,
    originalPrice: 18,
    rating: 4.8,
    reviewsCount: 78,
    stock: 50,
    ecoScore: "A+",
    carbonSavedKg: 2.8,
    plasticAvoided: 8,
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593005510329-8a4035a7238f?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Moso Bamboo Handle", "Activated Bamboo Charcoal Bristles", "Compostable Kraft Box"],
    description: "Ergonomically carved from fast-growing, pesticide-free wild bamboo with naturally antibacterial activated charcoal bristles. Fully biodegradable handles can be composted in your garden.",
    artisan: {
      id: "art-2",
      name: "EarthRoot Crafts",
      founder: "Ramesh Gowda",
      location: "Mysuru, Karnataka",
      msmeType: "Handmade Eco Collective",
      msmeRegNo: "UDYAM-KR-18-009124",
      verifiedMsme: true,
      story: "Started by a generational bamboo carving family, EarthRoot crafts everyday zero-waste hygiene items to replace single-use plastic."
    },
    certifications: ["FSC Certified Bamboo", "100% Biodegradable", "Plastic-Free Packaging"]
  },
  {
    id: "prod-3",
    name: "Hand-Hammered Pure Ayurvedic Copper Water Bottle (950ml)",
    category: "kitchen-dining",
    price: 32,
    originalPrice: 42,
    rating: 4.95,
    reviewsCount: 61,
    stock: 20,
    ecoScore: "A",
    carbonSavedKg: 4.5,
    plasticAvoided: 250,
    badge: "Traditional Craft",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["99.8% Pure Grade Copper", "Food-Grade Silicone Seal", "Lacquered Exterior"],
    description: "Hand-hammered by master brassmiths using ancient Ayurvedic metalsmithing techniques. Natural oligodynamic copper helps naturally purify water, boosts immunity, and eliminates thousands of disposable plastic bottles.",
    artisan: {
      id: "art-3",
      name: "Tamba Heritage Guild",
      founder: "Kishan Lal Verma",
      location: "Moradabad, Uttar Pradesh",
      msmeType: "Artisanal MSME Cluster",
      msmeRegNo: "UDYAM-UP-48-001235",
      verifiedMsme: true,
      story: "Preserving 400-year-old brass and copper craft traditions, supporting 32 generational metal artisan families."
    },
    certifications: ["100% Recyclable Metal", "Ayurvedic Heritage", "Lifelong Durability"]
  },
  {
    id: "prod-4",
    name: "Upcycled Raw Denim & Jute Everyday Laptop Sleeve (15-inch)",
    category: "fashion-accessories",
    price: 26.5,
    originalPrice: 35,
    rating: 4.7,
    reviewsCount: 39,
    stock: 28,
    ecoScore: "A+",
    carbonSavedKg: 6.8,
    plasticAvoided: 12,
    badge: "Circular Economy",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Discarded Denim Factory Off-cuts", "Natural Golden Jute", "Organic Cotton Padding", "Coconut Shell Button"],
    description: "Rescues heavy-duty denim remnants from industrial textile discard. Lined with natural shock-absorbent golden jute and organic cotton fleece to protect your laptop with timeless eco-street style.",
    artisan: {
      id: "art-4",
      name: "PunarVastra Collective",
      founder: "Sneha Patel",
      location: "Surat, Gujarat",
      msmeType: "Circular Textile Startup",
      msmeRegNo: "UDYAM-GJ-22-005612",
      verifiedMsme: true,
      story: "Sneha's micro-enterprise diverts over 4 metric tons of textile waste from landfills every year while providing dignified livelihood to women tailors."
    },
    certifications: ["Upcycled Certified", "Vegan", "Zero Landfill"]
  },
  {
    id: "prod-5",
    name: "Seed Paper Botanical Journal & Plantable Seed Pen",
    category: "zero-waste",
    price: 16,
    originalPrice: 22,
    rating: 4.9,
    reviewsCount: 85,
    stock: 60,
    ecoScore: "A+",
    carbonSavedKg: 2.1,
    plasticAvoided: 6,
    badge: "Plantable",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Recycled Cotton Scrap Paper", "Wildflower & Basil Seeds", "Recycled Paper Pen Body"],
    description: "Handmade paper crafted from cotton fabric rags embedded with marigold and basil seeds. When you finish journaling, plant the cover and pen capsule in moist soil to grow vibrant flowers and fresh herbs!",
    artisan: {
      id: "art-5",
      name: "Beej Paperworks",
      founder: "Anand Sharma",
      location: "Sanganer, Rajasthan",
      msmeType: "Handmade Paper Cooperative",
      msmeRegNo: "UDYAM-RJ-14-003321",
      verifiedMsme: true,
      story: "Combining centuries-old Sanganeri papermaking with modern permaculture seeds to replace wood-pulp notebooks."
    },
    certifications: ["Tree-Free Paper", "Non-GMO Seeds", "100% Compostable"]
  },
  {
    id: "prod-6",
    name: "Terracotta Earthen Cooking Handi with Lid (2.5L)",
    category: "kitchen-dining",
    price: 28,
    originalPrice: 36,
    rating: 4.85,
    reviewsCount: 54,
    stock: 15,
    ecoScore: "A+",
    carbonSavedKg: 5.4,
    plasticAvoided: 0,
    badge: "Non-Toxic Living",
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Deep-Bed River Clay", "Natural Mica Mineral Finish", "Lead-Free & Cadmium-Free"],
    description: "Throw-turned on traditional potters' wheels and sun-baked before firing. Porous terracotta circulates steam evenly, locking in food nutrients and enhancing aroma naturally without non-stick synthetic chemicals.",
    artisan: {
      id: "art-6",
      name: "Mati Mitti Collective",
      founder: "Sanjoy Das",
      location: "Bankura, West Bengal",
      msmeType: "Rural Pottery Guild",
      msmeRegNo: "UDYAM-WB-05-007734",
      verifiedMsme: true,
      story: "Sanjoy leads a cluster of 22 traditional potter families preserving ancient unglazed clay cookware techniques."
    },
    certifications: ["100% Non-Toxic", "Chemical-Free", "Bio-Neutral"]
  },
  {
    id: "prod-7",
    name: "Cold-Pressed Organic Virgin Coconut & Vetiver Body Oil (200ml)",
    category: "personal-care",
    price: 19.5,
    originalPrice: 25,
    rating: 4.9,
    reviewsCount: 47,
    stock: 40,
    ecoScore: "A",
    carbonSavedKg: 1.9,
    plasticAvoided: 3,
    badge: "Organic Farmed",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Centrifuged Virgin Coconut Oil", "Wild Vetiver Root Extract", "Dark Amber Glass Bottle", "Aluminum Cap"],
    description: "Cold-extracted within 4 hours of harvesting fresh coconuts from organic permaculture farms. Infused with cooling wild vetiver root for deep hydration, packed in infinitely recyclable amber glass.",
    artisan: {
      id: "art-7",
      name: "GreenGrove Agro Co-op",
      founder: "Devaki Nambiar",
      location: "Wayanad, Kerala",
      msmeType: "Organic Farmer Producer Co.",
      msmeRegNo: "UDYAM-KL-12-002190",
      verifiedMsme: true,
      story: "Formed by 65 organic smallholder farmers committed to regenerative agroforestry and chemical-free processing."
    },
    certifications: ["USDA Organic", "Cruelty-Free", "Zero Microplastics"]
  },
  {
    id: "prod-8",
    name: "Handloom Organic Khadi Cotton Market Tote & Produce Pouches",
    category: "fashion-accessories",
    price: 21,
    originalPrice: 28,
    rating: 4.75,
    reviewsCount: 33,
    stock: 45,
    ecoScore: "A+",
    carbonSavedKg: 4.1,
    plasticAvoided: 180,
    badge: "Handwoven",
    images: [
      "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["GOTS Certified Organic Cotton", "Natural Indigo Dye", "Heavy-Duty Reinforced Handles"],
    description: "Hand-spun and hand-woven on wooden charkhas by artisan weavers. Includes a roomy gusseted market tote and 3 breathable mesh produce pouches to completely eliminate supermarket produce bags.",
    artisan: {
      id: "art-8",
      name: "Vanya Handlooms",
      founder: "Radha Devi",
      location: "Maheshwar, Madhya Pradesh",
      msmeType: "Weavers Cooperative",
      msmeRegNo: "UDYAM-MP-26-004418",
      verifiedMsme: true,
      story: "Empowering 40 handloom artisan families with fair living wages and preserving traditional Indian hand-spinning heritage."
    },
    certifications: ["GOTS Organic", "Fair Trade Certified", "Zero Synthetic Dyes"]
  },
  {
    id: "prod-9",
    name: "Raw Wild Forest Honey with Crushed Cinnamon & Star Anise (500g)",
    category: "organic-foods",
    price: 22,
    originalPrice: 27,
    rating: 4.95,
    reviewsCount: 92,
    stock: 30,
    ecoScore: "A",
    carbonSavedKg: 1.5,
    plasticAvoided: 2,
    badge: "Wild Harvested",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["100% Unprocessed Wild Honey", "Organic Ceylon Cinnamon", "Wild Star Anise", "Glass Mason Jar"],
    description: "Ethically gathered by indigenous tribal honey foragers using non-destructive traditional methods that keep bee colonies unharmed. Raw, unheated, unfiltered, and infused with freshly ground mountain spices.",
    artisan: {
      id: "art-9",
      name: "Nilgiri Indigenous Honey Union",
      founder: "Bomman Kurumba",
      location: "Kotagiri, Tamil Nadu",
      msmeType: "Tribal MSME Society",
      msmeRegNo: "UDYAM-TN-20-006541",
      verifiedMsme: true,
      story: "Directly supports 80 tribal honey hunters and preserves the delicate bio-reserve canopy of the Western Ghats."
    },
    certifications: ["Wild Harvest Certified", "Raw & Unfiltered", "Cruelty-Free Harvesting"]
  },
  {
    id: "prod-10",
    name: "Natural Neem Wood Dual-Tooth Comb & Hair Care Trio",
    category: "personal-care",
    price: 12.5,
    originalPrice: 16,
    rating: 4.8,
    reviewsCount: 51,
    stock: 55,
    ecoScore: "A+",
    carbonSavedKg: 1.7,
    plasticAvoided: 5,
    badge: "Plastic-Free Grooming",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Sustainably Harvested Indian Neem Wood", "Organic Flaxseed Polish"],
    description: "Hand-carved from seasoned Indian Lilac (Neem) wood with rounded tips that stimulate scalp circulation. Naturally anti-fungal and static-free, preventing hair breakage without plastic bristles.",
    artisan: {
      id: "art-2",
      name: "EarthRoot Crafts",
      founder: "Ramesh Gowda",
      location: "Mysuru, Karnataka",
      msmeType: "Handmade Eco Collective",
      msmeRegNo: "UDYAM-KR-18-009124",
      verifiedMsme: true,
      story: "Preserving herbal woodwork traditions using naturally fallen neem branches."
    },
    certifications: ["100% Biodegradable", "Zero Chemical Polish", "Antistatic"]
  },
  {
    id: "prod-11",
    name: "Biodegradable Areca Palm Leaf Dinnerware Set (25 Pieces)",
    category: "kitchen-dining",
    price: 24,
    originalPrice: 30,
    rating: 4.7,
    reviewsCount: 29,
    stock: 40,
    ecoScore: "A+",
    carbonSavedKg: 4.8,
    plasticAvoided: 75,
    badge: "100% Compostable",
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Naturally Fallen Areca Nut Palm Sheaths", "Spring Water Washed", "Heat Pressed"],
    description: "Zero trees are cut! Made exclusively from shed palm sheaths that are thoroughly washed with fresh spring water and steam-pressed into sturdy, elegant, microwave-safe tableware that composts naturally in 60 days.",
    artisan: {
      id: "art-10",
      name: "Patra BioPack MSME",
      founder: "Kavitha Hegde",
      location: "Shivamogga, Karnataka",
      msmeType: "Agro-Waste Bio-Packaging",
      msmeRegNo: "UDYAM-KR-28-008711",
      verifiedMsme: true,
      story: "Kavitha turns dry fallen plantation leaves into compostable tableware, providing seasonal work to over 50 plantation helpers."
    },
    certifications: ["Commercial & Home Compostable", "Microwave Safe", "USDA Biobased"]
  },
  {
    id: "prod-12",
    name: "Handmade Cold-Process Herbal Soap Trio (Neem, Rose, Sandal)",
    category: "personal-care",
    price: 15,
    originalPrice: 20,
    rating: 4.9,
    reviewsCount: 64,
    stock: 45,
    ecoScore: "A+",
    carbonSavedKg: 2.2,
    plasticAvoided: 6,
    badge: "Artisan Favorite",
    images: [
      "https://images.unsplash.com/photo-1607006311820-d158737e3d5e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
    ],
    materials: ["Cold-Pressed Coconut Oil", "Shea Butter", "Damask Rose Distillate", "Red Sandalwood Extract"],
    description: "Cured for 6 weeks in small artisanal batches. Free from palm oil, parabens, SLS, and synthetic perfumes. Wrapped in plantable seed paper wrappers.",
    artisan: {
      id: "art-1",
      name: "Prakriti Naturals",
      founder: "Meera Pillai",
      location: "Alappuzha, Kerala",
      msmeType: "Women-Led Rural Enterprise",
      msmeRegNo: "UDYAM-KL-02-004819",
      verifiedMsme: true,
      story: "Using traditional Ayurvedic soapcrafting passed down across four generations."
    },
    certifications: ["Palm Oil-Free", "Zero SLS/Parabens", "Seed Paper Wrap"]
  }
];
