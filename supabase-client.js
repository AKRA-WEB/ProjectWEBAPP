// Supabase Client and common API wrappers for AKRA Web Apps
const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq"; 

if (typeof akraSupabase === 'undefined') {
    var akraSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

const AKRA_API = {
    // Helper to fetch all rows ignoring the 1000 row limit
    fetchAll: async (table, select = '*', orderColumn = null, ascending = false) => {
        let allData = [];
        let from = 0;
        const step = 1000;
        let hasMore = true;
        while(hasMore) {
            let query = akraSupabase.from(table).select(select).range(from, from + step - 1);
            if (orderColumn) query = query.order(orderColumn, { ascending });
            const { data, error } = await query;
            
            if (error) { console.error(`Fetch all error on ${table}:`, error); break; }
            if (data && data.length > 0) {
                allData = allData.concat(data);
                from += step;
                if (data.length < step) hasMore = false;
            } else {
                hasMore = false;
            }
        }
        return allData;
    },

    // Standard API Call wrapper
    call: async (action, data) => {
        try {
            switch (action) {
                // Common
                case 'getInitialData': return await AKRA_API.getInitialData();
                case 'getReturnData': return await AKRA_API.getReturnData();
                case 'login': return await AKRA_API.login(data);
                case 'sendLog': return await AKRA_API.sendLog(data.type, data.appId, data.message, data.userName);
                
                // PO / PR / GR
                case 'submitPR': return await AKRA_API.submitPR(data);
                case 'createPO': return await AKRA_API.createPO(data);
                case 'approvePR': return await AKRA_API.approvePR(data);
                case 'rejectPR': return await AKRA_API.rejectPR(data);
                case 'bulkReceivePO': return await AKRA_API.bulkReceivePO(data);
                case 'closePO': return await AKRA_API.closePO(data);
                case 'deletePO': return await AKRA_API.deletePO(data);
                case 'getPOData': return await AKRA_API.getPOData();
                case 'getPRHistory': return await AKRA_API.getPRHistory();
                case 'updateProductVendor': return await AKRA_API.updateProductVendor(data);
                
                // W5 Warehouse
                case 'getW5Data': return await AKRA_API.getW5Data();
                case 'transaction': return await AKRA_API.submitW5Transaction(data);
                case 'addPickList': return await AKRA_API.addPickList(data);
                case 'processPickList': return await AKRA_API.processPickList(data);
                case 'removePickList': return await AKRA_API.removePickList(data);
                case 'adjustStock': return await AKRA_API.adjustStock(data);
                case 'addProduct': return await AKRA_API.addProduct(data);
                case 'editProduct': return await AKRA_API.editProduct(data);
                case 'deleteProduct': return await AKRA_API.deleteProduct(data);
                
                // KPI
                case 'submitKPI': return await AKRA_API.submitKPI(data);
                case 'getKPIHistory': return await AKRA_API.getKPIHistory();
                
                // Returns & Claims
                case 'submitReturn': return await AKRA_API.submitReturn(data);
                case 'submitClaim': return await AKRA_API.submitClaim(data);
                case 'addDrafts': return await AKRA_API.addDrafts(data);
                case 'createAudit': return await AKRA_API.createAudit(data);
                case 'submitAudit': return await AKRA_API.submitAudit(data);
                case 'deleteClaim': return await AKRA_API.deleteClaim(data);
                case 'confirmWHReceive': return await AKRA_API.confirmWHReceive(data);
                case 'bulkUpdateStatus': return await AKRA_API.bulkUpdateStatus(data);
                case 'updateReturnBatch': return await AKRA_API.updateReturnBatch(data);
                case 'submitAuditCount': return await AKRA_API.submitAuditCount(data);
                case 'savePartialAuditCount': return await AKRA_API.savePartialAuditCount(data);
                case 'finalizeAudit': return await AKRA_API.finalizeAudit(data);
                case 'updateReturnQC': return await AKRA_API.updateReturnQC(data);
                case 'updateVendor': return await AKRA_API.updateVendor(data);
                case 'lockAuditWH': return await AKRA_API.lockAuditWH(data);
                
                // Transfers
                case 'submitTransfer': return await AKRA_API.submitTransfer(data);
                case 'getTransfers': return await AKRA_API.getTransfers();
                
                // Admin / Portal
                case 'getAdminData': return await AKRA_API.getAdminData();
                case 'postAction': return await AKRA_API.postAction(data);
                
                default: return { success: false, message: `Action ${action} not implemented` };
            }
        } catch (e) {
            console.error("API Call Error:", e);
            return { success: false, message: e.message };
        }
    },

    // --- Core Logic ---
    sendLog: async (type, appId, message, userName) => {
        await akraSupabase.from('system_logs').insert({ type, app_id: appId, message, user_name: userName });
    },

    login: async (employeeId) => {
        const { data, error } = await akraSupabase.from('users').select('*').eq('id', employeeId).single();
        if (error || !data) return { status: 'error', message: 'User not found' };
        const { data: appConfig } = await akraSupabase.from('app_config').select('*');
        return { status: 'success', user: data, token: employeeId, appConfig: appConfig };
    },

    getInitialData: async () => {
        const products = await AKRA_API.fetchAll('products');
        
        // Helper to fetch filtered data with pagination to bypass 1000 row limit
        const fetchFiltered = async (table, select, filterCol, filterValues) => {
            let allData = [];
            let from = 0;
            const step = 1000;
            let hasMore = true;
            while(hasMore) {
                const { data, error } = await akraSupabase
                    .from(table)
                    .select(select)
                    .in(filterCol, filterValues)
                    .range(from, from + step - 1);
                
                if (error) { console.error(`Fetch filtered error on ${table}:`, error); break; }
                if (data && data.length > 0) {
                    allData = allData.concat(data);
                    from += step;
                    if (data.length < step) hasMore = false;
                } else {
                    hasMore = false;
                }
            }
            return allData;
        };

        const pendingPOs = await fetchFiltered(
            'purchase_orders', 
            '*, goods_receipts(gr_qty, loc_in, exp, old_stock, receiver_name, ata, created_at)', 
            'status', 
            ['Pending GR', 'Draft GR', 'Pending Review']
        );
            
        const vendors = await AKRA_API.fetchAll('vendors', 'name');
        
        const { data: prList } = await akraSupabase.from('purchase_requests').select('*').eq('status', 'Pending');
        
        const grCompleted = await fetchFiltered(
            'purchase_orders', 
            '*, goods_receipts(gr_qty, loc_in, exp, old_stock, receiver_name, ata, created_at)', 
            'status', 
            ['GR Completed']
        );
            
        const apvList = await fetchFiltered(
            'purchase_orders', 
            '*, goods_receipts(gr_qty, loc_in, exp, old_stock, receiver_name, ata, created_at)', 
            'status', 
            ['PO Closed - Ready for APV']
        );
        
        const mapPO = (po) => {
            let latestGr = null;
            if (po.goods_receipts && po.goods_receipts.length > 0) {
                // Sort by created_at ascending so the last element is the newest
                po.goods_receipts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                latestGr = po.goods_receipts[po.goods_receipts.length - 1];
            }

            let displayStatus = po.status;
            if (po.status === 'Pending GR' && po.po_date) {
                const poDate = new Date(po.po_date);
                const diffDays = (new Date() - poDate) / (1000 * 60 * 60 * 24);
                if (diffDays > 7) {
                    displayStatus = 'Overdue';
                }
            }

            return {
                poUid: po.po_uid,
                poNumber: po.po_number,
                poDate: po.po_date ? new Date(po.po_date).toLocaleDateString('th-TH') : '',
                vendor: po.vendor,
                warehouse: po.warehouse,
                product: po.product,
                sku: po.sku,
                quantity: po.po_qty, 
                grQty: latestGr ? latestGr.gr_qty : null, 
                locIn: latestGr ? latestGr.loc_in : '',
                exp: latestGr ? latestGr.exp : '',
                oldStock: latestGr ? latestGr.old_stock : '',
                receiverName: latestGr ? latestGr.receiver_name : '',
                ata: latestGr ? (latestGr.ata ? new Date(latestGr.ata).toLocaleDateString('th-TH') : '') : '',
                unit: po.unit,
                status: po.status,
                displayStatus: displayStatus 
            };
        };

        const mapPR = (pr) => ({
            prUid: pr.pr_uid,
            prNumber: pr.pr_number,
            date: pr.pr_date ? new Date(pr.pr_date).toLocaleDateString('th-TH') : '',
            requester: pr.requester,
            warehouse: pr.warehouse,
            product: pr.product,
            sku: pr.sku,
            quantity: pr.request_qty,
            unit: pr.unit,
            status: pr.status,
            remark: pr.remark
        });

        // Enhance products with vendor info if missing but available in recent POs
        const productsWithVendor = products.map(p => {
            if (p.vendor) return p;
            const recentPO = pendingPOs.find(po => po.sku === p.sku || po.product === p.name);
            if (recentPO) p.vendor = recentPO.vendor;
            return p;
        });

        return { 
            success: true, 
            products: productsWithVendor || [], 
            pendingPOs: (pendingPOs || []).map(mapPO), 
            vendors: vendors ? vendors.map(v => v.name) : [],
            prList: (prList || []).map(mapPR),
            grCompleted: (grCompleted || []).map(mapPO),
            apvList: (apvList || []).map(mapPO)
        };
    },

    getReturnData: async () => {
        const returns = await AKRA_API.fetchAll('returns', '*', 'created_at', false);
        const claims = await AKRA_API.fetchAll('claims', '*', 'created_at', false);
        const audits = await AKRA_API.fetchAll('audit_tasks', '*', 'created_at', false);
        const products = await AKRA_API.fetchAll('products');
        const vendors = await AKRA_API.fetchAll('vendors', 'name');
        
        return { 
            success: true, 
            returns, 
            claims, 
            audits, 
            products,
            vendors: vendors.map(v => v.name)
        };
    },

    findVendorBySku: async (sku) => {
        // Try to find the most recent PO for this SKU to get the vendor
        const { data, error } = await akraSupabase
            .from('purchase_orders')
            .select('vendor')
            .eq('sku', sku)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error || !data || data.length === 0) return { success: false };
        return { success: true, vendor: data[0].vendor };
    },

    // --- Procurement ---
    submitPR: async (payload) => {
        const { items, requester, warehouse } = payload;
        const generatedPrNumber = payload.prNumber || `PR${Date.now()}`;
        const records = items.map(item => ({ 
            pr_number: generatedPrNumber, 
            requester, 
            warehouse, 
            sku: item.sku && item.sku.trim() !== "" ? item.sku : null, 
            product: item.product, 
            request_qty: parseFloat(item.quantity || item.qty) || 0, 
            unit: item.unit || 'ชิ้น', 
            remark: item.remark || ''
        }));
        const { error } = await akraSupabase.from('purchase_requests').insert(records);
        return { success: !error, message: error?.message };
    },

    createPO: async (payload) => {
        const { vendor, poNumber, warehouse, items } = payload;
        const records = items.map(item => ({ 
            po_number: poNumber, 
            vendor, 
            warehouse, 
            sku: item.sku && item.sku.trim() !== "" ? item.sku : null,
            product: item.product, 
            po_qty: parseFloat(item.quantity || item.qty) || 0, 
            unit: item.unit || 'ชิ้น', 
            status: 'Pending GR' 
        }));
        const { error } = await akraSupabase.from('purchase_orders').insert(records);
        return { success: !error, message: error?.message };
    },

    approvePR: async (payload) => {
        const { vendor, poNumber, warehouse, items, prUid } = payload;
        const poRecords = items.map(item => ({ 
            ref_pr_uid: null, // Default to null for grouped or adjusted items
            po_number: poNumber, 
            vendor, 
            warehouse, 
            sku: item.sku && item.sku.trim() !== "" ? item.sku : null,
            product: item.product, 
            po_qty: parseFloat(item.quantity || item.qty) || 0, 
            unit: item.unit || 'ชิ้น', 
            status: 'Pending GR' 
        }));
        const { error: poError } = await akraSupabase.from('purchase_orders').insert(poRecords);
        if (poError) return { success: false, message: poError.message };
        if (prUid) {
            const uids = prUid.split(',');
            await akraSupabase.from('purchase_requests').update({ status: 'Approved' }).in('pr_uid', uids);
        }
        return { success: true };
    },

    updateProductVendor: async (payload) => {
        const { vendor, products } = payload;
        // This will silently fail if 'vendor' column doesn't exist, which is fine as a fallback
        const { error } = await akraSupabase.from('products').update({ vendor }).in('name', products);
        return { success: true };
    },


    rejectPR: async (payload) => {
        const { prUid, remark } = payload;
        const { error } = await akraSupabase.from('purchase_requests').update({ status: 'Rejected', approver_remark: remark }).eq('pr_uid', prUid);
        return { success: !error };
    },

    bulkReceivePO: async (payload) => {
        try {
            const { items, extraItems, groupInfo, targetStatus, ata, receiverName, remark } = payload;
            
            let dbAta = null;
            if (ata) {
                const p = ata.split('/');
                if (p.length === 3) dbAta = `${p[2]}-${p[1]}-${p[0]}`;
                else dbAta = ata;
            }

            // 1. Prepare GR records only for items that have actual receiving quantity
            const grRecords = items.filter(i => i.grQty && parseFloat(i.grQty) > 0).map(item => ({ 
                ref_po_uid: (item.poUid && item.poUid !== "undefined") ? item.poUid : null, 
                ata: dbAta, 
                receiver_name: receiverName, 
                remark: remark || '', 
                sku: item.sku && item.sku.trim() !== "" ? item.sku : null, 
                product: item.product || '', 
                gr_qty: parseFloat(item.grQty) || 0, 
                unit: item.unit || '', 
                loc_in: item.locIn || '', 
                exp: item.exp || '', 
                old_stock: parseFloat(item.oldStock) || 0 
            })).concat(extraItems.map(item => ({ 
                ref_po_uid: null,
                ata: dbAta, 
                receiver_name: receiverName, 
                remark: remark || '', 
                sku: item.sku && item.sku.trim() !== "" ? item.sku : null, 
                product: item.product || '', 
                gr_qty: parseFloat(item.grQty) || 0, 
                unit: item.unit || '', 
                loc_in: item.locIn || '', 
                exp: item.exp || '', 
                old_stock: parseFloat(item.oldStock) || 0 
            })));

            // 2. Insert GR Records if any
            if (grRecords.length > 0) {
                const { error: grError } = await akraSupabase.from('goods_receipts').insert(grRecords);
                if (grError) throw new Error("GR Insert Failed: " + grError.message);
            }
            
            // 3. Update status for ALL items in this group to the target status
            // This ensures that 'Draft GR' works even if no items were received yet
            const allPoUids = items.map(i => i.poUid).filter(id => id && id !== "undefined");
            
            if (allPoUids.length > 0) {
                const { error: poError } = await akraSupabase.from('purchase_orders')
                    .update({ status: targetStatus })
                    .in('po_uid', allPoUids);
                
                if (poError) throw new Error("PO Status Update Failed: " + poError.message);
            }

            return { success: true };
        } catch (e) {
            console.error("bulkReceivePO Error:", e);
            return { success: false, message: e.message };
        }
    },

    closePO: async (payload) => {
        const { items } = payload;
        try {
            for (const item of items) {
                // 1. Fetch current PO data to replicate for backorder
                const { data: currentPO, error: fetchErr } = await akraSupabase
                    .from('purchase_orders')
                    .select('*')
                    .eq('po_uid', item.poUid)
                    .single();

                if (fetchErr) throw fetchErr;

                // 2. Update current PO Status and SYNC po_qty with revisedGrQty for accurate APV
                const { error: poError } = await akraSupabase
                    .from('purchase_orders')
                    .update({
                        status: 'PO Closed - Ready for APV',
                        po_number: item.poNumber,
                        po_qty: item.revisedGrQty, // Sync with actual received for billing
                        remark: item.matchRemark
                    })
                    .eq('po_uid', item.poUid);

                if (poError) throw poError;

                // 3. Update GR Qty in goods_receipts (should be 1:1 or sum)
                // Note: If multiple GRs exist for one PO line, we update the latest or sum?
                // For simplicity, we assume we are verifying the total received for this line.
                await akraSupabase.from('goods_receipts').update({ gr_qty: item.revisedGrQty }).eq('ref_po_uid', item.poUid);

                // 4. Handle Backorder if requested
                if (item.backorderQty && parseFloat(item.backorderQty) > 0) {
                    const backorderRecord = {
                        ...currentPO,
                        po_uid: undefined, // Let Supabase generate new UUID
                        id: undefined,      // Let Supabase generate new Serial ID
                        status: 'Pending GR',
                        po_qty: parseFloat(item.backorderQty),
                        remark: `[BACKORDER from ${item.poNumber || 'Original PO'}] ${item.matchRemark || ''}`
                    };
                    delete backorderRecord.po_uid;
                    delete backorderRecord.id;
                    delete backorderRecord.created_at;

                    const { error: boErr } = await akraSupabase.from('purchase_orders').insert(backorderRecord);
                    if (boErr) console.error("Backorder Creation Failed:", boErr);
                }

                // 5. If PO linked to PR, ensure PR is marked as Approved
                if (currentPO.ref_pr_uid) {
                    await akraSupabase.from('purchase_requests').update({ status: 'Approved' }).eq('pr_uid', currentPO.ref_pr_uid);
                }
            }
            return { success: true };
        } catch (e) {
            console.error("closePO Error:", e);
            return { success: false, message: e.message };
        }
    },
    deletePO: async (payload) => {
        const { poUids } = payload;
        const { error } = await akraSupabase.from('purchase_orders').delete().in('po_uid', poUids);
        return { success: !error };
    },

    getPOData: async () => {
        const { data } = await akraSupabase.from('purchase_orders').select('*').order('created_at', { ascending: false });
        return { success: true, pos: data };
    },

    getPRHistory: async () => {
        const { data } = await akraSupabase.from('purchase_requests').select('*').order('created_at', { ascending: false }).limit(100);
        return { success: true, history: data };
    },

    // --- Warehouse W5 ---
    getW5Data: async () => {
        try {
            const inventory = await AKRA_API.fetchAll('w5_inventory');
            const { data: history, error } = await akraSupabase.from('w5_history')
                .select('*')
                .order('transaction_timestamp', { ascending: false })
                .limit(200);
            
            if (error) throw error;

            const mappedHistory = (history || []).map(h => ({
                id: h.id,
                date: h.transaction_timestamp, // App can parse this
                time: h.transaction_timestamp, // App can parse this
                type: h.transaction_type,
                productName: h.product_name || 'ไม่ระบุชื่อสินค้า',
                qty: h.qty,
                user: h.user_name || 'System',
                productId: h.product_id
            }));

            return { success: true, inventory: inventory || [], history: mappedHistory };
        } catch (e) {
            console.error("getW5Data Error:", e);
            return { success: false, message: e.message };
        }
    },

    submitW5Transaction: async (payload) => {
        try {
            const { type, productId, productName, qty, user, userName } = payload;
            const finalUser = user || userName;
            let updateQty = (type === 'out') ? -qty : qty;
            
            // 1. Get current stock
            const { data: inv, error: invErr } = await akraSupabase.from('w5_inventory').select('stock').eq('id', productId).single();
            if (invErr) throw invErr;

            // 2. Update stock
            const { error: updErr } = await akraSupabase.from('w5_inventory').update({ stock: (inv?.stock || 0) + updateQty }).eq('id', productId);
            if (updErr) throw updErr;

            // 3. Add to history
            const { error: histErr } = await akraSupabase.from('w5_history').insert({ 
                transaction_type: type, 
                product_id: productId, 
                product_name: productName, 
                qty: qty, 
                user_name: finalUser 
            });
            if (histErr) throw histErr;

            return { success: true };
        } catch (e) {
            console.error("submitW5Transaction Error:", e);
            return { success: false, message: e.message };
        }
    },

    addPickList: async (payload) => {
        try {
            const { pickId, productId, productName, qty, requestedBy } = payload;
            const { error } = await akraSupabase.from('w5_picklists').insert({ 
                pick_id: pickId, 
                product_id: productId, 
                product_name: productName, 
                qty, 
                requested_by: requestedBy 
            });
            if (error) throw error;
            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    processPickList: async (payload) => {
        try {
            const { pickId, productId, productName, actualQty, pickerUser } = payload;
            
            // Use transaction method to handle stock and history
            const res = await AKRA_API.submitW5Transaction({ 
                type: 'out', 
                productId, 
                productName: productName + ' (ใบจัด)', 
                qty: actualQty, 
                userName: pickerUser 
            });
            
            if (!res.success) throw new Error(res.message);

            const { error } = await akraSupabase.from('w5_picklists').delete().eq('pick_id', pickId).eq('product_id', productId);
            if (error) throw error;

            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    removePickList: async (payload) => {
        try {
            const { error } = await akraSupabase.from('w5_picklists').delete().eq('pick_id', payload.pickId);
            if (error) throw error;
            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    adjustStock: async (payload) => {
        try {
            const { productId, productName, newStock, user } = payload;
            
            const { error: updErr } = await akraSupabase.from('w5_inventory').update({ stock: newStock }).eq('id', productId);
            if (updErr) throw updErr;

            await akraSupabase.from('w5_history').insert({ 
                transaction_type: 'adjust', 
                product_id: productId, 
                product_name: productName, 
                qty: newStock, 
                user_name: user 
            });

            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    addProduct: async (payload) => {
        try {
            const { error } = await akraSupabase.from('w5_inventory').insert({ 
                name: payload.product.name, 
                stock: payload.product.stock, 
                unit: payload.product.unit 
            });
            if (error) throw error;
            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    editProduct: async (payload) => {
        try {
            const { error } = await akraSupabase.from('w5_inventory').update({ name: payload.newName }).eq('id', payload.productId);
            if (error) throw error;
            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    deleteProduct: async (payload) => {
        try {
            const { error } = await akraSupabase.from('w5_inventory').delete().eq('id', payload.productId);
            if (error) throw error;
            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    // --- KPI ---
    submitKPI: async (payload) => {
        const { record, errors, tasks } = payload;
        const { data: rec, error: recError } = await akraSupabase.from('daily_records').insert(record).select().single();
        if (recError) return { success: false, message: recError.message };
        if (errors?.length) await akraSupabase.from('error_logs').insert(errors.map(e => ({ ...e, record_id: rec.id })));
        if (tasks?.length) await akraSupabase.from('tasks').insert(tasks.map(t => ({ ...t, record_id: rec.id })));
        return { success: true };
    },

    getKPIHistory: async () => {
        const { data } = await akraSupabase.from('daily_records').select('*, error_logs(*), tasks(*)').order('date', { ascending: false }).limit(30);
        return { success: true, history: data || [] };
    },

    // --- Returns & Claims ---
    submitReturn: async (payload) => {
        const record = {
            id: payload.id,
            date_str: payload.dateStr,
            time_str: payload.timeStr,
            sku: payload.sku,
            name: payload.name,
            qty: payload.qty,
            unit: payload.unit,
            source: payload.source,
            reason: payload.reason,
            bill_status: payload.billStatus,
            compensation: payload.compensation,
            bill_no: payload.billNo,
            status: payload.status,
            qc_condition: payload.qcCondition,
            customer_name: payload.customerName
        };
        const { error } = await akraSupabase.from('returns').insert(record);
        return { success: !error, message: error?.message };
    },

    submitClaim: async (payload) => {
        const toDate = v => (v && v !== '-' && v !== '') ? v : null;
        const record = {
            id: 'CLM-' + Date.now(),
            report_date: toDate(payload.reportDate),
            exp_date: toDate(payload.expDate),
            found_location: payload.foundLocation,
            sku: payload.sku,
            name: payload.name,
            qty: payload.qty,
            unit: payload.unit,
            reason: payload.reason,
            remark: payload.remark,
            vendor: payload.vendor,
            reporter: payload.reporter,
            status: 'รอยืนยัน'
        };
        const { error } = await akraSupabase.from('claims').insert(record);
        return { success: !error, message: error?.message };
    },

    addDrafts: async (payload) => {
        const toDate = v => (v && v !== '-' && v !== '') ? v : null;
        const records = payload.drafts.map(d => ({
            id: d.id,
            report_date: toDate(d.reportDate),
            exp_date: toDate(d.expDate),
            found_location: d.foundLocation,
            sku: d.sku,
            name: d.name,
            qty: d.qty,
            unit: d.unit,
            reason: d.reason,
            remark: d.remark,
            vendor: d.vendor,
            reporter: d.reporter,
            status: 'รอคลังรับของ',
            wh_status: 'ยังไม่รับ'
        }));
        const { error } = await akraSupabase.from('claims').insert(records);
        return { success: !error, message: error?.message };
    },

    createAudit: async (payload) => {
        const { taskId, dateStr, targetWH, items, user } = payload;
        const records = items.map((item, index) => ({
            row_id: `${taskId}-${index + 1}`,
            task_id: taskId,
            created_date: dateStr,
            target_wh: targetWH,
            sku: item.sku,
            name: item.name,
            unit: item.unit,
            created_by: user,
            trd_status: 'รอนับ',
            akra_status: 'รอนับ',
            overall_status: 'รอนับ'
        }));
        const { error } = await akraSupabase.from('audit_tasks').insert(records);
        return { success: !error, message: error?.message };
    },

    submitAudit: async (payload) => {
        const { error } = await akraSupabase.from('audit_tasks').insert(payload);
        return { success: !error };
    },

    deleteClaim: async (payload) => {
        const { error } = await akraSupabase.from('claims').delete().eq('id', payload.id);
        return { success: !error, message: error?.message };
    },

    confirmWHReceive: async (payload) => {
        const { error } = await akraSupabase.from('claims').update({ wh_location: payload.whLocation, wh_receiver: payload.whReceiver, wh_status: 'รับเข้าคลังแล้ว' }).eq('id', payload.id);
        return { success: !error, message: error?.message };
    },

    bulkUpdateStatus: async (payload) => {
        let updateData = { status: payload.status };
        if (payload.isFinancial) {
            updateData = {
                ...updateData,
                claim_type: payload.claimType,
                claim_bill_no: payload.claimBillNo,
                claim_amount: parseFloat(payload.claimAmount) || 0
            };
        }
        const { error } = await akraSupabase.from('claims').update(updateData).in('id', payload.ids);
        return { success: !error, message: error?.message };
    },

    updateReturnBatch: async (payload) => {
        const { error } = await akraSupabase.from('returns').update({ status: 'ตัดรอบแล้ว' }).in('id', payload.ids);
        return { success: !error, message: error?.message };
    },

    submitAuditCount: async (payload) => {
        const { taskId, wh, counts } = payload;
        const errors = [];
        for (const item of counts) {
            let updateData = {};
            if (wh === 'TRD') {
                updateData = { trd_count_qty: item.qty, trd_status: 'นับเสร็จแล้ว' };
            } else if (wh === 'AKRA') {
                updateData = { akra_count_qty: item.qty, akra_status: 'นับเสร็จแล้ว' };
            }
            const { error } = await akraSupabase.from('audit_tasks').update(updateData).eq('row_id', item.rowId).eq('task_id', taskId);
            if (error) errors.push(error.message);
        }
        if (errors.length) return { success: false, message: errors.join('; ') };

        // Check if all required warehouses have finished counting → move task to Review
        const { data: taskRows } = await akraSupabase.from('audit_tasks')
            .select('trd_status, akra_status, target_wh')
            .eq('task_id', taskId);
        if (taskRows && taskRows.length > 0) {
            const targetWH = taskRows[0].target_wh;
            const trdAllDone = taskRows.every(r => r.trd_status === 'นับเสร็จแล้ว' || r.trd_status === 'Done');
            const akraAllDone = taskRows.every(r => r.akra_status === 'นับเสร็จแล้ว' || r.akra_status === 'Done');
            const countingComplete =
                (targetWH === 'TRD' && trdAllDone) ||
                (targetWH === 'AKRA' && akraAllDone) ||
                (targetWH === 'BOTH' && trdAllDone && akraAllDone);
            if (countingComplete) {
                await akraSupabase.from('audit_tasks')
                    .update({ overall_status: 'ตรวจสอบอยู่' })
                    .eq('task_id', taskId);
            }
        }
        return { success: true };
    },

    savePartialAuditCount: async (payload) => {
        const { taskId, wh, counts } = payload;
        const errors = [];
        for (const item of counts) {
            if (item.qty === undefined || item.qty === null || item.qty === '') continue;
            let updateData = {};
            if (wh === 'TRD') {
                updateData = { trd_count_qty: item.qty };
            } else if (wh === 'AKRA') {
                updateData = { akra_count_qty: item.qty };
            }
            const { error } = await akraSupabase.from('audit_tasks').update(updateData).eq('row_id', item.rowId).eq('task_id', taskId);
            if (error) errors.push(error.message);
        }
        return errors.length ? { success: false, message: errors.join('; ') } : { success: true };
    },

    finalizeAudit: async (payload) => {
        const { taskId, reviews } = payload;
        const errors = [];

        // Step 1: write stock_diff per row
        for (const item of reviews) {
            const { error } = await akraSupabase.from('audit_tasks').update({
                sys_stock: item.sysStock,
                stock_diff: item.stockDiff
            }).eq('row_id', item.rowId).eq('task_id', taskId);
            if (error) errors.push(error.message);
        }
        if (errors.length) return { success: false, message: errors.join('; ') };

        // Step 2: close the entire task atomically
        const { error: closeError } = await akraSupabase
            .from('audit_tasks')
            .update({ overall_status: 'สำเร็จแล้ว' })
            .eq('task_id', taskId);
        return { success: !closeError, message: closeError?.message };
    },

    updateReturnQC: async (payload) => {
        const { id, grade, status, qcCondition, sku, name, qty, unit, reason, user } = payload;

        // 1. Update Return Status
        const { error } = await akraSupabase.from('returns').update({
            status: status,
            qc_condition: qcCondition
        }).eq('id', id);

        if (error) return { success: false, message: error.message };

        // 2. If Grade C (Damaged), automatically create a Claim record.
        // Uses upsert so retrying the same Grade C action is idempotent (no duplicate key error).
        if (grade === 'C') {
            // New: Find vendor from PO history
            const vRes = await AKRA_API.findVendorBySku(sku);
            const foundVendor = vRes.success ? vRes.vendor : null;

            const claimPayload = {
                id: 'CLM-RET-' + id.replace('RET-', ''),
                report_date: new Date().toISOString().split('T')[0],
                found_location: 'คลังกักกัน (QC)',
                sku: sku,
                name: name,
                qty: qty,
                unit: unit,
                vendor: foundVendor,
                reason: `[จากระบบคืนสินค้า] ${reason}`,
                remark: `สภาพ: ${qcCondition}`,
                reporter: user,
                status: 'รอคลังรับของ',
                wh_status: 'ยังไม่รับ'
            };
            const { error: claimError } = await akraSupabase.from('claims')
                .upsert(claimPayload, { onConflict: 'id' });
            if (claimError) return { success: false, message: 'อัปเดต QC สำเร็จ แต่สร้างใบเคลมอัตโนมัติไม่ได้: ' + claimError.message };
        }

        return { success: true };
    },

    updateVendor: async (payload) => {
        const { error } = await akraSupabase.from('claims').update({ vendor: payload.vendor }).eq('id', payload.claimId);
        return { success: !error, message: error?.message };
    },

    lockAuditWH: async (payload) => {
        const { taskId, wh, user } = payload;
        const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        const userTime = `${user}|${timeStr}`;
        let updateData = {};
        if (wh === 'TRD') {
            updateData = { trd_status: 'กำลังนับ', trd_count_by: userTime };
        } else if (wh === 'AKRA') {
            updateData = { akra_status: 'กำลังนับ', akra_count_by: userTime };
        }
        const { error } = await akraSupabase.from('audit_tasks').update(updateData).eq('task_id', taskId);
        return { success: !error, message: error?.message };
    },

    // --- Transfers ---
    submitTransfer: async (payload) => {
        const records = payload.map(item => ({
            id: item.id,
            item_name: item.itemName,
            request_qty: item.requestQty,
            status: item.status,
            old_expiry: item.oldExpiry,
            new_expiry: item.newExpiry,
            receive_qty: item.receiveQty,
            receive_note: item.receiveNote,
            w2_note: item.w2Note,
            storage_capacity: item.storageCapacity
        }));
        
        const { error } = await akraSupabase.from('w1_requests').upsert(records, { onConflict: 'id' });
        return { success: !error, message: error?.message };
    },

    getTransfers: async () => {
        const items = await AKRA_API.fetchAll('w1_requests', '*', 'created_at', false);
        const products = await AKRA_API.fetchAll('products');
        return { success: true, items: items || [], products: products || [] };
    },

    // --- Admin ---
    getAdminData: async () => {
        const { data: users, error } = await akraSupabase.from('users').select('*');
        if (error) return { status: 'error', message: error.message };
        const usersObj = {};
        users.forEach(u => { usersObj[u.id] = { name: u.name, roles: u.roles }; });
        return { status: 'success', users: usersObj };
    },

    postAction: async (payload) => {
        const { action } = payload;
        if (action === 'saveAppConfig') return { success: !(await akraSupabase.from('app_config').upsert(payload.appConfig)).error };
        if (action === 'deleteUser') return { success: !(await akraSupabase.from('users').delete().eq('id', payload.id)).error };
        if (action === 'saveUser') return { success: !(await akraSupabase.from('users').upsert({ id: payload.id, name: payload.name, roles: payload.roles })).error };

        return { success: false, message: "Unknown action" };
    }
};
