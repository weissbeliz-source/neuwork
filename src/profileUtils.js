import { createTagField } from "./constants";

export function parseStoredField(value) {
  if (!value) return createTagField();
  try {
    const parsed = JSON.parse(value);
    if (parsed && Array.isArray(parsed.tags)) return { tags: parsed.tags, custom: parsed.custom || "" };
  } catch (error) {
    return { tags: [], custom: typeof value === "string" ? value : "" };
  }
  return createTagField();
}

export function serializeField(value) {
  return JSON.stringify({ tags: value?.tags || [], custom: value?.custom || "" });
}

export function renderTagFieldPreview(field) {
  const tags = field?.tags || [];
  const custom = field?.custom?.trim() || "";
  const parts = [...tags, custom].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Noch nichts eingetragen.";
}
