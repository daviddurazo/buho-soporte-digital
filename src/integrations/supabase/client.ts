// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://idglmphcwtcrqepghggz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZ2xtcGhjd3RjcnFlcGdoZ2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODE3NjYsImV4cCI6MjA2MTM1Nzc2Nn0.BaJT-GPn5Ia5gUvAYCV7FwMLHEbp8Oj4G6WVvvVhiIY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);