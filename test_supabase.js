const { createClient } = require('@supabase/supabase-js');
const url = "https://mmvjfezkukzwkpjwifye.supabase.co";
const key = "sb_publishable_M5IcUt1S2UxDk5QMqJjaPQ_DYfhU99h";
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log("SELECT:", { data, error });
  
  const { data: iData, error: iError } = await supabase.from('users').insert({
      full_name: "Test User",
      phone: "9999999999",
      password_hash: "hash",
  }).select('*');
  console.log("INSERT:", { data: iData, error: iError });
}
test();
