export function hasOwn(
  val: object,
  key: string | symbol,
): key is keyof typeof val {
  return Object.prototype.hasOwnProperty.call(val, key);
}

type KebabToCamel<S extends string> = S extends `${infer S}-${infer T}`
  ? `${S}${Capitalize<KebabToCamel<T>>}`
  : S;

const camelizeRE = /-(\w)/g;
export function camelize<T extends string>(str: T): KebabToCamel<T> {
  return str.replace(
    camelizeRE,
    (_, c: string | undefined) => (c !== undefined ? c.toUpperCase() : ""),
  ) as KebabToCamel<T>;
}
