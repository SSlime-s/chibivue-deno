import { VNode } from "./vnode.ts";

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
  message: string,
  container: HostElement
) => void;

export function createRenderer({
  patchProp: hostPatchProp,
  createElement: hostCreateElement,
  createText: hostCreateText,
  insert: hostInsert,
}: RendererOptions) {
  function renderVNode(vnode: VNode | string) {
    if (typeof vnode === "string") {
      return hostCreateText(vnode);
    }

    const element = hostCreateElement(vnode.type);

    Object.entries(vnode.props).forEach(([key, value]) => {
      hostPatchProp(element, key, value);
    });

    for (const child of vnode.children) {
      const childElement = renderVNode(child);
      hostInsert(childElement, element);
    }

    return element;
  }

  const render: RootRenderFunction = (vnode, container) => {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const element = renderVNode(vnode);
    hostInsert(element, container);
  };

  return {
    render,
  };
}
