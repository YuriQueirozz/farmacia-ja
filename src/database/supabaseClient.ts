import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
// const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (process.env.NODE_ENV !== "test" && (!supabaseUrl || !supabaseServiceKey)) {
  throw new Error("Variáveis de ambiente supabase não definidas.");
}

export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseServiceKey ?? ""
);

