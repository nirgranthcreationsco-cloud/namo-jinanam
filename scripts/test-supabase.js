const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mmvjfezkukzwkpjwifye.supabase.co";
const supabaseAnonKey = "sb_publishable_M5IcUt1S2UxDk5QMqJjaPQ_DYfhU99h";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Testing Supabase Sign Up...");
  const email = `test-${Date.now()}@gmail.com`;
  const password = "Password123!";
  
  console.log("Signing up...");
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (signUpError) {
    console.error("Sign Up Error:", signUpError);
    return;
  }
  console.log("Sign Up Success:", signUpData.user.id);

  console.log("Attempting immediate sign in...");
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    console.error("Sign In Error:", signInError);
  } else {
    console.log("Sign In Success!", signInData);
  }
}

run();
