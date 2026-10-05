import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uhxbbwwwhoidxsrnxbng.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeGJid3d3aG9pZHhzcm54Ym5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMTgzNzksImV4cCI6MjEwNjY5NDM3OX0.gvDlroAL3UvguRQUmWMKL69E-fuNtGnUigvCuIDT-II"; // Paste your full anon key inside these quotes

export const supabase = createClient(supabaseUrl, supabaseKey);
