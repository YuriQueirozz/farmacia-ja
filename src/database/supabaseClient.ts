import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variáveis de ambiente supabase não definidas.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
