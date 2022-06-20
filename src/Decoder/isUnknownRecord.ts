export const isUnknownRecord = (u: unknown): u is Readonly<Record<PropertyKey, unknown>> =>
  !!u && !Array.isArray(u) && typeof u === 'object'
