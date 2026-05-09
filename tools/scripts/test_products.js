const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";
const { createClient } = require('@supabase/supabase-js');
const akraSupabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
    const { data, error } = await akraSupabase.from('products').select('*').limit(10000);
    console.log("Fetched products count:", data ? data.length : 0);
    if(error) console.log("Error:", error);
}
test();