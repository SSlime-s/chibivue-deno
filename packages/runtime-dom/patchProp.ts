import { RendererOptions } from "../runtime-core/renderer.ts";
import { patchAttr } from "./modules/attrs.ts";
import { patchEvent } from "./modules/events.ts";

type DOMRendererOptions = RendererOptions<Node, Element>;

const onRE = /^on[^a-z]/;
export const isOn = (key: string): key is `on${Capitalize<string>}` =>
  onRE.test(key);

export const patchProp: DOMRendererOptions["patchProp"] = (
  element,
  key,
  value,
) => {
  if (isOn(key)) {
    // deno-lint-ignore ban-types
    patchEvent(element, key, value as Function | null);
  } else {
    patchAttr(element, key, value as string | null);
  }
};
