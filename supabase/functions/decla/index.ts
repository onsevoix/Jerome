import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MIN_MESSAGE_LENGTH = 500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const { prenom, celibataire, message, email } = await req.json();

    if (!prenom || !celibataire || !message || !email) {
      return json({ error: "Tous les champs sont obligatoires." }, 400);
    }

    if (message.length < MIN_MESSAGE_LENGTH) {
      return json(
        { error: `Le message doit contenir au moins ${MIN_MESSAGE_LENGTH} caractères.` },
        400
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return json({ error: "Adresse email invalide." }, 400);
    }

    const { data, error } = await supabase
      .from("declas")
      .insert({ prenom, celibataire, message, email })
      .select("id")
      .single();

    if (error) throw error;

    return json({ ok: true, id: data.id }, 201);
  } catch (err) {
    console.error("[decla]", err);
    return json({ error: "Impossible d'enregistrer la décla pour le moment." }, 502);
  }
});
