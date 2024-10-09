import { createVNode, VNode, VNodeProps } from "./vnode.ts";

export function h(
  type: string,
  props: VNodeProps,
  children: readonly (VNode | string)[]
): VNode {
  return createVNode(type, props, [...children]);
}
