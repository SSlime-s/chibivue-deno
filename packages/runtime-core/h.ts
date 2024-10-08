import { VNode, VNodeProps } from "./vnode.ts";

export function h(
  type: string,
  props: VNodeProps,
  children: readonly (VNode | string)[]
): VNode {
  return { type, props, children: [...children] };
}
