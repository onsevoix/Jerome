import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const STATUTS = ["Pré-accepté", "Accepté", "Pré-refusé", "Refusé"];

export default function Admin() {
  const [session, setSession] = useState(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState("participations");
  const [declas, setDeclas] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    supabase
      .from("declas")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setLoadError(error.message);
        else setDeclas(data);
      });

    supabase
      .from("participations")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setLoadError(error.message);
        else setParticipations(data);
      });
  }, [session]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : error.message
      );
    }
    setLoggingIn(false);
  }

  function handleLogout() {
    supabase.auth.signOut();
    setDeclas([]);
    setParticipations([]);
  }

  async function updateStatut(id, statut) {
    setParticipations((prev) => prev.map((p) => (p.id === id ? { ...p, statut } : p)));
    const { error } = await supabase.from("participations").update({ statut }).eq("id", id);
    if (error) setLoadError(error.message);
  }

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return (
      <section>
        <h2 className="page__title">Administration</h2>
        <form className="form-card" onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="admin-email" className="required">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password" className="required">
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loggingIn}>
            {loggingIn ? "Connexion…" : "Se connecter"}
          </button>
          {loginError && <p className="form-status form-status--error">{loginError}</p>}
        </form>
      </section>
    );
  }

  return (
    <section>
      <h2 className="page__title">Administration</h2>
      <button type="button" className="btn btn--secondary btn--sm" onClick={handleLogout}>
        Se déconnecter
      </button>

      {loadError && <p className="form-status form-status--error">{loadError}</p>}

      <div className="vocal-tabs admin-tabs">
        <button
          type="button"
          className={`vocal-tabs__btn ${tab === "participations" ? "active" : ""}`}
          onClick={() => setTab("participations")}
        >
          Participations ({participations.length})
        </button>
        <button
          type="button"
          className={`vocal-tabs__btn ${tab === "declas" ? "active" : ""}`}
          onClick={() => setTab("declas")}
        >
          Déclas ({declas.length})
        </button>
      </div>

      {tab === "participations" &&
        participations.map((p) => (
          <div key={p.id} className="form-card admin-card">
            <p>
              <strong>{p.prenom}</strong> · {p.ville} · {p.age} ans
            </p>
            <p className="field__hint">
              {p.email} · {p.instagram}
            </p>
            <p className="field__hint">{new Date(p.created_at).toLocaleString("fr-FR")}</p>
            {p.vocal_url ? (
              <audio controls src={p.vocal_url} style={{ width: "100%", marginTop: "8px" }} />
            ) : (
              <p className="field__hint field__hint--error">Pas de vocal disponible</p>
            )}
            <div className="field admin-card__statut">
              <label htmlFor={`statut-${p.id}`}>Statut</label>
              <select
                id={`statut-${p.id}`}
                value={p.statut ?? ""}
                onChange={(e) => updateStatut(p.id, e.target.value || null)}
              >
                <option value="">À traiter</option>
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      {tab === "declas" &&
        declas.map((d) => (
          <div key={d.id} className="form-card admin-card">
            <p>
              <strong>{d.prenom}</strong> → {d.celibataire}
            </p>
            <p className="field__hint">
              {d.email} · {new Date(d.created_at).toLocaleString("fr-FR")}
            </p>
            <p>{d.message}</p>
          </div>
        ))}
    </section>
  );
}
