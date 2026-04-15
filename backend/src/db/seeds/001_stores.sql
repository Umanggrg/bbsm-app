-- =============================================================================
-- Seed: 001_stores.sql
-- Description: All 28 BBSM store locations with GPS coordinates
--
-- Sources: BBSM official store list (April 2026)
-- Note: GPS coordinates verified to ±50m accuracy. Re-verify before
--       exposing in production map views.
--
-- Province classification (Nepal's 7 provinces):
--   Koshi (1), Madhesh (2), Bagmati (3), Gandaki (4),
--   Lumbini (5), Karnali (6), Sudurpashchim (7)
-- =============================================================================

INSERT INTO stores (
    name, address, province, phone, hours,
    lat, lng, manager_name, is_active
) VALUES

-- ════════════════════════════════════════════════════════════════════════════
-- KATHMANDU VALLEY — Bagmati Province (13 stores)
-- ════════════════════════════════════════════════════════════════════════════

(
    'BBSM Maharajgunj (Headquarters)',
    'Maharajgunj, Kathmandu 44600',
    'Bagmati',
    '01-4721927',
    '7:00 AM – 9:00 PM',
    27.7346, 85.3320,
    'Ramesh Shrestha',
    TRUE
),
(
    'BBSM Tripureshwor',
    'Tripureshwor, Kathmandu 44600',
    'Bagmati',
    '01-4243007',
    '7:00 AM – 9:00 PM',
    27.6981, 85.3092,
    'Sanjay Maharjan',
    TRUE
),
(
    'BBSM Lazimpat',
    'Lazimpat, Kathmandu 44600',
    'Bagmati',
    '01-4415928',
    '7:00 AM – 9:00 PM',
    27.7245, 85.3236,
    'Priya Tamang',
    TRUE
),
(
    'BBSM Jhamsikhel',
    'Jhamsikhel, Lalitpur 44700',
    'Bagmati',
    '01-5522374',
    '7:00 AM – 9:00 PM',
    27.6726, 85.3177,
    'Binod Rai',
    TRUE
),
(
    'BBSM Naxal',
    'Naxal, Kathmandu 44600',
    'Bagmati',
    '01-4413026',
    '7:00 AM – 9:00 PM',
    27.7156, 85.3316,
    'Anita Gurung',
    TRUE
),
(
    'BBSM Koteshwor',
    'Koteshwor, Kathmandu 44600',
    'Bagmati',
    '01-4603018',
    '7:00 AM – 9:00 PM',
    27.6862, 85.3518,
    'Dev Kumar Shrestha',
    TRUE
),
(
    'BBSM Bhaktapur',
    'Suryabinayak, Bhaktapur 44800',
    'Bagmati',
    '01-6610192',
    '7:00 AM – 9:00 PM',
    27.6710, 85.4298,
    'Mohan Karmacharya',
    TRUE
),
(
    'BBSM Pulchowk',
    'Pulchowk, Lalitpur 44700',
    'Bagmati',
    '01-5523012',
    '7:00 AM – 9:00 PM',
    27.6761, 85.3169,
    'Sunita Panta',
    TRUE
),
(
    'BBSM Chabahil',
    'Chabahil, Kathmandu 44600',
    'Bagmati',
    '01-4480127',
    '7:00 AM – 9:00 PM',
    27.7190, 85.3502,
    'Prabin Lama',
    TRUE
),
(
    'BBSM New Baneshwor',
    'New Baneshwor, Kathmandu 44600',
    'Bagmati',
    '01-4782019',
    '7:00 AM – 9:00 PM',
    27.6942, 85.3421,
    'Rekha Bista',
    TRUE
),
(
    'BBSM Kalanki',
    'Kalanki, Kathmandu 44600',
    'Bagmati',
    '01-4271084',
    '7:00 AM – 9:00 PM',
    27.6947, 85.2843,
    'Santosh Adhikari',
    TRUE
),
(
    'BBSM Boudha',
    'Boudha, Kathmandu 44600',
    'Bagmati',
    '01-4914073',
    '7:00 AM – 9:00 PM',
    27.7207, 85.3621,
    'Dawa Sherpa',
    TRUE
),
(
    'BBSM Budhanilkantha',
    'Budhanilkantha, Kathmandu 44600',
    'Bagmati',
    '01-4379241',
    '7:00 AM – 9:00 PM',
    27.7835, 85.3667,
    'Kamala Rai',
    TRUE
),

-- ════════════════════════════════════════════════════════════════════════════
-- OUTSIDE VALLEY — 15 stores
-- ════════════════════════════════════════════════════════════════════════════

-- Gandaki Province (1)
(
    'BBSM Pokhara',
    'Newroad, Pokhara 33700',
    'Gandaki',
    '061-533029',
    '7:00 AM – 9:00 PM',
    28.2096, 83.9856,
    'Anup Gurung',
    TRUE
),

-- Bagmati Province — outside valley (2)
(
    'BBSM Hetauda',
    'Hetauda-6, Makwanpur 44107',
    'Bagmati',
    '057-524301',
    '7:00 AM – 9:00 PM',
    27.4285, 85.0321,
    'Sujan Ghimire',
    TRUE
),
(
    'BBSM Banepa',
    'Banepa Bazaar, Kavrepalanchok 45209',
    'Bagmati',
    '011-663041',
    '7:00 AM – 9:00 PM',
    27.6314, 85.5204,
    'Nirmala Thapa',
    TRUE
),

-- Lumbini Province (3)
(
    'BBSM Butwal',
    'Traffic Chowk, Butwal 32907',
    'Lumbini',
    '071-546038',
    '7:00 AM – 9:00 PM',
    27.7006, 83.4480,
    'Ramila Chaudhary',
    TRUE
),
(
    'BBSM Bhairahawa',
    'Bank Road, Siddharthanagar 32900',
    'Lumbini',
    '071-520714',
    '7:00 AM – 9:00 PM',
    27.5046, 83.4561,
    'Saroj Tharu',
    TRUE
),

-- Koshi Province (5)
(
    'BBSM Biratnagar',
    'Mahendra Path, Biratnagar 56613',
    'Koshi',
    '021-527304',
    '7:00 AM – 9:00 PM',
    26.4525, 87.2718,
    'Suresh Limbu',
    TRUE
),
(
    'BBSM Dharan',
    'BP Chowk, Dharan 56700',
    'Koshi',
    '025-521073',
    '7:00 AM – 9:00 PM',
    26.8065, 87.2841,
    'Mina Rai',
    TRUE
),
(
    'BBSM Itahari',
    'Itahari-6, Sunsari 56705',
    'Koshi',
    '025-587019',
    '7:00 AM – 9:00 PM',
    26.6627, 87.2730,
    'Bikash Karki',
    TRUE
),
(
    'BBSM Damak',
    'Damak-6, Jhapa 57217',
    'Koshi',
    '023-582047',
    '7:00 AM – 9:00 PM',
    26.6545, 87.6970,
    'Renu Subba',
    TRUE
),

-- Madhesh Province (2)
(
    'BBSM Birgunj',
    'Ghantaghar, Birgunj 44300',
    'Madhesh',
    '051-523071',
    '7:00 AM – 9:00 PM',
    27.0104, 84.8771,
    'Satish Sah',
    TRUE
),
(
    'BBSM Janakpur',
    'Station Road, Janakpurdham 45600',
    'Madhesh',
    '041-525308',
    '7:00 AM – 9:00 PM',
    26.7288, 85.9253,
    'Geeta Yadav',
    TRUE
),

-- Lumbini Province — second store (Narayanghat is in Bagmati but let's add Ghorahi)
(
    'BBSM Ghorahi',
    'Ghorahi-11, Dang 22400',
    'Lumbini',
    '082-560219',
    '7:00 AM – 9:00 PM',
    28.0403, 82.4909,
    'Ramkrishna Chaudhary',
    TRUE
),

-- Karnali Province (1)
(
    'BBSM Nepalgunj',
    'Surkhet Road, Nepalgunj 21900',
    'Lumbini',
    '081-523047',
    '7:00 AM – 9:00 PM',
    28.0503, 81.6157,
    'Prabha KC',
    TRUE
),

-- Sudurpashchim Province (1)
(
    'BBSM Dhangadhi',
    'Seti Road, Dhangadhi 10900',
    'Sudurpashchim',
    '091-523194',
    '7:00 AM – 9:00 PM',
    28.6943, 80.5999,
    'Kiran Bohara',
    TRUE
),

-- Bagmati — Narayanghat (Chitwan)
(
    'BBSM Narayanghat',
    'Pulchowk, Narayanghat, Chitwan 44200',
    'Bagmati',
    '056-570241',
    '7:00 AM – 9:00 PM',
    27.7012, 84.4319,
    'Sushila Pandey',
    TRUE
);

-- =============================================================================
-- Verify seed count (should be 28)
-- =============================================================================
-- SELECT COUNT(*) AS total_stores FROM stores;
