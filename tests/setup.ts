import globalJsdom from "global-jsdom";

export const HOST_ID = "host";

// HACK: global-jsdom を使うのは良くないが、コードの改修がかなり必要なため一旦諦める
//       ref: https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global
export function setup(): { host: HTMLElement; [Symbol.dispose]: () => void } {
  const close = globalJsdom();
  const host = createHost();
  return {
    host,
    [Symbol.dispose]: close,
  };
}

function createHost(): HTMLElement {
  const host = document.createElement("div");
  host.id = "host";
  document.body.appendChild(host);

  return host;
}
