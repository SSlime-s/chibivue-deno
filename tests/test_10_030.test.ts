import { createApp, h, reactive } from "chibivue";
import { assertSnapshot } from "@std/testing/snapshot";
import { HOST_ID, setup } from "./setup.ts";

function mountApp() {
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
            ["+1"],
          ),
        ]);
    },
  });

  app.mount(`#${HOST_ID}`);
}

Deno.test("10_minimum_example/030_reactivity", async (t) => {
  using resource = setup();
  const { host } = resource;
  mountApp();

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
