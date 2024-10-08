import {
  createAppAPI,
  CreateAppFunction,
} from "../runtime-core/apiCreateApp.ts";
import { createRenderer } from "../runtime-core/renderer.ts";
import { nodeOps } from "./nodeOps.ts";
export { h } from "../runtime-core/h.ts";

const { render } = createRenderer(nodeOps);
const _createApp = createAppAPI(render);

export const createApp = ((...args) => {
  const app = _createApp(...args);
  const { mount } = app;
  app.mount = (selector: string) => {
    const container = document.querySelector(selector);
    if (!container) return;
    mount(container);
  };

  return app;
}) satisfies CreateAppFunction<Element>;
