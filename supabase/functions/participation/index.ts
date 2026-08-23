import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Mo

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const form = await req.formData();
    const prenom = form.get("prenom")?.toString() ?? "";
    const ville = form.get("ville")?.toString() ?? "";
    const age = form.get("age")?.toString() ?? "";
    const email = form.get("email")?.toString() ?? "";
    const instagram = form.get("instagram")?.toString() ?? "";
    const vocal = form.get("vocal");

    if (!prenom || !ville || !age || !email || !instagram) {
      return json({ error: "Tous les champs sont obligatoires." }, 400);
    }

    if (!(vocal instanceof File)) {
      return json({ error: "Merci de déposer un fichier audio." }, 400);
    }

    if (vocal.size > MAX_FILE_SIZE) {
      return json({ error: "Le fichier audio dépasse la taille maximale autorisée (50 Mo)." }, 400);
    }

    if (!EMAIL_REGEX.test(email)) {
      return json({ error: "Adresse email invalide." }, 400);
    }

    const { data: record, error: insertError } = await supabase
      .from("participations")
      .insert({ prenom, ville, age: Number(age), email, instagram })
      .select("id")
      .single();

    if (insertError) throw insertError;

    const ext = vocal.name.includes(".") ? vocal.name.split(".").pop() : "webm";
    const path = `${record.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("vocaux")
      .upload(path, vocal, { contentType: vocal.type || "audio/webm" });

    if (uploadError) throw uploadError;

    const { error: updateError } = await supabase
      .from("participations")
      .update({ vocal_path: path })
      .eq("id", record.id);

    if (updateError) throw updateError;

    return json({ ok: true, id: record.id }, 201);
  } catch (err) {
    console.error("[participation]", err);
    return json({ error: "Impossible d'enregistrer la candidature pour le moment." }, 502);
  }
});
