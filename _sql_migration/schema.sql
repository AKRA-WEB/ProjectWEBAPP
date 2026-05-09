-- Master SQL Schema for AKRA Web Apps Migration to Supabase

-- 1. Authentication & Authorization
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- Employee ID
    name TEXT NOT NULL,
    roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE app_config (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    url TEXT,
    roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Master Data
CREATE TABLE products (
    sku TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT,
    category TEXT,
    vendor TEXT REFERENCES vendors(name),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vendors (
    name TEXT PRIMARY KEY,
    contact_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Purchase Request (PR)
CREATE TYPE pr_status AS ENUM ('Pending', 'Approved', 'Rejected', 'Bought');

CREATE TABLE purchase_requests (
    pr_uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pr_date TIMESTAMPTZ DEFAULT NOW(),
    pr_number TEXT NOT NULL,
    requester TEXT NOT NULL,
    warehouse TEXT NOT NULL,
    sku TEXT REFERENCES products(sku),
    product TEXT NOT NULL,
    request_qty DECIMAL(10,2) NOT NULL CHECK (request_qty > 0),
    unit TEXT NOT NULL,
    remark TEXT,
    status pr_status DEFAULT 'Pending',
    approver_remark TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Purchase Order (PO)
CREATE TYPE po_status AS ENUM ('Pending GR', 'Draft GR', 'Pending Review', 'GR Completed', 'PO Closed - Ready for APV');

CREATE TABLE purchase_orders (
    po_uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_pr_uid UUID REFERENCES purchase_requests(pr_uid),
    po_date TIMESTAMPTZ DEFAULT NOW(),
    po_number TEXT,
    vendor TEXT NOT NULL,
    warehouse TEXT NOT NULL,
    sku TEXT REFERENCES products(sku),
    product TEXT NOT NULL,
    po_qty DECIMAL(10,2) NOT NULL CHECK (po_qty > 0),
    unit TEXT NOT NULL,
    expected_date DATE,
    status po_status DEFAULT 'Pending GR',
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Goods Receipt (GR)
CREATE TABLE goods_receipts (
    gr_uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_po_uid UUID REFERENCES purchase_orders(po_uid),
    ata DATE NOT NULL,
    receiver_name TEXT NOT NULL,
    remark TEXT,
    sku TEXT REFERENCES products(sku),
    product TEXT NOT NULL,
    gr_qty DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    loc_in TEXT,
    exp TEXT,
    old_stock DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Warehouse W1
CREATE TABLE w1_products (
    id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE w1_requests (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    item_name TEXT NOT NULL,
    request_qty INTEGER NOT NULL DEFAULT 0,
    status TEXT,
    old_expiry TEXT,
    new_expiry TEXT,
    receive_qty INTEGER,
    receive_note TEXT,
    w2_note TEXT,
    storage_capacity INTEGER DEFAULT 0
);

-- 7. Warehouse W5
CREATE TABLE w5_inventory (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    unit TEXT DEFAULT 'ชิ้น',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE w5_history (
    id BIGSERIAL PRIMARY KEY,
    transaction_timestamp TIMESTAMPTZ DEFAULT NOW(),
    transaction_type TEXT CHECK (transaction_type IN ('in', 'out', 'adjust')), 
    product_id INTEGER REFERENCES w5_inventory(id) ON DELETE SET NULL,
    product_name TEXT,
    qty INTEGER NOT NULL,
    user_name TEXT
);

CREATE TABLE w5_picklists (
    pick_id TEXT,
    product_id INTEGER REFERENCES w5_inventory(id) ON DELETE CASCADE,
    product_name TEXT,
    qty INTEGER NOT NULL,
    actual_qty INTEGER,
    requested_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (pick_id, product_id)
);

-- 8. KPI Tracker
CREATE TABLE daily_records (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    branch TEXT NOT NULL,
    vol_transfer INTEGER DEFAULT 0,
    vol_pickup INTEGER DEFAULT 0,
    vol_upcountry INTEGER DEFAULT 0,
    vol_inmarket INTEGER DEFAULT 0,
    vol_outmarket INTEGER DEFAULT 0,
    customer_notes TEXT,
    tasks_raw TEXT, -- For legacy format
    errors_raw TEXT, -- For legacy format
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE error_logs (
    id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES daily_records(id) ON DELETE CASCADE,
    employee_id TEXT,
    error_type TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES daily_records(id) ON DELETE CASCADE,
    task_name TEXT,
    status TEXT,
    assignees TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Returns & Claims
CREATE TABLE returns (
    id TEXT PRIMARY KEY,
    date_str TEXT,
    time_str TEXT,
    sku TEXT,
    name TEXT,
    qty DECIMAL(10,2),
    unit TEXT,
    source TEXT,
    reason TEXT,
    bill_status TEXT,
    compensation TEXT,
    bill_no TEXT,
    status TEXT,
    qc_condition TEXT,
    customer_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE claims (
    id TEXT PRIMARY KEY,
    report_date DATE,
    exp_date DATE,
    found_location TEXT,
    sku TEXT,
    name TEXT,
    qty DECIMAL(10,2),
    unit TEXT,
    reason TEXT,
    remark TEXT,
    vendor TEXT,
    claim_bill_no TEXT,
    claim_amount DECIMAL(10,2),
    claim_type TEXT,
    reporter TEXT,
    status TEXT,
    wh_status TEXT,
    wh_location TEXT,
    wh_receiver TEXT,
    return_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_tasks (
    task_id TEXT,
    created_date DATE,
    created_by TEXT,
    row_id TEXT PRIMARY KEY,
    target_wh TEXT,
    sku TEXT,
    name TEXT,
    unit TEXT,
    trd_count_by TEXT,
    trd_status TEXT,
    trd_count_qty DECIMAL(10,2),
    akra_count_by TEXT,
    akra_status TEXT,
    akra_count_qty DECIMAL(10,2),
    sys_stock DECIMAL(10,2),
    stock_diff DECIMAL(10,2),
    overall_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. System Logs
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    type TEXT,
    app_id TEXT,
    message TEXT,
    user_name TEXT
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE w1_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE w1_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE w5_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE w5_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE w5_picklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for migration, should be refined for production)
CREATE POLICY "Allow public read for all" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read for all" ON app_config FOR SELECT USING (true);
CREATE POLICY "Allow public read for all" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read for all" ON vendors FOR SELECT USING (true);
-- ... more policies can be added here. For now, we will use a more open policy for development.
CREATE POLICY "Allow all actions for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON app_config FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON products FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON vendors FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON purchase_requests FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON purchase_orders FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON goods_receipts FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON w1_products FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON w1_requests FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON w5_inventory FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON w5_history FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON w5_picklists FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON daily_records FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON error_logs FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON returns FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON claims FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON audit_tasks FOR ALL USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON system_logs FOR ALL USING (true);

-- Initial Data (Users)
INSERT INTO users (id, name, roles) VALUES
('250002', 'TOP', '{TRD}'),
('250007', 'YONG', '{AKRA}'),
('250008', 'NONGMAI', '{TRD}'),
('250010', 'ENG', '{AKRA}'),
('250022', 'BUNLENG', '{AKRA}'),
('250024', 'BOY', '{TRD}'),
('250025', 'PUSH', '{AKRA}'),
('250027', 'JAME', '{TRD}'),
('250028', 'SAN', '{AKRA}'),
('172980', 'CHEN', '{ADMIN}'),
('hhsawyer', 'Hereford', '{ADMIN}'),
('Stamp1112', 'STAMP', '{ADMIN}'),
('250023', 'MAPRANG', '{TRD,Cashier}');

-- Initial Data (App Config)
INSERT INTO app_config (id, name, icon, url, roles) VALUES
('app-w5', 'เบิก W5', 'package-minus', 'AKRA W5.html', '{ADMIN, AKRA, WAREHOUSE, Cashier}'),
('app-trd', 'ย้ายสินค้า', 'arrow-right-left', 'Tranfers W2-W1.html', '{ADMIN, AKRA, TRD, WAREHOUSE, Cashier}'),
('app-gr', 'รับสินค้า', 'clipboard-list', 'GR.html', '{ADMIN, AKRA, WAREHOUSE, Cashier}'),
('app-pr', 'PR ขอซื้อ', 'file-plus-2', 'PR.html', '{ADMIN, AKRA, WAREHOUSE, Cashier}'),
('app-tracking', 'Track PO', 'truck', 'PO.html', '{ADMIN, AKRA, TRD, WAREHOUSE, Cashier}'),
('app-damage', 'ของคืน/เคลม', 'package-x', 'Return&Claim.html', '{ADMIN, AKRA, TRD, WAREHOUSE, Cashier}'),
('app-kpi', 'KPI Tracker', 'bar-chart-2', 'KPI.html', '{ADMIN, AKRA, TRD, WAREHOUSE, Cashier}');
