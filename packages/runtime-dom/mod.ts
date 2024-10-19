import {
  createAppAPI,
  type CreateAppFunction,
} from "../runtime-core/apiCreateApp.ts";
import { createRenderer } from "../runtime-core/renderer.ts";
import { nodeOps } from "./nodeOps.ts";
import { patchProp } from "./patchProp.ts";

const { render } = createRenderer({ ...nodeOps, patchProp });
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

export { h } from "../runtime-core/mod.ts";
