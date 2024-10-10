import { assertSnapshot } from "@std/testing/snapshot";
import { createApp, h, reactive } from "../packages/mod.ts";
import { HOST_ID, setup } from "./setup.ts";

function mountApp() {
  const Counter = {
    setup() {
      const state = reactive({ count: 0 });
      const increment = () => {
        state.count++;
      };

      return () =>
        h("div", {}, [
          h("p", {}, [`count: ${state.count}`]),
          h("button", { class: "btn", onClick: increment }, ["+1"]),
        ]);
    },
  };

  const app = createApp({
    setup: () => {
      return () =>
        h("div", { id: "my-app" }, [
          h(Counter, {}, []),
          h(Counter, {}, []),
          h(Counter, {}, []),
        ]);
    },
  });

  app.mount(`#${HOST_ID}`);
}

Deno.test("10_minimum_example/050_component_system", async (t) => {
  using resource = setup();
  const { host } = resource;

  mountApp();

  await t.step("最初", async () => {
    await assertSnapshot(t, host.innerHTML);
  });

  await t.step("最初のボタンをクリック", async () => {
    const button = document.querySelectorAll<HTMLButtonElement>(".btn");
    button[0].click();

    await assertSnapshot(t, host.innerHTML);
  });

  await t.step("2番目のボタンをクリック", async () => {
    const button = document.querySelectorAll<HTMLButtonElement>(".btn");
    button[1].click();

    await assertSnapshot(t, host.innerHTML);
  });

  await t.step("ボタン連打", async () => {
    const button = document.querySelectorAll<HTMLButtonElement>(".btn");
    button[0].click();
    button[0].click();
    button[0].click();

    await assertSnapshot(t, host.innerHTML);
  });
});
