import { ReactiveEffect } from "../reactivity/effect.ts";
import { Component } from "./component.ts";
import { RootRenderFunction } from "./renderer.ts";

// deno-lint-ignore no-explicit-any
export interface App<HostElement = any> {
  mount(rootContainer: HostElement | string): void;
}

export type CreateAppFunction<HostElement> = (
  rootComponent: Component
) => App<HostElement>;

export function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>
): CreateAppFunction<HostElement> {
  return (rootComponent) => {
    const app: App = {
      mount(rootContainer) {
        if (rootComponent.setup === undefined) {
          return;
        }

        const componentRender = rootComponent.setup();

        const updateComponent = () => {
          const vnode = componentRender();
          render(vnode, rootContainer);
        };

        const effect = new ReactiveEffect(updateComponent);
        effect.run();
      },
    };

    return app;
  };
}
