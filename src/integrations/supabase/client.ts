// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ncpxczxhlzilbeataykp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcHhjenhobHppbGJlYXRheWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjQyMDIsImV4cCI6MjA2NDIwMDIwMn0.UnWVF-BoBAiPCGL42E9fAGXO6MXamKPB60D1sy-Kswk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);