/**
 * AKRA Web Apps - Connectivity & RLS Diagnostic
 * This script verifies connection and basic permissions for all critical tables.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TABLES_TO_TEST = [
    'users',
    'app_config',
    'products',
    'vendors',
    'purchase_requests',
    'purchase_orders',
    'goods_receipts',
    'w5_inventory',
    'w5_history',
    'returns',
    'claims',
    'audit_tasks',
    'daily_records',
    'w1_requests'
];

async function runAudit() {
    console.log('🚀 Starting System-wide Connectivity Audit...\n');
    console.log(`URL: ${SUPABASE_URL}`);
    console.log('--------------------------------------------------');

    for (const table of TABLES_TO_TEST) {
        process.stdout.write(`Checking table: ${table.padEnd(20)} `);
        
        const start = Date.now();
        try {
            const { data, error, count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            const duration = Date.now() - start;

            if (error) {
                console.log(`❌ FAILED (${duration}ms)`);
                console.error(`   Error: ${error.message} (${error.code})`);
            } else {
                console.log(`✅ OK     (${duration}ms) - Count: ${count}`);
            }
        } catch (err) {
            console.log(`❌ CRASHED`);
            console.error(`   Exception: ${err.message}`);
        }
    }

    console.log('\n--------------------------------------------------');
    console.log('✅ Audit Complete.');
}

runAudit();
