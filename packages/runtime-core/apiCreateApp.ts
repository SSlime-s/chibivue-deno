import { Component } from "./component.ts";
import { RootRenderFunction } from "./renderer.ts";

// deno-lint-ignore no-explicit-any
export interface App<HostElement = any> {
  mount(rootContainer: HostElement | string): void;
}

export type CreateAppFunction<HostElement> = (
  rootComponent: Component,
) => App<HostElement>;

export function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>,
): CreateAppFunction<HostElement> {
  return (rootComponent) => {
    const app: App = {
      mount(rootContainer: HostElement) {
        render(rootComponent, rootContainer);
      },
    };

    return app;
  };
}
