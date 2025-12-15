export type PropType = "string" | "number" | "boolean" | "json";
export type PropSchema = Record<string, PropType>;

export function parseProp(type: PropType, raw: string | null) {
  if (type === "boolean") return raw !== null && raw !== "false";
  if (raw === null) return type === "number" ? 0 : type === "json" ? null : "";
  if (type === "number") return Number(raw);
  if (type === "json") return JSON.parse(raw);
  return raw;
}

type PropValueFromType<T extends PropType> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : // "json"
    any;

/**
 * Verilen prop şemasından TypeScript tipi üretir.
 *
 * const schema = { label: "string", count: "number" } as const;
 * type Props = PropsFromSchema<typeof schema>;
 */
export type PropsFromSchema<S extends PropSchema> = {
  [K in keyof S]: PropValueFromType<S[K]>;
};

/**
 * Props şemasını tek yerde tanımlayıp hem runtime hem de type-safe kullanmak için helper.
 *
 * const props = defineProps({
 *   label: "string",
 *   count: "number",
 * } as const);
 *
 * type Props = PropsFromSchema<typeof props>;
 */
export function defineProps<S extends PropSchema>(schema: S): S {
  return schema;
}