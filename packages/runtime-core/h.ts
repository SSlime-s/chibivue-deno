import { createVNode, type VNode, type VNodeProps } from "./vnode.ts";

export function h(
  type: string | object,
  props: VNodeProps,
  children: readonly (VNode | string)[],
): VNode {
  return createVNode(type, props, [...children]);
}
