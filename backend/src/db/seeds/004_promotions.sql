-- =============================================================================
-- Seed: 004_promotions.sql
-- Description: Sample promotions for Phase 1 demo
-- Dates set relative to seed time so they are always "live" when seeded.
-- =============================================================================

INSERT INTO promotions (
  title, title_ne, description, description_ne,
  category, tier_target, start_date, end_date, is_published
)
VALUES

(
  'Weekly Fresh Deal — Grains & Pulses',
  'साप्ताहिक अफर — दाल चामल',
  'Save up to 20% on selected rice, dal, and flour this week. Stock up on pantry essentials at Nepal''s best prices.',
  'यस हप्ता छनौट चामल, दाल र पिठोमा २०% सम्म बचत गर्नुहोस्।',
  'Groceries', NULL,
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '5 days',
  TRUE
),

(
  'Mega Dairy Fest',
  'डेरी महोत्सव',
  'Buy 2 get 1 free on all dairy products — milk, curd, paneer, butter, and cheese. Limited stock available daily.',
  'सबै डेरी उत्पादनमा २ किन्नुस्, १ पाउनुस् — दूध, दही, पनीर, बटर र चिज।',
  'Dairy', NULL,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '6 days',
  TRUE
),

(
  'Snacks & Beverages Bonanza',
  'स्न्याक्स र पेय पदार्थ धमाका',
  'Flat 15% off on all chips, biscuits, chocolates, juices, and soft drinks. Perfect for stocking up before the festival season.',
  'सबै चिप्स, बिस्किट, चकलेट, जुस र सफ्ट ड्रिंकमा १५% छुट।',
  'Snacks', NULL,
  NOW(),
  NOW() + INTERVAL '7 days',
  TRUE
),

(
  'Household Essentials Sale',
  'घरेलु सामान सेल',
  'Up to 25% off on detergents, dishwash, cleaning products, and personal care items. Keep your home fresh for less.',
  'डिटर्जेन्ट, भाँडा माझ्ने, सरसफाइ र व्यक्तिगत हेरचाहका सामानमा २५% सम्म छुट।',
  'Household', NULL,
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '4 days',
  TRUE
),

(
  'Gold Member Exclusive — Oil & Ghee',
  'गोल्ड सदस्य विशेष — तेल र घिउ',
  'Gold and Platinum members enjoy an extra 10% off on all cooking oils and pure ghee. Log in to your BBSM account to claim.',
  'गोल्ड र प्लेटिनम सदस्यहरूलाई सबै खाना पकाउने तेल र शुद्ध घिउमा थप १०% छुट।',
  'Oil & Ghee', 'gold',
  NOW(),
  NOW() + INTERVAL '10 days',
  TRUE
),

(
  'Festival Season Spice Bundle',
  'चाडपर्व मसाला बन्डल',
  'Buy any 5 spices and get a free Everest Garam Masala 50g pack. Perfect for your Dashain and Tihar cooking.',
  'जुनसुकै ५ वटा मसाला किन्नुस् र निःशुल्क एभरेस्ट गरम मसाला ५० ग्राम पाउनुस्।',
  'Spices', NULL,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '14 days',
  TRUE
),

(
  'Frozen Food Weekend Deal',
  'फ्रोजन फुड वीकेन्ड अफर',
  'All frozen and packaged meals at 10% off every Saturday and Sunday. Momo, nuggets, Maggi packs and more.',
  'हरेक शनिबार र आइतबार सबै फ्रोजन र प्याकेज खानामा १०% छुट।',
  'Frozen', NULL,
  NOW(),
  NOW() + INTERVAL '30 days',
  TRUE
)

ON CONFLICT DO NOTHING;
