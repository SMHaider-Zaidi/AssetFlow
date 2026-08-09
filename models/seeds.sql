-- ===================================================================================================================================================
-- Dummy Data
-- ==================================================================================================================================================

USE assetflow_dummy_db;

-- ========================================================
-- 1. POPULATE MULTI-TENANT ORGANIZATIONS (22 Orgs)
-- ========================================================
INSERT INTO ORGANIZATION (Org_id, Org_Name) VALUES
(1, 'Avanza Global Technologies'), -- Primary Deep Data Tenant
(2, 'Zenith Fintech Group'),       -- Secondary Deep Data Tenant
(3, 'Alpha Logistics Ltd'),
(4, 'Beacon Healthcare'),
(5, 'Core Cyber Security'),
(6, 'Delta Aviation'),
(7, 'Epsilon Retail Solutions'),
(8, 'Falcon Media Group'),
(9, 'Genesis Energy Corp'),
(10, 'Horizon Horizon Real Estate'),
(11, 'Infinity Insurance'),
(12, 'Jupiter Manufacturing'),
(13, 'Krypton Ventures'),
(14, 'Lunar Biotech'),
(15, 'Matrix Consulting'),
(16, 'Nova Education Trust'),
(17, 'Oasis Agritech'),
(18, 'Pulse Fitness Network'),
(19, 'Quantum AI Labs'),
(20, 'Radiant Hospitality'),
(21, 'Summit Legal Partners'),
(22, 'Titan Heavy Industries');


-- ========================================================
-- 2. POPULATE RESOURCE CATEGORIES (For Orgs 1 & 2)
-- ========================================================
INSERT INTO RESOURCE_CATEGORY (Cat_id, Org_id, Category_Name, Max_Duration_Minutes) VALUES
-- Avanza Global (Org 1)
(1, 1, 'Executive Boardrooms', 120),
(2, 1, 'Engineering Workstations', NULL),
(3, 1, 'VR & AR Development Kits', 60),
(4, 1, 'AV & Media Capture Gear', 180),
-- Zenith Fintech (Org 2)
(5, 2, 'Secure Meeting Pods', 90),
(6, 2, 'High-Compute Sandbox Servers', 240),
(7, 2, 'Biometric Handsets', NULL);


-- ========================================================
-- 3. POPULATE THE WORKFORCE (Diverse Mixed Naming)
-- ========================================================
INSERT INTO USERS (U_id, Org_id, Role_id, Name, Email, Password) VALUES
-- Avanza Global (Org 1) - Admins & Employees
(1, 1, 1, 'Zayan El-Amin', 'zayan.amin@avanza.com', 'hashed_pass_1'),
(2, 1, 1, 'Chloe Davenport', 'chloe.d@avanza.com', 'hashed_pass_2'),
(4, 1, 2, 'Amara Al-Saeed', 'amara.s@avanza.com', 'hashed_pass_4'),
(5, 1, 2, 'Tariq Mahmood', 'tariq.m@avanza.com', 'hashed_pass_5'),
(6, 1, 2, 'Liam O\'Connor', 'liam.o@avanza.com', 'hashed_pass_6'),
(7, 1, 2, 'Fatima Al-Farsi', 'fatima.f@avanza.com', 'hashed_pass_7'),
(8, 1, 2, 'Mateo Rodriguez', 'mateo.r@avanza.com', 'hashed_pass_8'),
(9, 1, 2, 'Yasmin Siddiqui', 'yasmin.s@avanza.com', 'hashed_pass_9'),
(10, 1, 2, 'Sarah Jenkins', 'sarah.j@avanza.com', 'hashed_pass_10'),

-- Zenith Fintech (Org 2) - Admins & Employees
(11, 2, 1, 'Mustafa Malik', 'mustafa.m@zenith.com', 'hashed_pass_11'),
(12, 2, 1, 'Aisha Al-Hassan', 'aisha.h@zenith.com', 'hashed_pass_12'),
(13, 2, 2, 'Ethan Sterling', 'ethan.s@zenith.com', 'hashed_pass_13'),
(14, 2, 2, 'Bilal Mansoor', 'bilal.m@zenith.com', 'hashed_pass_14'),
(15, 2, 2, 'Yuki Tanaka', 'yuki.t@zenith.com', 'hashed_pass_15'),
(16, 2, 2, 'Zainab Qureshi', 'zainab.q@zenith.com', 'hashed_pass_16'),
(17, 2, 2, 'Oliver Bennett', 'oliver.b@zenith.com', 'hashed_pass_17');

-- some more users

USE assetflow_dummy_db;

-- ========================================================
-- ADDING 25 MORE ENTERPRISE USERS (Orgs 1 & 2)
-- ========================================================
INSERT INTO USERS (Org_id, Role_id, is_active, Name, Email, Password) VALUES
-- Avanza Global (Org 1) - New Corporate Admins
(1, 1, 1, 'Hamza Siddiqui', 'hamza.s@avanza.com', 'hashed_pass_admin1'),
(1, 1, 1, 'Elena Rostova', 'elena.r@avanza.com', 'hashed_pass_admin2'),

-- Avanza Global (Org 1) - New Engineering & Operations Employees
(1, 2, 1, 'Mustafa Naqvi', 'mustafa.naqvi@avanza.com', 'hashed_pass_emp1'),
(1, 2, 1, 'Amina Al-Mansoor', 'amina.m@avanza.com', 'hashed_pass_emp2'),
(1, 2, 1, 'Rohan Deshmukh', 'rohan.d@avanza.com', 'hashed_pass_emp3'),
(1, 2, 1, 'Sophia Lin', 'sophia.lin@avanza.com', 'hashed_pass_emp4'),
(1, 2, 1, 'Bilal Farooqui', 'bilal.f@avanza.com', 'hashed_pass_emp5'),
(1, 2, 1, 'Freja Lindstrom', 'freja.l@avanza.com', 'hashed_pass_emp6'),
(1, 2, 1, 'Zaid Al-Shami', 'zaid.s@avanza.com', 'hashed_pass_emp7'),
(1, 2, 1, 'Hannah Vance', 'hannah.v@avanza.com', 'hashed_pass_emp8'),
(1, 2, 1, 'Kamil Al-Kazmi', 'kamil.k@avanza.com', 'hashed_pass_emp9'),
(1, 2, 1, 'Marcus Aurelius', 'marcus.a@avanza.com', 'hashed_pass_emp10'),
(1, 2, 1, 'Layla Hashmi', 'layla.h@avanza.com', 'hashed_pass_emp11'),
(1, 2, 1, 'Carlos Santana', 'carlos.s@avanza.com', 'hashed_pass_emp12'),
(1, 2, 1, 'Omar Mukhtar', 'omar.m@avanza.com', 'hashed_pass_emp13'),
(1, 2, 1, 'Noor Al-Huda', 'noor.h@avanza.com', 'hashed_pass_emp14'),
(1, 2, 1, 'Arthur Pendragon', 'arthur.p@avanza.com', 'hashed_pass_emp15'),
(1, 2, 1, 'Sana Mir', 'sana.mir@avanza.com', 'hashed_pass_emp16'),

-- Avanza Global (Org 1) - Inactive employee testing rows
-- (Perfect to show your teacher how your code blocks deactivated profiles from logging in)
(1, 2, 0, 'Tariq Aziz', 'tariq.aziz@avanza.com', 'disabled_pass1'),
(1, 2, 0, 'Sarah Connor', 's.connor@avanza.com', 'disabled_pass2'),

-- Zenith Fintech (Org 2) - New Financial Operations Stream
(2, 2, 1, 'Farhan Al-Jamil', 'farhan.j@zenith.com', 'hashed_pass_z1'),
(2, 2, 1, 'Nadia Belkacem', 'nadia.b@zenith.com', 'hashed_pass_z2'),
(2, 2, 1, 'Gregory House', 'g.house@zenith.com', 'hashed_pass_z3'),
(2, 2, 1, 'Mariam Al-Saud', 'mariam.s@zenith.com', 'hashed_pass_z4'),
(2, 2, 1, 'Lucas Miller', 'lucas.m@zenith.com', 'hashed_pass_z5');

-- ========================================================
-- 4. POPULATE PHYSICAL ASSETS (RESOURCES)
-- ========================================================
INSERT INTO RESOURCES (Res_id, Org_id, Cat_id, Res_Name, Status) VALUES
-- Avanza Global (Org 1) Assets
(1, 1, 1, '6th Floor Executive Boardroom', 'Available'),
(2, 1, 1, 'Strategy War Room Alpha', 'Available'),
(3, 1, 1, 'Huddle Space Delta', 'Maintenance'),
(4, 1, 2, 'Macbook Pro M5 - Asset 402', 'Available'),
(5, 1, 2, 'HP EliteBook 450 G7', 'Available'),
(6, 1, 2, 'ThinkPad P16 Workstation', 'Available'),
(7, 1, 3, 'Oculus Quest 3 - Unit B', 'Available'),
(8, 1, 3, 'Apple Vision Pro Dev-Kit', 'Available'),
(9, 1, 4, 'Wireless Podcast Microphone Kit', 'Available'),
(10, 1, 4, '4K Mobile Laser Projector', 'Available'),

-- Zenith Fintech (Org 2) Assets
(11, 2, 5, 'Confidential Pod 101', 'Available'),
(12, 2, 5, 'Confidential Pod 102', 'Available'),
(13, 2, 6, 'Sandbox Linux Array Server Alpha', 'Available'),
(14, 2, 6, 'Sandbox Linux Array Server Beta', 'Available'),
(15, 2, 7, 'Biometric Scanner Terminal X', 'Available');

-- some more data
USE assetflow_dummy_db;

-- ========================================================
-- ADDING 25 ADDITIONAL ENTERPRISE RESOURCES FOR ORG 1
-- ========================================================
INSERT INTO RESOURCES (Org_id, Cat_id, Res_Name, Status) VALUES
-- Category 1: Executive Boardrooms (Meeting rooms, collaborative hubs)
(1, 1, '3rd Floor Innovation Lab', 'Available'),
(1, 1, '4th Floor Conference Center Room A', 'Available'),
(1, 1, '4th Floor Conference Center Room B', 'Available'),
(1, 1, 'Design Thinking Studio', 'Available'),
(1, 1, 'Scrum Room Suite 201', 'Available'),
(1, 1, 'Executive Briefing Room C', 'Available'),

-- Category 2: Engineering Workstations (High-end developer rigs & laptops)
(1, 2, 'Macbook Pro M5 - Asset 403', 'Available'),
(1, 2, 'Macbook Pro M5 - Asset 404', 'Available'),
(1, 2, 'ThinkPad P16 Workstation - Rig 2', 'Available'),
(1, 2, 'ThinkPad P16 Workstation - Rig 3', 'Available'),
(1, 2, 'Dell Precision 7920 Data Science Tower', 'Available'),
(1, 2, 'Ubuntu AI Training Node 01', 'Available'),
(1, 2, 'HP ZBook Studio G10 - Mobility', 'Available'),
(1, 2, 'Asus ProArt Studiobook Creator Rig', 'Available'),

-- Category 3: VR & AR Development Kits (Immersive tech hardware testing pool)
(1, 3, 'Oculus Quest 3 - Unit C', 'Available'),
(1, 3, 'Oculus Quest 3 - Unit D', 'Available'),
(1, 3, 'HTC Vive Pro 2 Enterprise Kit', 'Available'),
(1, 3, 'Meta Quest Pro Design Unit', 'Available'),
(1, 3, 'HoloLens 2 Mixed Reality Headset', 'Available'),
(1, 3, 'Valve Index Dev Station Alpha', 'Available'),

-- Category 4: AV & Media Capture Gear (Presentation, recording & stream equipment)
(1, 4, '4K Mobile Laser Projector - Unit B', 'Available'),
(1, 4, 'Sony Alpha Streaming Camera Kit', 'Available'),
(1, 4, 'Rodecaster Pro II Podcast Mixer', 'Available'),
(1, 4, 'Wireless Clip-On Lavalier Mic Array', 'Available'),
(1, 4, 'Elgato Green Screen Studio Panel', 'Available');


-- ========================================================
-- 5. SEED COMPLETED HISTORICAL RESERVATIONS (60 Bookings)
-- ========================================================
-- Status = 'Completed'. All time frames exist strictly in the past (Prior to mid-May 2026)
INSERT INTO BOOKINGS (B_id, Org_id, U_id, Res_id, Status, Start_Time, End_Time) VALUES
-- Org 1: Executive Boardroom (Res 1) Historic Cycles
(1, 1, 3, 1, 'Completed', '2026-05-01 09:00:00', '2026-05-01 11:00:00'),
(2, 1, 4, 1, 'Completed', '2026-05-02 13:00:00', '2026-05-02 15:00:00'),
(3, 1, 5, 1, 'Completed', '2026-05-03 10:00:00', '2026-05-03 12:00:00'),
(4, 1, 6, 1, 'Completed', '2026-05-04 14:00:00', '2026-05-04 16:00:00'),
(5, 1, 7, 1, 'Completed', '2026-05-05 11:00:00', '2026-05-05 13:00:00'),
-- Org 1: Strategy War Room Alpha (Res 2)
(6, 1, 8, 2, 'Completed', '2026-05-01 10:00:00', '2026-05-01 12:00:00'),
(7, 1, 9, 2, 'Completed', '2026-05-02 14:00:00', '2026-05-02 16:00:00'),
(8, 1, 10, 2, 'Completed', '2026-05-03 09:00:00', '2026-05-03 11:00:00'),
(9, 1, 3, 2, 'Completed', '2026-05-04 15:00:00', '2026-05-04 17:00:00'),
(10, 1, 4, 2, 'Completed', '2026-05-05 13:00:00', '2026-05-05 15:00:00'),
-- Org 1: Huddle Space Delta (Res 3)
(11, 1, 5, 3, 'Completed', '2026-05-01 08:30:00', '2026-05-01 09:30:00'),
(12, 1, 6, 3, 'Completed', '2026-05-02 11:00:00', '2026-05-02 12:00:00'),
(13, 1, 7, 3, 'Completed', '2026-05-03 14:00:00', '2026-05-03 15:00:00'),
(14, 1, 8, 3, 'Completed', '2026-05-04 10:30:00', '2026-05-04 11:30:00'),
(15, 1, 9, 3, 'Completed', '2026-05-05 16:00:00', '2026-05-05 17:00:00'),
-- Org 1: Macbook Pro M5 (Res 4)
(16, 1, 10, 4, 'Completed', '2026-05-06 09:00:00', '2026-05-06 17:00:00'),
(17, 1, 3, 4, 'Completed', '2026-05-07 09:00:00', '2026-05-07 17:00:00'),
(18, 1, 4, 4, 'Completed', '2026-05-08 09:00:00', '2026-05-08 17:00:00'),
(19, 1, 5, 4, 'Completed', '2026-05-09 09:00:00', '2026-05-09 17:00:00'),
(20, 1, 6, 4, 'Completed', '2026-05-10 09:00:00', '2026-05-10 17:00:00'),
-- Org 1: HP EliteBook 450 G7 (Res 5)
(21, 1, 7, 5, 'Completed', '2026-05-06 10:00:00', '2026-05-06 14:00:00'),
(22, 1, 8, 5, 'Completed', '2026-05-07 12:00:00', '2026-05-07 16:00:00'),
(23, 1, 9, 5, 'Completed', '2026-05-08 08:00:00', '2026-05-08 12:00:00'),
(24, 1, 10, 5, 'Completed', '2026-05-09 13:00:00', '2026-05-09 17:00:00'),
(25, 1, 3, 5, 'Completed', '2026-05-10 11:00:00', '2026-05-10 15:00:00'),
-- Org 1: ThinkPad P16 Workstation (Res 6)
(26, 1, 4, 6, 'Completed', '2026-05-11 09:00:00', '2026-05-11 13:00:00'),
(27, 1, 5, 6, 'Completed', '2026-05-12 14:00:00', '2026-05-12 18:00:00'),
(28, 1, 6, 6, 'Completed', '2026-05-13 10:00:00', '2026-05-13 14:00:00'),
(29, 1, 7, 6, 'Completed', '2026-05-14 13:00:00', '2026-05-14 17:00:00'),
(30, 1, 8, 6, 'Completed', '2026-05-15 09:00:00', '2026-05-15 13:00:00'),
-- Org 1: Oculus Quest 3 (Res 7)
(31, 1, 9, 7, 'Completed', '2026-05-11 10:00:00', '2026-05-11 11:00:00'),
(32, 1, 10, 7, 'Completed', '2026-05-12 15:00:00', '2026-05-12 16:00:00'),
(33, 1, 3, 7, 'Completed', '2026-05-13 11:00:00', '2026-05-13 12:00:00'),
(34, 1, 4, 7, 'Completed', '2026-05-14 16:00:00', '2026-05-14 17:00:00'),
(35, 1, 5, 7, 'Completed', '2026-05-15 14:00:00', '2026-05-15 15:00:00'),
-- Org 1: Apple Vision Pro Dev-Kit (Res 8)
(36, 1, 6, 8, 'Completed', '2026-05-11 11:00:00', '2026-05-11 12:00:00'),
(37, 1, 7, 8, 'Completed', '2026-05-12 13:00:00', '2026-05-12 14:00:00'),
(38, 1, 8, 8, 'Completed', '2026-05-13 09:00:00', '2026-05-13 10:00:00'),
(39, 1, 9, 8, 'Completed', '2026-05-14 15:00:00', '2026-05-14 16:00:00'),
(40, 1, 10, 8, 'Completed', '2026-05-15 10:00:00', '2026-05-15 11:00:00'),
-- Org 1: Podcast Microphone Kit (Res 9)
(41, 1, 3, 9, 'Completed', '2026-05-12 09:00:00', '2026-05-12 12:00:00'),
(42, 1, 4, 9, 'Completed', '2026-05-13 13:00:00', '2026-05-13 16:00:00'),
(43, 1, 5, 9, 'Completed', '2026-05-14 10:00:00', '2026-05-14 13:00:00'),
(44, 1, 6, 9, 'Completed', '2026-05-15 14:00:00', '2026-05-15 17:00:00'),
(45, 1, 7, 9, 'Completed', '2026-05-16 11:00:00', '2026-05-16 14:00:00'),

-- Org 2: Confidential Pod 101 (Res 11)
(46, 2, 13, 11, 'Completed', '2026-05-10 10:00:00', '2026-05-10 11:30:00'),
(47, 2, 14, 11, 'Completed', '2026-05-11 14:00:00', '2026-05-11 15:30:00'),
(48, 2, 15, 11, 'Completed', '2026-05-12 09:00:00', '2026-05-12 10:30:00'),
(49, 2, 16, 11, 'Completed', '2026-05-13 13:00:00', '2026-05-13 14:30:00'),
(50, 2, 17, 11, 'Completed', '2026-05-14 11:00:00', '2026-05-14 12:30:00'),
-- Org 2: Sandbox Linux Array Server Alpha (Res 13)
(51, 2, 13, 13, 'Completed', '2026-05-10 08:00:00', '2026-05-10 12:00:00'),
(52, 2, 14, 13, 'Completed', '2026-05-11 13:00:00', '2026-05-11 17:00:00'),
(53, 2, 15, 13, 'Completed', '2026-05-12 09:00:00', '2026-05-12 13:00:00'),
(54, 2, 16, 13, 'Completed', '2026-05-13 14:00:00', '2026-05-13 18:00:00'),
(55, 2, 17, 13, 'Completed', '2026-05-14 10:00:00', '2026-05-14 14:00:00'),
-- Org 2: Biometric Scanner Terminal X (Res 15)
(56, 2, 13, 15, 'Completed', '2026-05-10 09:00:00', '2026-05-10 17:00:00'),
(57, 2, 14, 15, 'Completed', '2026-05-11 09:00:00', '2026-05-11 17:00:00'),
(58, 2, 15, 15, 'Completed', '2026-05-12 09:00:00', '2026-05-12 17:00:00'),
(59, 2, 16, 15, 'Completed', '2026-05-13 09:00:00', '2026-05-13 17:00:00'),
(60, 2, 17, 15, 'Completed', '2026-05-14 09:00:00', '2026-05-14 17:00:00');


-- ========================================================
-- 6. AUDIT HISTORY LOGS (Matching UI Formatting Rules)
-- ========================================================
INSERT INTO AUDIT_LOGS (Log_id, Org_id, U_id, Action, Timestamp) VALUES
-- Org 1 Activity Timelines
(1, 1, 1, 'Zayan El-Amin created user profile: Jaffar Zaidi (jaffarzaidi11@gmail.com)', '2026-05-17 14:54:49'),
(2, 1, 1, 'Zayan El-Amin added new category: "Executive Boardrooms"', '2026-05-17 14:57:06'),
(3, 1, 1, 'Zayan El-Amin added resource: "6th Floor Executive Boardroom"', '2026-05-17 14:57:18'),
(4, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for 6th Floor Executive Boardroom from 2026-05-01 09:00:00 to 2026-05-01 11:00:00', '2026-05-17 14:57:42'),
(5, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for 6th Floor Executive Boardroom from 2026-05-17 15:00:00 to 2026-05-17 16:00:00', '2026-05-17 15:00:11'),
(6, 1, 1, 'Zayan El-Amin added resource: "HP EliteBook 450 G7"', '2026-05-17 15:05:21'),
(7, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for HP EliteBook 450 G7 from 2026-05-17 15:05:00 to 2026-05-17 16:05:00', '2026-05-17 15:05:37'),
(8, 1, 1, 'Zayan El-Amin Zayan El-Amin administrative-cancelled Jaffar Zaidi\'s booking window on HP EliteBook 450 G7', '2026-05-17 15:06:06'),
(9, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for HP EliteBook 450 G7 from 2026-05-17 15:07:00 to 2026-05-17 15:09:00', '2026-05-17 15:07:54'),
(10, 1, 1, 'Zayan El-Amin deleted resource: "HP EliteBook 450 G7" (ID: 5) - cancelled 2 active booking(s)', '2026-05-17 15:08:11'),
(11, 1, 1, 'Zayan El-Amin added resource: "Macbook Pro M5 - Asset 402"', '2026-05-17 15:09:18'),
(12, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for Macbook Pro M5 - Asset 402 from 2026-05-17 15:09:00 to 2026-05-17 15:11:00', '2026-05-17 15:09:37'),
(13, 1, 1, 'Zayan El-Amin Zayan El-Amin shifted "Macbook Pro M5 - Asset 402" status state to Maintenance', '2026-05-17 15:11:05'),
(14, 1, 1, 'Zayan El-Amin Zayan El-Amin shifted "Macbook Pro M5 - Asset 402" status state to Available', '2026-05-17 15:11:07'),
(15, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for Macbook Pro M5 - Asset 402 from 2026-05-17 15:11:00 to 2026-05-17 15:13:00', '2026-05-17 15:11:37'),
(16, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for Macbook Pro M5 - Asset 402 from 2026-05-17 15:13:00 to 2026-05-17 15:15:00', '2026-05-17 15:13:57'),
(17, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for Macbook Pro M5 - Asset 402 from 2026-05-17 15:21:00 to 2026-05-17 15:24:00', '2026-05-17 15:21:34'),
(18, 1, 1, 'Zayan El-Amin Zayan El-Amin shifted "Macbook Pro M5 - Asset 402" status state to Maintenance - automatically cancelled 1 conflict booking(s)', '2026-05-17 15:23:30'),
(19, 1, 1, 'Zayan El-Amin Zayan El-Amin shifted "Macbook Pro M5 - Asset 402" status state to Available', '2026-05-17 15:24:17'),
(20, 1, 1, 'Zayan El-Amin added new category: "VR & AR Development Kits"', '2026-05-17 15:33:29'),
(21, 1, 1, 'Zayan El-Amin added resource: "Oculus Quest 3 - Unit B"', '2026-05-17 15:33:54'),
(22, 1, 3, 'Jaffar Zaidi Jaffar Zaidi created booking for Oculus Quest 3 - Unit B from 2026-05-17 15:34:00 to 2026-05-17 15:39:00', '2026-05-17 15:34:11'),
(23, 1, 3, 'Jaffar Zaidi Jaffar Zaidi cancelled booking 77', '2026-05-17 15:34:23'),
(24, 1, 1, 'Zayan El-Amin added new category: "VR"', '2026-05-17 15:38:18'),
(25, 1, 1, 'Zayan El-Amin deleted category: "VR"', '2026-05-17 15:45:30'),

-- Org 2 Activity Timelines
(26, 2, 11, 'Mustafa Malik added new category: "Secure Meeting Pods"', '2026-05-15 09:15:00'),
(27, 2, 11, 'Mustafa Malik added resource: "Confidential Pod 101"', '2026-05-15 09:20:00'),
(28, 2, 13, 'Ethan Sterling Ethan Sterling created booking for Confidential Pod 101 from 2026-05-10 10:00:00 to 2026-05-10 11:30:00', '2026-05-15 09:45:00'),
(29, 2, 11, 'Mustafa Malik added new category: "High-Compute Sandbox Servers"', '2026-05-15 10:00:00'),
(30, 2, 11, 'Mustafa Malik added resource: "Sandbox Linux Array Server Alpha"', '2026-05-15 10:15:00');

-- some more

USE assetflow_dummy_db;

-- ========================================================
-- AUDIT LOGS FOR THE NEWLY ADDED USERS
-- ========================================================
INSERT INTO AUDIT_LOGS (Org_id, U_id, Action, Timestamp) VALUES
-- Avanza Global (Org 1) - Admin Actions by Zayan El-Amin (U_id: 1)
(1, 1, 'Zayan El-Amin created user profile: Hamza Siddiqui (hamza.s@avanza.com)', '2026-05-17 16:05:00'),
(1, 1, 'Zayan El-Amin created user profile: Elena Rostova (elena.r@avanza.com)', '2026-05-17 16:06:12'),
(1, 1, 'Zayan El-Amin created user profile: Mustafa Naqvi (mustafa.naqvi@avanza.com)', '2026-05-17 16:08:22'),
(1, 1, 'Zayan El-Amin created user profile: Amina Al-Mansoor (amina.m@avanza.com)', '2026-05-17 16:09:45'),
(1, 1, 'Zayan El-Amin created user profile: Rohan Deshmukh (rohan.d@avanza.com)', '2026-05-17 16:11:03'),
(1, 1, 'Zayan El-Amin created user profile: Sophia Lin (sophia.lin@avanza.com)', '2026-05-17 16:12:19'),
(1, 1, 'Zayan El-Amin created user profile: Bilal Farooqui (bilal.f@avanza.com)', '2026-05-17 16:14:55'),
(1, 1, 'Zayan El-Amin created user profile: Freja Lindstrom (freja.l@avanza.com)', '2026-05-17 16:15:30'),
(1, 1, 'Zayan El-Amin created user profile: Zaid Al-Shami (zaid.s@avanza.com)', '2026-05-17 16:18:11'),
(1, 1, 'Zayan El-Amin created user profile: Hannah Vance (hannah.v@avanza.com)', '2026-05-17 16:19:40'),
(1, 1, 'Zayan El-Amin created user profile: Kamil Al-Kazmi (kamil.k@avanza.com)', '2026-05-17 16:21:05'),
(1, 1, 'Zayan El-Amin created user profile: Marcus Aurelius (marcus.a@avanza.com)', '2026-05-17 16:22:50'),
(1, 1, 'Zayan El-Amin created user profile: Layla Hashmi (layla.h@avanza.com)', '2026-05-17 16:24:15'),
(1, 1, 'Zayan El-Amin created user profile: Carlos Santana (carlos.s@avanza.com)', '2026-05-17 16:25:33'),
(1, 1, 'Zayan El-Amin created user profile: Omar Mukhtar (omar.m@avanza.com)', '2026-05-17 16:27:01'),
(1, 1, 'Zayan El-Amin created user profile: Noor Al-Huda (noor.h@avanza.com)', '2026-05-17 16:29:12'),
(1, 1, 'Zayan El-Amin created user profile: Arthur Pendragon (arthur.p@avanza.com)', '2026-05-17 16:31:40'),
(1, 1, 'Zayan El-Amin created user profile: Sana Mir (sana.mir@avanza.com)', '2026-05-17 16:33:25'),
(1, 1, 'Zayan El-Amin created user profile: Tariq Aziz (tariq.aziz@avanza.com)', '2026-05-17 16:35:10'),
(1, 1, 'Zayan El-Amin created user profile: Sarah Connor (s.connor@avanza.com)', '2026-05-17 16:36:58'),

-- Zenith Fintech (Org 2) - Admin Actions by Mustafa Malik (U_id: 11)
(2, 11, 'Mustafa Malik created user profile: Farhan Al-Jamil (farhan.j@zenith.com)', '2026-05-17 16:40:15'),
(2, 11, 'Mustafa Malik created user profile: Nadia Belkacem (nadia.b@zenith.com)', '2026-05-17 16:42:30'),
(2, 11, 'Mustafa Malik created user profile: Gregory House (g.house@zenith.com)', '2026-05-17 16:44:12'),
(2, 11, 'Mustafa Malik created user profile: Mariam Al-Saud (mariam.s@zenith.com)', '2026-05-17 16:45:55'),
(2, 11, 'Mustafa Malik created user profile: Lucas Miller (lucas.m@zenith.com)', '2026-05-17 16:48:20');