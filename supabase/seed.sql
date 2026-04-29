-- =====================================================================================
-- SEED SCRIPT FOR COMN
-- Note: This script assumes you are running it in a local Supabase environment where
-- you have permissions to insert into auth.users. If you are on a hosted Supabase
-- instance, you might need to create users via the dashboard and replace the UUIDs.
-- =====================================================================================

-- 1. Create Mock Users in auth.users
-- We use fixed UUIDs so we can reference them below.
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, is_sso_user)
VALUES
('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vivek@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Vivek"}', false, false),
('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'priya@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Priya"}', false, false),
('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ravi@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Ravi"}', false, false),
('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'amit@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Amit"}', false, false)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Property
INSERT INTO public.properties (id, name, address, max_occupancy)
VALUES
('p0000000-0000-0000-0000-000000000001', 'Sunshine Hostel', '123 Main St, Bangalore', 20)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Memberships
INSERT INTO public.memberships (id, user_id, property_id, role, status, room_number)
VALUES
('m0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Admin', 'Active', 'Unit 4B'),
('m0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'Member', 'Active', 'Unit 1A'),
('m0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 'Member', 'Active', 'Unit 2C'),
('m0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000001', 'Member', 'Active', 'Unit 3D')
ON CONFLICT (id) DO NOTHING;

-- 4. Create Inventory Items
INSERT INTO public.inventory_items (id, property_id, name, category, unit, quantity, min_threshold, credit_cost, updated_by)
VALUES
('i0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Dish Soap', 'Kitchen', 'bottles', 2, 5, 5, 'a0000000-0000-0000-0000-000000000001'),
('i0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'Coffee Pods', 'Kitchen', 'boxes', 0, 2, 8, 'a0000000-0000-0000-0000-000000000004'),
('i0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 'Toilet Rolls', 'Bathroom', 'rolls', 24, 10, 2, 'a0000000-0000-0000-0000-000000000002'),
('i0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000001', 'Trash Bags', 'Cleaning', 'boxes', 5, 3, 5, 'a0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- 5. Create Maintenance Requests
INSERT INTO public.maintenance_reqs (id, property_id, created_by, title, location, priority, status, assigned_to)
VALUES
('r0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Leaking faucet in the master bathroom', 'Bathroom 2', 'Medium', 'Open', NULL),
('r0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'AC not cooling properly', 'Living Room', 'High', 'In Progress', 'a0000000-0000-0000-0000-000000000004'),
('r0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'Broken window lock', 'Bedroom 1', 'Urgent', 'Done', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 6. Create Credit Transactions Ledger
INSERT INTO public.credit_txns (id, user_id, property_id, amount, reason, action_type)
VALUES
-- Priya (Initial 100, earned 20, spent 20 = 100 net)
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 100, 'Initial balance', 'admin_adjustment'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 20, 'Bought Toilet Rolls', 'purchase'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', -20, 'Submitted maintenance request', 'maintenance_req'),

-- Vivek (Initial 50, earned 30, spent 30 = 50 net)
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 50, 'Initial balance', 'admin_adjustment'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 15, 'Bought Dish Soap', 'purchase'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 15, 'Good citizen bonus', 'admin_adjustment'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', -10, 'Submitted broken window', 'maintenance_req'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', -20, 'Checked out Toilet Rolls', 'checkout'),

-- Ravi (Initial 85, earned 10, spent 10 = 85 net)
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 85, 'Initial balance', 'admin_adjustment'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 10, 'Logged AC filter replacement', 'maintenance_req'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', -10, 'Checked out Trash Bags', 'checkout'),

-- Amit (Initial -10, earned 30, spent 40 = -10 net)
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000001', -10, 'Initial balance', 'admin_adjustment'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000001', 30, 'Bought Coffee Pods', 'purchase'),
(gen_random_uuid(), 'a0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000001', -40, 'Submitted AC request', 'maintenance_req');
