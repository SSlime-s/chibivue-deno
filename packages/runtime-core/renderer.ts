import { ReactiveEffect } from "../reactivity/effect.ts";
import { Component } from "./component.ts";
import { normalizeVNode, VNode } from "./vnode.ts";
import { Text } from "./vnode.ts";

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement
> {
  patchProp(element: HostElement, key: string, value: unknown): void;
  createElement(type: string): HostNode;
  createText(text: string): HostNode;
  setElementText(node: HostNode, text: string): void;
  insert(child: HostNode, parent: HostNode, anchor?: HostNode | null): void;
}

export interface RendererNode {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

export interface RendererElement extends RendererNode {}

export type RootRenderFunction<HostElement = RendererElement> = (
  rootComponent: Component,
  container: HostElement
) => void;

export function createRenderer({
  patchProp: hostPatchProp,
  createElement: hostCreateElement,
  createText: hostCreateText,
  setElementText: hostSetText,
  insert: hostInsert,
}: RendererOptions) {
  const patch = (n1: VNode | null, n2: VNode, container: RendererElement) => {
    if (n2.type === Text) {
      processText(n1, n2, container);
    } else {
      processElement(n1, n2, container);
    }
  };

  const processElement = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement
  ) => {
    if (n1 === null) {
      mountElement(n2, container);
    } else {
      patchElement(n1, n2);
    }
  };

  const mountElement = (vnode: VNode, container: RendererElement) => {
    const element: RendererElement = (vnode.element = hostCreateElement(
      vnode.type as string
    ));

    mountChildren(vnode.children as VNode[], element);

    if (vnode.props !== null) {
      for (const key in vnode.props) {
        hostPatchProp(element, key, vnode.props[key]);
      }
    }

    hostInsert(element, container);
  };

  const mountChildren = (children: VNode[], container: RendererElement) => {
    for (let i = 0; i < children.length; i++) {
      const child = (children[i] = normalizeVNode(children[i]));
      patch(null, child, container);
    }
  };

  const patchElement = (n1: VNode, n2: VNode) => {
    const element = (n2.element = n1.element!);

    patchChildren(n1, n2, element);

    for (const key in n2.props) {
      if (n2.props[key] !== n1.props?.[key]) {
        hostPatchProp(element, key, n2.props[key]);
      }
    }
  };

  const patchChildren = (n1: VNode, n2: VNode, container: RendererElement) => {
    const c1 = n1.children as VNode[];
    const c2 = n2.children as VNode[];

    for (let i = 0; i < c2.length; i++) {
      const child = (c2[i] = normalizeVNode(c2[i]));
      patch(c1[i], child, container);
    }
  };

  const processText = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement
  ) => {
    if (n1 === null) {
      hostInsert(
        (n2.element = hostCreateText(n2.children as string)),
        container
      );
    } else {
      const element = (n2.element = n1.element!);

      if (n2.children !== n1.children) {
        hostSetText(element, n2.children as string);
      }
    }
  };

  const render: RootRenderFunction = (rootComponent, container) => {
    if (rootComponent.setup === undefined) {
      return;
    }
    const componentRender = rootComponent.setup();

    let n1: VNode | null = null;

    const updateComponent = () => {
      const n2 = componentRender();
      patch(n1, n2, container);
      n1 = n2;
    };

    const effect = new ReactiveEffect(updateComponent);
    effect.run();
  };

  return {
    render,
  };
}
