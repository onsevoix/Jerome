import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6";
import { checkRateLimit } from "../_shared/rateLimit.ts";

const MIN_MESSAGE_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const GMAIL_USER = Deno.env.get("GMAIL_USER");
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

const transporter =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      })
    : null;

async function notifyCelibataire({ celibataire, prenom, message, replyTo }: {
  celibataire: string;
  prenom: string;
  message: string;
  replyTo: string;
}) {
  if (!transporter) {
    console.warn("[decla] GMAIL_USER/GMAIL_APP_PASSWORD non configures, email non envoye");
    return;
  }

  const { data: row } = await supabase
    .from("celibataires")
    .select("email")
    .eq("nom", celibataire)
    .maybeSingle();

  if (!row?.email) return;

  await transporter.sendMail({
    from: GMAIL_USER,
    to: row.email,
    replyTo,
    subject: "Une décla pour toi sur On se voix ? 💌",
    text: `${prenom} t'a envoyé une décla via On se voix ? :\n\n${message}\n\nTu peux lui répondre directement en répondant à cet email.`,
  });
}

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
    const rateLimitError = await checkRateLimit(req, "decla", { perHour: 5, perDay: 15 });
    if (rateLimitError) return json({ error: rateLimitError }, 429);

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

    if (message.length > MAX_MESSAGE_LENGTH) {
      return json(
        { error: `Le message ne doit pas dépasser ${MAX_MESSAGE_LENGTH} caractères.` },
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

    try {
      await notifyCelibataire({ celibataire, prenom, message, replyTo: email });
    } catch (mailErr) {
      // La decla est deja enregistree : un echec d'envoi d'email ne doit pas
      // faire echouer la reponse a l'utilisateur.
      console.error("[decla] echec envoi email de notification", mailErr);
    }

    return json({ ok: true, id: data.id }, 201);
  } catch (err) {
    console.error("[decla]", err);
    return json({ error: "Impossible d'enregistrer la décla pour le moment." }, 502);
  }
});
