import { spy, assertSpyCalls } from "@std/testing/mock";
import { assertSnapshot } from "@std/testing/snapshot";
import { h } from "../packages/mod.ts";
import { createApp } from "../packages/mod.ts";
import globalJsdom from "global-jsdom";

// HACK: global-jsdom を使うのは良くないが、コードの改修がかなり必要なため一旦諦める
//       ref: https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global
function setupDocument(): { close: () => void } {
  const close = globalJsdom();
  return { close };
}

function createHost(): HTMLElement {
  const host = document.createElement("div");
  host.id = "host";
  document.body.appendChild(host);

  return host;
}

{
  // for 10_minimum_example/020_simple_h_function

  const create10_020App = () => {
    const onClick = spy();
    const app = createApp({
      render: () => {
        return h("div", { id: "my-app" }, [
          h("p", { style: "color: red; font-weight: bold;" }, ["Hello world."]),
          h(
            "button",
            {
              id: "btn",
              onClick,
            },
            ["click me!"]
          ),
        ]);
      },
    });

    app.mount("#host");

    return { onClick };
  };

  Deno.test("10_minimum_example/020_simple_h_function/snapshot", async (t) => {
    const { close } = setupDocument();
    const host = createHost();
    // deno-lint-ignore no-empty-pattern
    const {} = create10_020App();

    await assertSnapshot(t, host.innerHTML);

    close();
  });

  Deno.test("10_minimum_example/020_simple_h_function/click_button", () => {
    const { close } = setupDocument();
    const _ = createHost();
    const { onClick } = create10_020App();

    const button = document.querySelector("#btn") as HTMLButtonElement;
    button?.click();

    assertSpyCalls(onClick, 1);

    close();
  });
}
