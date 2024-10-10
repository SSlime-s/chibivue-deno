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

export function capitalize<T extends string>(str: T): Capitalize<T> {
  return str.charAt(0).toUpperCase() + str.slice(1) as Capitalize<T>;
}

export function toHandlerKey<T extends string>(
  str: T,
): T extends "" ? "" : `on${Capitalize<T>}` {
  return (str === ""
    ? "" as const
    : `on${capitalize(str)}` as const) as T extends "" ? ""
      : `on${Capitalize<T>}`;
}
