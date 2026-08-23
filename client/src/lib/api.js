import { supabase } from "./supabaseClient.js";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Une erreur est survenue.");
  }
  return data;
}

export async function sendDecla({ prenom, celibataire, message, email }) {
  const res = await fetch(`${FUNCTIONS_URL}/decla`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    },
    body: JSON.stringify({ prenom, celibataire, message, email }),
  });
  return parseResponse(res);
}

export async function sendParticipation({ prenom, ville, age, email, instagram, vocal }) {
  const formData = new FormData();
  formData.append("prenom", prenom);
  formData.append("ville", ville);
  formData.append("age", age);
  formData.append("email", email);
  formData.append("instagram", instagram);
  formData.append("vocal", vocal, vocal.name || "vocal.webm");

  const res = await fetch(`${FUNCTIONS_URL}/participation`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    },
    body: formData,
  });
  return parseResponse(res);
}

export async function fetchCelibataires() {
  const { data, error } = await supabase
    .from("celibataires")
    .select("nom")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return { celibataires: data.map((row) => row.nom), live: true };
}
