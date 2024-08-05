import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzctdcebaapcbnqmyhke.supabase.co';

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Y3RkY2ViYWFwY2JucW15aGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2OTc1NTksImV4cCI6MjAzODI3MzU1OX0.VDhmY-rxwmREvVfGlmn5z5BIUn6yR3SWiHtFrVKVJwc";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
