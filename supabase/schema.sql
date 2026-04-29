-- Comn Supabase Database Schema
-- All tables belong to the public schema
-- RLS enabled on all tables

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    max_occupancy INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships table
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('Admin', 'Member', 'Guest')) DEFAULT 'Member',
    status TEXT CHECK (status IN ('Active', 'Deactivated')) DEFAULT 'Active',
    room_number TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, property_id)
);

-- Inventory Items table
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    quantity INT DEFAULT 0,
    min_threshold INT DEFAULT 5,
    credit_cost INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Checkouts log
CREATE TABLE checkouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    credit_cost INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases log
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Requests
CREATE TABLE maintenance_reqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    status TEXT CHECK (status IN ('Open', 'In Progress', 'Done', 'Cancelled')) DEFAULT 'Open',
    assigned_to UUID REFERENCES auth.users(id),
    photos TEXT[], -- array of storage URLs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments on requests
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES maintenance_reqs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable Credit Ledger
CREATE TABLE credit_txns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    reason TEXT NOT NULL,
    action_type TEXT NOT NULL, -- e.g., 'checkout', 'purchase', 'maintenance_req', 'admin_adjustment'
    reference_id UUID, -- ID of the related record (checkout_id, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log for Admin actions
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    details JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications queue
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    read boolean DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) setup (Basic Examples)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_txns ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic Policies (can be refined later)
-- Users can see properties they are members of
CREATE POLICY "Users can view their properties" ON properties 
    FOR SELECT USING (id IN (SELECT property_id FROM memberships WHERE user_id = auth.uid()));

-- Users can see memberships for their properties
CREATE POLICY "Users can view memberships of their properties" ON memberships
    FOR SELECT USING (property_id IN (SELECT property_id FROM memberships WHERE user_id = auth.uid()));

-- Users can view inventory items for their properties
CREATE POLICY "Users can view inventory" ON inventory_items
    FOR SELECT USING (property_id IN (SELECT property_id FROM memberships WHERE user_id = auth.uid()));

-- Admins can manage inventory items
CREATE POLICY "Admins can manage inventory" ON inventory_items
    FOR ALL USING (
        property_id IN (
            SELECT property_id FROM memberships 
            WHERE user_id = auth.uid() AND role = 'Admin'
        )
    );

-- Similar read policies for other tables (scoped to property_id)
-- Credit ledger is append-only for everyone
CREATE POLICY "Users can view their own credit history" ON credit_txns
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all credit history" ON credit_txns
    FOR SELECT USING (
        property_id IN (
            SELECT property_id FROM memberships 
            WHERE user_id = auth.uid() AND role = 'Admin'
        )
    );
