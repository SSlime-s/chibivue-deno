import { RendererOptions } from "../runtime-core/renderer.ts";

export const nodeOps: RendererOptions<Node> = {
  setElementText(node, text) {
    node.textContent = text;
  },
};
