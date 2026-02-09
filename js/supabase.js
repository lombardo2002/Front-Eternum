import { createClient } from "htpps://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://banxdyodqeilqoczbypy.supabase.co";
const SUPABASE_KEY = "sb_publishable_M52HDFcRVpsXjScBZJ5xNA_xEAkmbsP";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
