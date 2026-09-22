import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

const REVIEWER_KEY = "osv-admin-reviewer";
const REVIEWERS = ["Jérôme", "Mahé"];
const AVIS_FIELD = { Jérôme: "avis_jerome", Mahé: "avis_mahe" };
const AVIS_SCALE = [
  { value: 4, label: "Très bien" },
  { value: 3, label: "Bien" },
  { value: 2, label: "Moyen" },
  { value: 1, label: "Pas bien" },
];
const AVIS_LABELS = Object.fromEntries(AVIS_SCALE.map((s) => [s.value, s.label]));

const STATUT_OPTIONS = [
  { value: "", label: "À traiter" },
  { value: "Confirmé", label: "Confirmés" },
  { value: "Diffusé", label: "Diffusés" },
  { value: "Archivé", label: "Archivés" },
];
const STATUT_CLASS = {
  Confirmé: "classement-confirme",
  Diffusé: "classement-diffuse",
  Archivé: "classement-archive",
};

const CLASSEMENT_FILTERS = [
  { value: "a-traiter", label: "À traiter" },
  { value: "confirmes", label: "Confirmés" },
  { value: "diffuses", label: "Diffusés" },
  { value: "archives", label: "Archivés" },
];

function matchesClassementFilter(p, filter) {
  if (filter === "confirmes") return p.classement === "Confirmé";
  if (filter === "diffuses") return p.classement === "Diffusé";
  if (filter === "archives") return p.classement === "Archivé";
  return !p.classement;
}

function avisAverage(p) {
  const vals = [p.avis_jerome, p.avis_mahe].filter((v) => v != null);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function formatAvis(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1).replace(".", ",");
}

function slugify(s) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function vocalFilename(p) {
  const ext = p.vocal_path?.split(".").pop() || "mp3";
  return `${slugify(p.prenom)}-${slugify(p.ville)}-${p.age}.${ext}`;
}

function sortItems(items, sortBy) {
  const arr = [...items];
  if (sortBy === "date-asc") {
    arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else {
    arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  return arr;
}

export default function Admin() {
  const location = useLocation();
  const tab = location.pathname.endsWith("/declas") ? "declas" : "participations";

  const [session, setSession] = useState(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [declas, setDeclas] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedDeclas, setExpandedDeclas] = useState({});
  const [expandedParticipations, setExpandedParticipations] = useState({});
  const [classementFilter, setClassementFilter] = useState("a-traiter");
  const [reviewer, setReviewer] = useState(() => localStorage.getItem(REVIEWER_KEY));
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    setSortBy("date-desc");
  }, [tab]);

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

  function chooseReviewer(name) {
    localStorage.setItem(REVIEWER_KEY, name);
    setReviewer(name);
  }

  function toggleParticipation(id) {
    setExpandedParticipations((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function updateClassement(id, classement) {
    setParticipations((prev) => prev.map((p) => (p.id === id ? { ...p, classement } : p)));
    const { error } = await supabase
      .from("participations")
      .update({ classement: classement || null })
      .eq("id", id);
    if (error) setLoadError(error.message);
  }

  async function updateAvis(id, currentValue, targetValue) {
    if (!reviewer) return;
    const field = AVIS_FIELD[reviewer];
    const value = currentValue === targetValue ? null : targetValue;
    setParticipations((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    const { error } = await supabase.from("participations").update({ [field]: value }).eq("id", id);
    if (error) setLoadError(error.message);
  }

  async function updateCommentaire(id, commentaire) {
    setParticipations((prev) => prev.map((p) => (p.id === id ? { ...p, commentaire } : p)));
    const { error } = await supabase.from("participations").update({ commentaire }).eq("id", id);
    if (error) setLoadError(error.message);
  }

  async function downloadVocal(p) {
    if (!p.vocal_url || downloadingId) return;
    setDownloadingId(p.id);
    setLoadError(null);
    try {
      const res = await fetch(p.vocal_url);
      if (!res.ok) throw new Error("Téléchargement impossible");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = vocalFilename(p);
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setLoadError("Impossible de télécharger ce vocal pour le moment.");
    } finally {
      setDownloadingId(null);
    }
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

  const sortedParticipations = sortItems(participations, sortBy);
  const filteredParticipations = sortedParticipations.filter((p) =>
    matchesClassementFilter(p, classementFilter)
  );
  const sortedDeclas = sortItems(declas, sortBy);

  return (
    <section>
      <div className="admin-header">
        <h2 className="page__title admin-header__title">Administration</h2>
        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
          aria-label="Se déconnecter"
          title="Se déconnecter"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M12 3v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path
              d="M6.5 6.5a8 8 0 1 0 11 0"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {loadError && <p className="form-status form-status--error">{loadError}</p>}

      {tab === "participations" && (
        <div className="admin-reviewer">
          <span className="admin-reviewer__label">Vous êtes</span>
          {REVIEWERS.map((r) => (
            <button
              key={r}
              type="button"
              className={`admin-reviewer__btn ${reviewer === r ? "active" : ""}`}
              onClick={() => chooseReviewer(r)}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      <h3 className="legal-heading">
        {tab === "participations"
          ? `Participations (${filteredParticipations.length})`
          : `Crushs vocaux (${declas.length})`}
      </h3>

      {tab === "participations" && (
        <div className="admin-filter-tabs">
          {CLASSEMENT_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`admin-filter-tabs__btn ${classementFilter === f.value ? "active" : ""}`}
              onClick={() => setClassementFilter(f.value)}
            >
              {f.label}
              <span className="admin-filter-tabs__count">
                {participations.filter((p) => matchesClassementFilter(p, f.value)).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="field admin-sort">
        <label htmlFor="admin-sort">Trier par</label>
        <select id="admin-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date-desc">Date (récent → ancien)</option>
          <option value="date-asc">Date (ancien → récent)</option>
        </select>
      </div>

      {tab === "participations" &&
        filteredParticipations.map((p) => {
          const isExpanded = Boolean(expandedParticipations[p.id]);
          const avg = avisAverage(p);
          return (
            <div key={p.id} className="form-card admin-card">
              <button
                type="button"
                className="admin-card__summary"
                aria-expanded={isExpanded}
                onClick={() => toggleParticipation(p.id)}
              >
                <span>
                  <strong>{p.prenom}</strong> · {p.ville} · {p.age} ans
                </span>
                <svg className="admin-card__chevron" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="field admin-card__statut">
                <select
                  aria-label="Statut"
                  className={STATUT_CLASS[p.classement] ?? ""}
                  value={p.classement ?? ""}
                  onChange={(e) => updateClassement(p.id, e.target.value)}
                >
                  {STATUT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {isExpanded && (
                <div className="admin-card__details">
                  <p className="field__hint">
                    {p.email} · {p.instagram}
                  </p>
                  <p className="field__hint">{new Date(p.created_at).toLocaleString("fr-FR")}</p>
                  {p.vocal_url ? (
                    <div className="admin-vocal">
                      <audio controls src={p.vocal_url} />
                      <button
                        type="button"
                        className="admin-vocal__download"
                        onClick={() => downloadVocal(p)}
                        disabled={downloadingId === p.id}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                          <path
                            d="M12 4v12M12 16l-5-5M12 16l5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 19h14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        {downloadingId === p.id
                          ? "Téléchargement…"
                          : `Télécharger (${vocalFilename(p)})`}
                      </button>
                    </div>
                  ) : (
                    <p className="field__hint field__hint--error">Pas de vocal disponible</p>
                  )}

                  <div className="admin-avis">
                    <p className="admin-avis__label">Avis</p>
                    <div className="admin-avis__buttons">
                      {AVIS_SCALE.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          disabled={!reviewer}
                          className={`admin-avis__btn ${
                            reviewer && p[AVIS_FIELD[reviewer]] === s.value ? "active" : ""
                          }`}
                          onClick={() => updateAvis(p.id, p[AVIS_FIELD[reviewer]], s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    {!reviewer && (
                      <p className="field__hint">
                        Choisissez qui vous êtes en haut de page pour donner votre avis.
                      </p>
                    )}
                    <p className="field__hint admin-avis__summary">
                      Jérôme : {p.avis_jerome ? AVIS_LABELS[p.avis_jerome] : "—"} · Mahé :{" "}
                      {p.avis_mahe ? AVIS_LABELS[p.avis_mahe] : "—"}
                      {avg != null && <> · Moyenne : {formatAvis(avg)}/4</>}
                    </p>
                  </div>

                  <div className="field admin-card__comment">
                    <label htmlFor={`comment-${p.id}`}>Commentaire</label>
                    <textarea
                      id={`comment-${p.id}`}
                      defaultValue={p.commentaire ?? ""}
                      onBlur={(e) => {
                        if (e.target.value !== (p.commentaire ?? "")) {
                          updateCommentaire(p.id, e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

      {tab === "declas" &&
        sortedDeclas.map((d) => (
          <div key={d.id} className="form-card admin-card">
            <p>
              <strong>{d.prenom}</strong> → {d.celibataire}
            </p>
            <p className="field__hint">
              {d.email} · {new Date(d.created_at).toLocaleString("fr-FR")}
            </p>
            <button
              type="button"
              className="legal-toggle"
              aria-expanded={Boolean(expandedDeclas[d.id])}
              onClick={() =>
                setExpandedDeclas((prev) => ({ ...prev, [d.id]: !prev[d.id] }))
              }
            >
              {expandedDeclas[d.id] ? "Masquer le message" : "Voir le message"}
              <svg className="legal-toggle__chevron" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {expandedDeclas[d.id] && <p>{d.message}</p>}
          </div>
        ))}
    </section>
  );
}
