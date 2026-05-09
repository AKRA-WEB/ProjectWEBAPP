const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";

async function fixData() {
    // Fetch all POs that are Pending Review but have no goods_receipts
    const res = await fetch(`${SUPABASE_URL}/rest/v1/purchase_orders?select=po_uid,status,goods_receipts(gr_qty)&status=eq.Pending%20Review`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    const data = await res.json();
    
    for (const po of data) {
        if (po.goods_receipts.length === 0) {
            console.log(`Fixing PO ${po.po_uid}... resetting to Pending GR`);
            await fetch(`${SUPABASE_URL}/rest/v1/purchase_orders?po_uid=eq.${po.po_uid}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Pending GR' })
            });
        }
    }
    console.log("Done fixing data.");
}
fixData();