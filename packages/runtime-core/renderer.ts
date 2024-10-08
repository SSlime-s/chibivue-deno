export interface RendererOptions<HostNode = RendererNode> {
  setElementText(node: HostNode, text: string): void;
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
  setElementText: hostSetElementText,
}: RendererOptions) {
  const render: RootRenderFunction = (message, container) => {
    hostSetElementText(container, message);
  };

  return {
    render,
  };
}
