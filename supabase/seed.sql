-- Seed data for projects
insert into public.projects (name, county, constituency, sector, status, budget_allocated, budget_spent, risk_score, start_date, end_date, latitude, longitude)
values
  ('Nairobi BRT Corridor 2', 'Nairobi', 'Embakasi East', 'Transport', 'Stalled', 15200000000, 5800000000, 82, '2023-03-01', null, -1.3172, 36.9144),
  ('Kisumu Smart City Backbone', 'Kisumu', 'Kisumu Central', 'ICT', 'Delayed', 4800000000, 1900000000, 68, '2023-07-15', null, -0.0917, 34.7680),
  ('Nakuru Level 5 Expansion', 'Nakuru', 'Nakuru Town East', 'Health', 'In progress', 6200000000, 3200000000, 54, '2022-11-10', null, -0.3031, 36.0800),
  ('Mombasa Mainland Reservoir', 'Mombasa', 'Kisauni', 'Water', 'Delayed', 8700000000, 4100000000, 73, '2023-02-20', null, -4.0217, 39.6666),
  ('Uasin Gishu Sports Complex', 'Uasin Gishu', 'Ainabkoi', 'Sports', 'On track', 4100000000, 2200000000, 41, '2022-09-05', '2025-06-30', 0.5143, 35.2698);

-- Seed data for leaders (County Governors)
insert into public.leaders (name, position, county, constituency, party, term, allegations_count, projects_overseen, budget_managed, accountability_score, phone, email, photo_url, recent_actions, key_projects, social_twitter, social_facebook)
values
  ('Abdullswamad Shariff Nassir', 'County Governor', 'Mombasa', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Fatuma Mohamed Achani', 'County Governor', 'Kwale', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Gideon Maitha Mung''aro', 'County Governor', 'Kilifi', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dhadho Godhana', 'County Governor', 'Tana River', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Issa Abdallah Timamy', 'County Governor', 'Lamu', 'County-wide', 'ANC', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Andrew Mwadime', 'County Governor', 'Taita Taveta', 'County-wide', 'Independent', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Nathif Adam Jama', 'County Governor', 'Garissa', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Ahmed Abdullahi Jiir', 'County Governor', 'Wajir', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Mohamed Adan Khalif', 'County Governor', 'Mandera', 'County-wide', 'UDM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Mohamud Mohamed Ali', 'County Governor', 'Marsabit', 'County-wide', 'UDM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Abdi Ibrahim Hassan', 'County Governor', 'Isiolo', 'County-wide', 'Jubilee', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Isaac Mutuma M''ethingia', 'County Governor', 'Meru', 'County-wide', 'Independent', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Muthomi Njuki', 'County Governor', 'Tharaka Nithi', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Cecily Mutitu Mbarire', 'County Governor', 'Embu', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. Julius Makau Malombe', 'County Governor', 'Kitui', 'County-wide', 'WDM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Wavinya Ndeti', 'County Governor', 'Machakos', 'County-wide', 'WDM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Mutula Kilonzo Jr', 'County Governor', 'Makueni', 'County-wide', 'WDM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. Moses Ndirangu Kiarie Badilisha', 'County Governor', 'Nyandarua', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. Edward Mutahi Kahiga', 'County Governor', 'Nyeri', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Anne Mumbi Waiguru', 'County Governor', 'Kirinyaga', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. Irungu Kang''ata', 'County Governor', 'Murang''a', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. Paul Kimani Wamatangi', 'County Governor', 'Kiambu', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Jeremiah Ekamais Lomorukai', 'County Governor', 'Turkana', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Simon Kachapin Kitalei', 'County Governor', 'West Pokot', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Jonathan Lelelit Lati', 'County Governor', 'Samburu', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('George Natembeya', 'County Governor', 'Trans Nzoia', 'County-wide', 'DAP-K', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Jonathan Bii', 'County Governor', 'Uasin Gishu', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Wisley Rotich', 'County Governor', 'Elgeyo Marakwet', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Stephen Kipyego Sang', 'County Governor', 'Nandi', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Benjamin Chesire Cheboi', 'County Governor', 'Baringo', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Joshua Wakahora Irungu', 'County Governor', 'Laikipia', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Susan Wakarura Kihika', 'County Governor', 'Nakuru', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Patrick Keturet Ole Ntutu', 'County Governor', 'Narok', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Joseph Jama Ole Lenku', 'County Governor', 'Kajiado', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. Erick Kipkoech Mutai', 'County Governor', 'Kericho', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Prof. Hillary K. Barchok', 'County Governor', 'Bomet', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Fernandes Odinga Barasa', 'County Governor', 'Kakamega', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. Wilber Khasilwa Ottichilo', 'County Governor', 'Vihiga', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Kenneth Makelo Lusaka', 'County Governor', 'Bungoma', 'County-wide', 'FORD-Kenya', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. Paul Nyongesa Otuoma', 'County Governor', 'Busia', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('James Orengo', 'County Governor', 'Siaya', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Prof. Peter Anyang'' Nyong''o', 'County Governor', 'Kisumu', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Gladys Atieno Nyasuna Wanga', 'County Governor', 'Homa Bay', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Dr. George Ochilo M. Ayacko', 'County Governor', 'Migori', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Paul Simba Arati', 'County Governor', 'Kisii', 'County-wide', 'ODM', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Amos Kimwomi Nyaribo', 'County Governor', 'Nyamira', 'County-wide', 'UPA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null),
  ('Johnson Sakaja', 'County Governor', 'Nairobi', 'County-wide', 'UDA', '2022-2027', 0, 0, 0, 0, null, null, null, null, null, null, null);

-- Seed data for expenditures (State House category example)
insert into public.expenditures (category, amount, date, description, status, risk_score, reference_url, source, tags)
values
  ('State House', 214000000, '2025-04-12', 'Petty cash withdrawals without approvals', 'Under investigation', 86, 'https://oagkenya.go.ke/reports', 'Office of the Auditor-General', '{unauthorized,petty-cash}'),
  ('State House', 96000000, '2025-02-28', 'Protocol events with missing vouchers', 'Unexplained', 74, 'https://cob.go.ke/downloads', 'Controller of Budget', '{unsupported,missing-receipts}'),
  ('State House', 58000000, '2025-03-15', 'Fuel and fleet overbilling versus GPS logs', 'At risk', 62, 'https://ppoa.go.ke/resources', 'PPRA spot-check', '{overbilling,fleet}'),
  ('State House', 131000000, '2025-01-30', 'Security equipment double payments', 'Escalated', 80, 'https://oagkenya.go.ke/special-reports', 'OAG Special Audit', '{duplicate-payments,security}');
