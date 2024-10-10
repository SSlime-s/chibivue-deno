import type { ComponentInternalInstance } from "./component.ts";
import { RendererNode } from "./renderer.ts";

export const Text = Symbol("Text");

export type VNodeTypes = string | typeof Text | object;

export interface VNode<HostNode = RendererNode> {
  type: VNodeTypes;
  props: VNodeProps | null;
  children: VNodeNormalizedChildren;
  element: HostNode | null;
  component: ComponentInternalInstance | null;
}

export interface VNodeProps {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

export type VNodeNormalizedChildren = string | VNodeArrayChildren;
export type VNodeArrayChildren = readonly (
  | VNodeArrayChildren
  | VNodeChildAtom
)[];

export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;
export type VNodeChildAtom = VNode | string;

export function createVNode(
  type: VNodeTypes,
  props: VNodeProps | null,
  children: VNodeNormalizedChildren
): VNode {
  const vnode: VNode = {
    type,
    props,
    children,
    element: null,
    component: null,
  };

  return vnode;
}

export function normalizeVNode(child: VNodeChild): VNode {
  if (typeof child === "object") {
    return { ...child } as VNode;
  } else {
    return createVNode(Text, null, String(child));
  }
}
