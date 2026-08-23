const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

export const isConfigured = Boolean(API_KEY && BASE_ID);

if (!isConfigured) {
  console.warn(
    "[airtable] Aucune clé API configurée (server/.env manquant ou incomplet) — " +
      "mode simulation activé : les formulaires seront loggés dans la console mais pas envoyés à Airtable."
  );
}

async function airtableFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable API error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function createRecord(tableName, fields) {
  if (!isConfigured) {
    const fakeId = `simulated-${Date.now()}`;
    console.log(`[airtable:simulation] Création dans "${tableName}" (id=${fakeId})`, fields);
    return { id: fakeId, fields };
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}`;
  return airtableFetch(url, {
    method: "POST",
    body: JSON.stringify({ fields }),
  });
}

export async function getCelibataireOptions() {
  if (!isConfigured) return null;

  const tableName = process.env.AIRTABLE_DECLA_TABLE || "Declas";
  const fieldName = process.env.AIRTABLE_CELIBATAIRE_FIELD || "Célibataire";

  const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`;
  const data = await airtableFetch(url);
  const table = data.tables?.find((t) => t.name === tableName);
  const field = table?.fields?.find((f) => f.name === fieldName);
  const choices = field?.options?.choices;

  if (!choices) return null;
  return choices.map((c) => c.name);
}

export async function uploadAttachmentToRecord({
  tableName,
  recordId,
  fieldName,
  buffer,
  filename,
  contentType,
}) {
  if (!isConfigured) {
    console.log(
      `[airtable:simulation] Upload pièce jointe "${filename}" (${buffer.length} octets) ` +
        `sur le champ "${fieldName}" du record ${recordId} (table "${tableName}")`
    );
    return { filename, contentType, simulated: true };
  }

  const url = `https://content.airtable.com/v0/${BASE_ID}/${recordId}/${encodeURIComponent(fieldName)}/uploadAttachment`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contentType,
      filename,
      file: buffer.toString("base64"),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable upload error ${res.status}: ${body}`);
  }

  return res.json();
}
