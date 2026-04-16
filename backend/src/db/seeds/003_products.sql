-- =============================================================================
-- Seed: 003_products.sql
-- Description: Sample products across BBSM's key categories for Phase 1 demo
-- All prices in NPR. ON CONFLICT on SKU = idempotent re-runs.
-- =============================================================================

INSERT INTO products (name, name_ne, sku, description, category, subcategory, price, unit, is_active, is_featured)
VALUES

-- ── GRAINS & PULSES ───────────────────────────────────────────────────────────
('Basmati Rice (5kg)',       'बासमती चामल (५ केजी)',   'GRN-RIC-001', 'Premium aged long-grain basmati rice',          'Grains & Pulses', 'Rice',   875.00,  'bag',   TRUE, TRUE),
('Sona Masoori Rice (5kg)', 'सोना मसुरी चामल (५ केजी)', 'GRN-RIC-002', 'Everyday medium-grain rice, ideal for dal-bhat','Grains & Pulses', 'Rice',   620.00,  'bag',   TRUE, FALSE),
('Chura (Beaten Rice) 1kg', 'चिउरा (१ केजी)',          'GRN-CHU-001', 'Thin beaten rice, ready to eat',               'Grains & Pulses', 'Flattened Rice', 120.00, 'kg', TRUE, FALSE),
('Toor Dal (1kg)',           'तोर दाल (१ केजी)',        'GRN-DAL-001', 'Split pigeon peas — essential for everyday dal', 'Grains & Pulses', 'Pulses', 180.00,  'kg',    TRUE, FALSE),
('Masoor Dal (1kg)',         'मसुर दाल (१ केजी)',       'GRN-DAL-002', 'Red lentils, cooks fast and rich in protein',  'Grains & Pulses', 'Pulses', 160.00,  'kg',    TRUE, FALSE),
('Chana Dal (1kg)',          'चना दाल (१ केजी)',        'GRN-DAL-003', 'Split chickpeas, great for snacks and curries','Grains & Pulses', 'Pulses', 145.00,  'kg',    TRUE, FALSE),
('Wheat Flour (Atta) 5kg',  'गहुँको पिठो (५ केजी)',   'GRN-FLR-001', 'Stone-ground whole wheat flour for roti',       'Grains & Pulses', 'Flour',  390.00,  'bag',   TRUE, TRUE),
('Maize Flour (Makai) 1kg', 'मकैको पिठो (१ केजी)',    'GRN-FLR-002', 'Fine ground maize flour for dhido and bread',  'Grains & Pulses', 'Flour',   75.00,  'kg',    TRUE, FALSE),

-- ── COOKING OIL & GHEE ───────────────────────────────────────────────────────
('Sunflower Oil 5L',         'सूर्यमुखी तेल ५ लिटर',   'OIL-SUN-001', 'Refined sunflower cooking oil, heart-friendly', 'Oil & Ghee', 'Vegetable Oil', 980.00,  'litre', TRUE, TRUE),
('Mustard Oil 1L',           'तोरीको तेल १ लिटर',      'OIL-MUS-001', 'Cold-pressed pure mustard oil, traditional taste','Oil & Ghee','Mustard Oil',   220.00,  'litre', TRUE, FALSE),
('Pure Cow Ghee 500g',       'गाईको घिउ ५०० ग्राम',   'OIL-GHE-001', 'Churned from fresh cow milk, rich aroma',       'Oil & Ghee', 'Ghee',          750.00,  'g',     TRUE, TRUE),
('Soybean Oil 5L',           'सोयाबिन तेल ५ लिटर',    'OIL-SOY-001', 'Light refined soybean oil, suitable for all cooking','Oil & Ghee','Vegetable Oil',890.00, 'litre', TRUE, FALSE),

-- ── DAIRY ────────────────────────────────────────────────────────────────────
('Fresh Full Cream Milk 1L', 'ताजा मिल्क १ लिटर',      'DAI-MLK-001', 'Pasteurised full-cream milk, delivered daily',  'Dairy', 'Milk',    95.00,   'litre', TRUE, TRUE),
('Sano Khushi Curd 400g',    'दही ४०० ग्राम',          'DAI-CRD-001', 'Thick set curd, made from fresh milk',         'Dairy', 'Curd',    65.00,   'g',     TRUE, FALSE),
('Paneer 200g',              'पनीर २०० ग्राम',          'DAI-PNR-001', 'Fresh cottage cheese, soft and firm texture',  'Dairy', 'Paneer', 140.00,   'g',     TRUE, FALSE),
('Amul Butter 100g',         'बटर १०० ग्राम',           'DAI-BUT-001', 'Salted table butter, rich in natural fat',     'Dairy', 'Butter',  95.00,   'g',     TRUE, FALSE),
('Cheese Slice 200g',        'चिज स्लाइस २०० ग्राम',   'DAI-CHS-001', 'Processed cheese slices, great for sandwiches','Dairy', 'Cheese', 225.00,   'g',     TRUE, FALSE),

-- ── BEVERAGES ────────────────────────────────────────────────────────────────
('Wai Wai Chicken Noodles 75g','वाइवाइ नुडल्स ७५ ग्राम','BEV-NUD-001','Instant chicken flavour noodles, Nepal favourite','Beverages','Instant Noodles', 30.00, 'piece', TRUE, TRUE),
('Tata Tea Gold 500g',       'टाटा चिया ५०० ग्राम',   'BEV-TEA-001', 'Strong CTC black tea with natural aroma',      'Beverages', 'Tea',   350.00,  'g',     TRUE, FALSE),
('Nescafe Classic 100g',     'नेस्क्याफे क्लासिक १०० ग्राम','BEV-COF-001','Rich instant coffee, smooth and full-bodied','Beverages','Coffee', 480.00, 'g',    TRUE, FALSE),
('Frooti Mango Juice 1L',    'फ्रुटि म्यांगो जुस १ लिटर','BEV-JUI-001','Real mango juice drink, refreshing',         'Beverages', 'Juice',  95.00,  'litre', TRUE, FALSE),
('Coca-Cola 2L',             'कोका-कोला २ लिटर',       'BEV-SOD-001', 'Classic cola soft drink',                      'Beverages', 'Soft Drinks', 135.00, 'litre',TRUE, FALSE),
('Pepsi 2L',                 'पेप्सी २ लिटर',          'BEV-SOD-002', 'Refreshing cola drink',                        'Beverages', 'Soft Drinks', 130.00, 'litre',TRUE, FALSE),
('Mineral Water 1.5L',       'मिनरल वाटर १.५ लिटर',   'BEV-WAT-001', 'Pure himalayan mineral water',                 'Beverages', 'Water',   40.00,  'litre', TRUE, FALSE),

-- ── SNACKS & CONFECTIONERY ────────────────────────────────────────────────────
('Lay''s Classic Chips 78g', 'लेज चिप्स ७८ ग्राम',    'SNK-CHP-001', 'Crispy potato chips, original salted',         'Snacks', 'Chips',     80.00,  'piece', TRUE, FALSE),
('Oreo Biscuit 120g',        'ओरियो बिस्किट १२० ग्राम','SNK-BSC-001','Chocolate sandwich cookies with cream filling', 'Snacks', 'Biscuits',  85.00,  'piece', TRUE, FALSE),
('Britannia Good Day 120g',  'ब्रिटानिया गुड डे १२० ग्राम','SNK-BSC-002','Butter cookies with cashews',             'Snacks', 'Biscuits',  55.00,  'piece', TRUE, FALSE),
('Kitkat 4-Finger 40g',      'किटक्याट ४० ग्राम',     'SNK-CHO-001', 'Crispy wafer chocolate bar',                  'Snacks', 'Chocolates',120.00,  'piece', TRUE, TRUE),
('Cadbury Dairy Milk 40g',   'क्याडबरी डेरी मिल्क',   'SNK-CHO-002', 'Smooth milk chocolate bar',                   'Snacks', 'Chocolates',100.00,  'piece', TRUE, FALSE),
('Kurkure Masala 65g',       'कुर्कुरे मसाला ६५ ग्राम','SNK-CHP-002','Spicy crunchy corn puffs, masala flavour',     'Snacks', 'Chips',     45.00,  'piece', TRUE, FALSE),

-- ── PERSONAL CARE ────────────────────────────────────────────────────────────
('Lifebuoy Soap 125g',       'लाइफबॉय साबुन १२५ ग्राम','PRC-SOP-001','Antibacterial protection soap',               'Personal Care', 'Soap',       55.00,  'piece', TRUE, FALSE),
('Dove Beauty Soap 100g',    'डोभ साबुन १०० ग्राम',   'PRC-SOP-002', 'Moisturising beauty bar with 1/4 cream',      'Personal Care', 'Soap',       95.00,  'piece', TRUE, FALSE),
('Colgate MaxFresh 150g',    'कोलगेट टुथपेस्ट १५० ग्राम','PRC-DEN-001','Mint fresh toothpaste with whitening action','Personal Care','Dental',    145.00,  'piece', TRUE, FALSE),
('Head & Shoulders 340ml',   'हेड एण्ड सोल्डर्स ३४० मिलि','PRC-SHP-001','Anti-dandruff shampoo for clean, flake-free hair','Personal Care','Shampoo',395.00,'ml',TRUE, FALSE),
('Pantene Conditioner 200ml','पेन्टेन कन्डिसनर २०० मिलि','PRC-SHP-002','Smooth and silky conditioner',              'Personal Care', 'Shampoo',  265.00,  'ml',    TRUE, FALSE),
('Dettol Handwash 250ml',    'डेटोल ह्यान्डवास २५० मिलि','PRC-HND-001','Antibacterial liquid hand wash',            'Personal Care', 'Hygiene',  185.00,  'ml',    TRUE, FALSE),

-- ── HOUSEHOLD & CLEANING ─────────────────────────────────────────────────────
('Surf Excel 1kg',           'सर्फ एक्सेल १ केजी',    'HHD-DET-001', 'Powerful stain-removing detergent powder',     'Household', 'Laundry',   280.00, 'kg',    TRUE, TRUE),
('Ariel 1kg',                'एरियल १ केजी',           'HHD-DET-002', 'Automatic washing machine detergent powder',  'Household', 'Laundry',   320.00, 'kg',    TRUE, FALSE),
('Vim Dishwash Bar 250g',    'भिम बार २५० ग्राम',     'HHD-DSH-001', 'Lemon dishwash bar, removes grease instantly', 'Household', 'Dishwash',   45.00, 'piece', TRUE, FALSE),
('Harpic Toilet Cleaner 1L', 'हार्पिक टॉयलेट क्लिनर', 'HHD-CLN-001', 'Powerful toilet bowl cleaner and disinfectant','Household','Cleaning',  195.00, 'litre', TRUE, FALSE),
('Mortein Mosquito Spray',   'मोर्टेन मस्किटो स्प्रे', 'HHD-INS-001', 'Fast-acting insect killer spray 425ml',       'Household', 'Pest Control',320.00,'piece',TRUE, FALSE),

-- ── SPICES & CONDIMENTS ───────────────────────────────────────────────────────
('Himalayan Pink Salt 1kg',  'हिमालयन नुन १ केजी',    'SPC-SLT-001', 'Pure Himalayan rock salt, mineral-rich',       'Spices & Condiments', 'Salt',    90.00, 'kg',  TRUE, TRUE),
('Turmeric Powder 200g',     'बेसार धुलो २०० ग्राम',  'SPC-TUR-001', 'Pure ground turmeric, vibrant colour and aroma','Spices & Condiments','Spices',  75.00, 'g',   TRUE, FALSE),
('Coriander Powder 200g',    'धनिया धुलो २०० ग्राम',  'SPC-COR-001', 'Freshly ground coriander, mild and aromatic',  'Spices & Condiments','Spices',  70.00, 'g',   TRUE, FALSE),
('Red Chilli Powder 200g',   'खुर्सानी धुलो २०० ग्राम','SPC-CHI-001','Hot red chilli powder, adds heat and colour', 'Spices & Condiments','Spices',  80.00, 'g',   TRUE, FALSE),
('Everest Garam Masala 50g', 'गरम मसाला ५० ग्राम',    'SPC-MAS-001', 'Aromatic whole spice blend, restaurant quality','Spices & Condiments','Masala', 95.00, 'g',   TRUE, FALSE),
('Soy Sauce 200ml',          'सोया सस २०० मिलि',       'SPC-SAU-001', 'All-purpose soy sauce for stir-fry and dips',  'Spices & Condiments','Sauces', 145.00, 'ml',  TRUE, FALSE),
('Tomato Ketchup 500g',      'टोमेटो केचप ५०० ग्राम', 'SPC-KET-001', 'Rich tomato ketchup, sweet and tangy',         'Spices & Condiments','Sauces', 180.00, 'g',   TRUE, FALSE),

-- ── FROZEN & PACKAGED FOOD ───────────────────────────────────────────────────
('Momo (Veg Frozen) 500g',   'भेज मम: (फ्रोजन) ५०० ग्राम','FRZ-MMO-001','Ready-to-steam vegetable momo, authentic flavour','Frozen & Packaged','Frozen Meals',320.00,'g', TRUE, TRUE),
('Chicken Nuggets 500g',     'च्याउ नगेट्स ५०० ग्राम', 'FRZ-NUG-001', 'Crispy breaded chicken nuggets',               'Frozen & Packaged','Frozen Meals',480.00,'g', TRUE, FALSE),
('Maggi Noodles 12-pack',    'म्यागी नुडल्स १२ प्याक', 'PKG-MGI-001', 'Masala flavour instant noodles, family pack',  'Frozen & Packaged','Instant Noodles',360.00,'pack',TRUE,TRUE),
('Milo Drink Mix 400g',      'माइलो ड्रिंक मिक्स ४०० ग्राम','PKG-MIL-001','Chocolate malt drink powder, energy boost','Frozen & Packaged','Drink Mix',480.00,'g',TRUE,FALSE)

ON CONFLICT (sku) DO UPDATE SET
  name        = EXCLUDED.name,
  name_ne     = EXCLUDED.name_ne,
  description = EXCLUDED.description,
  category    = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  price       = EXCLUDED.price,
  unit        = EXCLUDED.unit,
  is_active   = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured;
