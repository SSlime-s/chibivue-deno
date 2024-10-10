import { unreachable } from "../../lib/unreachable.ts";
import { ReactiveEffect } from "../reactivity/effect.ts";
import {
  Component,
  createComponentInstance,
  type ComponentInternalInstance,
  type InternalRenderFunction,
} from "./component.ts";
import { initProps, updateProps } from "./componentProps.ts";
import { createVNode, normalizeVNode, VNode } from "./vnode.ts";
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
  parentNode(node: HostNode): HostNode | null;
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
  parentNode: hostParentNode,
}: RendererOptions) {
  const patch = (n1: VNode | null, n2: VNode, container: RendererElement) => {
    if (n2.type === Text) {
      processText(n1, n2, container);
    } else if (typeof n2.type === "string") {
      processElement(n1, n2, container);
    } else if (typeof n2.type === "object") {
      processComponent(n1, n2, container);
    } else {
      unreachable(n2.type);
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

  const processComponent = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement
  ) => {
    if (n1 === null) {
      mountComponent(n2, container);
    } else {
      updateComponent(n1, n2);
    }
  };

  const mountComponent = (initialVNode: VNode, container: RendererElement) => {
    const instance: ComponentInternalInstance = (initialVNode.component =
      createComponentInstance(initialVNode));

    initProps(instance, instance.vnode.props);

    const component = initialVNode.type as Component;
    if (component.setup !== undefined) {
      instance.render = component.setup(
        instance.props
      ) as InternalRenderFunction;
    }

    setupRenderEffect(instance, initialVNode, container);
  };

  const setupRenderEffect = (
    instance: ComponentInternalInstance,
    initialVNode: VNode,
    container: RendererElement
  ) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        const subTree = (instance.subTree = normalizeVNode(instance.render()));
        patch(null, subTree, container);
        initialVNode.element = subTree.element;
        instance.isMounted = true;
        return;
      }
      let { next } = instance;
      if (next === null) {
        next = instance.vnode;
      } else {
        next.element = instance.vnode.element;
        next.component = instance;
        instance.vnode = next;
        instance.next = null;
        updateProps(instance, next.props);
      }

      const prevTree = instance.subTree;
      const nextTree = normalizeVNode(instance.render());
      instance.subTree = nextTree;

      patch(prevTree, nextTree, hostParentNode(prevTree.element!)!);
      next.element = nextTree.element;
    };

    const effect = (instance.effect = new ReactiveEffect(componentUpdateFn));
    const update = (instance.update = () => effect.run());
    update();
  };

  const updateComponent = (n1: VNode, n2: VNode) => {
    const instance = (n2.component = n1.component)!;
    instance.next = n2;
    instance.update();
  };

  const render: RootRenderFunction = (rootComponent, container) => {
    const vnode = createVNode(rootComponent, {}, []);
    patch(null, vnode, container);
  };

  return {
    render,
  };
}
