async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Une erreur est survenue.");
  }
  return data;
}

export async function sendDecla({ prenom, celibataire, message, email }) {
  const res = await fetch("/api/decla", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

  const res = await fetch("/api/participation", {
    method: "POST",
    body: formData,
  });
  return parseResponse(res);
}

export async function fetchCelibataires() {
  const res = await fetch("/api/celibataires");
  return parseResponse(res);
}
