import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Limite le nombre d'envois par IP, sur une fenetre courte (anti-script) et
// une fenetre longue (empeche de simplement attendre la fenetre courte pour
// recommencer). Retourne null si l'envoi est autorise, sinon un message
// d'erreur a renvoyer tel quel.
export async function checkRateLimit(
  req: Request,
  action: string,
  { perHour, perDay }: { perHour: number; perDay: number }
): Promise<string | null> {
  const ip = getClientIp(req);
  const now = Date.now();
  const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  const { count: hourCount, error: hourError } = await supabase
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("action", action)
    .gte("created_at", hourAgo);

  if (hourError) throw hourError;
  if ((hourCount ?? 0) >= perHour) {
    return "Trop de tentatives depuis cette connexion. Réessayez dans un peu moins d'une heure.";
  }

  const { count: dayCount, error: dayError } = await supabase
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("action", action)
    .gte("created_at", dayAgo);

  if (dayError) throw dayError;
  if ((dayCount ?? 0) >= perDay) {
    return "Trop de tentatives depuis cette connexion aujourd'hui. Réessayez demain.";
  }

  const { error: insertError } = await supabase
    .from("rate_limit_events")
    .insert({ ip, action });
  if (insertError) throw insertError;

  return null;
}
