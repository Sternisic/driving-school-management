import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("fileName");

  if (!fileName) {
    return new Response(JSON.stringify({ exists: false }), { status: 400 });
  }

  const { data } = supabase.storage.from("generated-files").getPublicUrl(fileName);

  if (data?.publicUrl) {
    return new Response(
      JSON.stringify({ exists: true, url: data.publicUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ exists: false }), { status: 404 });
}
