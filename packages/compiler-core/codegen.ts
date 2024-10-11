import type { ParsedContent } from "./parse.ts";

export function generate({ tag, props, textContent }: ParsedContent): string {
  return `
return () => {
  const { h } = ChibiVue;
  return h(
    "${tag}", { ${
    Object.entries(props).map(([key, value]) => `${key}: "${value}"`).join(
      ",",
    )
  } }, ["${textContent}"]);
}`;
}
