import type { ReactiveEffect } from "../reactivity/effect.ts";
import { ComponentOptions } from "./componentOptions.ts";
import type { VNode, VNodeChild } from "./vnode.ts";

export type Component = ComponentOptions;

export interface ComponentInternalInstance {
  type: Component;
  vnode: VNode;
  subTree: VNode;
  next: VNode | null;
  effect: ReactiveEffect;
  render: InternalRenderFunction;
  update: () => void;
  isMounted: boolean;
}

export type InternalRenderFunction = {
  (): VNodeChild;
};

export function createComponentInstance(
  vnode: VNode,
): ComponentInternalInstance {
  const type = vnode.type as Component;

  const instance: ComponentInternalInstance = {
    type,
    vnode,
    next: null,
    subTree: null!,
    effect: null!,
    render: null!,
    update: null!,
    isMounted: false,
  }

  return instance;
}
