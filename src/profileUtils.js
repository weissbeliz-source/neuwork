export function parseStoredField(field) {
  try {
    return field ? JSON.parse(field) : { tags: [], custom: "" };
  } catch {
    return { tags: [], custom: "" };
  }
}

export function serializeField(field) {
  return JSON.stringify(field || { tags: [], custom: "" });
}

export function renderTagFieldPreview(field) {
  if (!field) return null;
  return (
    <>
      {(field.tags || []).map((t) => (
        <span key={t}>{t}</span>
      ))}
      {field.custom && <span>{field.custom}</span>}
    </>
  );
}