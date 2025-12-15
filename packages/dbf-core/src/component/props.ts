export type PropType = "string" | "number" | "boolean" | "json";
export type PropSchema = Record<string, PropType>;

export function parseProp(type: PropType, raw: string | null) {
  if (type === "boolean") return raw !== null && raw !== "false";
  if (raw === null) return type === "number" ? 0 : type === "json" ? null : "";
  if (type === "number") return Number(raw);
  if (type === "json") return JSON.parse(raw);
  return raw;
}
