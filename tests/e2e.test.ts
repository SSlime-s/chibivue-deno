import { spy, assertSpyCalls } from "@std/testing/mock";
import { assertSnapshot } from "@std/testing/snapshot";
import { h, reactive } from "../packages/mod.ts";
import { createApp } from "../packages/mod.ts";
import globalJsdom from "global-jsdom";

// HACK: global-jsdom を使うのは良くないが、コードの改修がかなり必要なため一旦諦める
//       ref: https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global
function setupDocument(): { [Symbol.dispose]: () => void } {
  const close = globalJsdom();
  return {
    [Symbol.dispose]: close,
  };
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
      setup: () => {
        return () =>
          h("div", { id: "my-app" }, [
            h("p", { style: "color: red; font-weight: bold;" }, [
              "Hello world.",
            ]),
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
    using _ = setupDocument();
    const host = createHost();
    // deno-lint-ignore no-empty-pattern
    const {} = create10_020App();

    await assertSnapshot(t, host.innerHTML);
  });

  Deno.test("10_minimum_example/020_simple_h_function/click_button", () => {
    const _ = setupDocument();
    createHost();
    const { onClick } = create10_020App();

    const button = document.querySelector("#btn") as HTMLButtonElement;
    button?.click();

    assertSpyCalls(onClick, 1);
  });
}

{
  // for 10_minimum_example/030_reactivity

  const create10_030App = () => {
    const app = createApp({
      setup: () => {
        const count = reactive({ count: 0 });
        const increment = () => {
          count.count++;
        };

        return () =>
          h("div", { id: "my-app" }, [
            h("p", {}, [`count: ${count.count}`]),
            h(
              "button",
              {
                id: "btn",
                onClick: increment,
              },
              ["+1"]
            ),
          ]);
      }
    });

    app.mount("#host");
  }

  Deno.test("10_minimum_example/030_reactivity", async (t) => {
    using _ = setupDocument();
    const host = createHost();
    create10_030App();

    await t.step("initial render", async () => {
      await assertSnapshot(t, host.innerHTML);
    });

    await t.step("after click once", async () => {
      const button = document.querySelector("#btn") as HTMLButtonElement;
      button?.click();

      await assertSnapshot(t, host.innerHTML);
    });

    await t.step("after click twice", async () => {
      const button = document.querySelector("#btn") as HTMLButtonElement;
      button?.click();

      await assertSnapshot(t, host.innerHTML);
    });
  });
}
