import { RendererOptions } from "../runtime-core/renderer.ts";
import { patchEvent } from "./modules/events.ts";

type DOMRendererOptions = RendererOptions<Node, Element>;

const onRE = /^on[^a-z]/;
export const isOn = (key: string): key is `on${string}` => onRE.test(key);

export const patchProp: DOMRendererOptions["patchProp"] = (
  element,
  key,
  value
) => {
  if (isOn(key)) {
    // deno-lint-ignore ban-types
    patchEvent(element, key, value as Function);
  } else {
    // TODO
  }
};
