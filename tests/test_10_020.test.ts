import { createApp, h } from "chibivue";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { HOST_ID, setup } from "./setup.ts";
import { assertSnapshot } from "@std/testing/snapshot";

function mountApp() {
  const onClick = spy();
  const app = createApp({
    setup: () => {
      return () =>
        h("div", { id: "my-app" }, [
          h("p", { style: "color: red; font-weight: bold;" }, ["Hello world."]),
          h(
            "button",
            {
              id: "btn",
              onClick,
            },
            ["click me!"],
          ),
        ]);
    },
  });

  app.mount(`#${HOST_ID}`);

  return { onClick };
}

Deno.test("10_minimum_example/020_simple_h_function/snapshot", async (t) => {
  using resource = setup();
  const { host } = resource;
  // deno-lint-ignore no-empty-pattern
  const {} = mountApp();

  await assertSnapshot(t, host.innerHTML);
});

Deno.test("10_minimum_example/020_simple_h_function/onClickを渡したときに関数がバインドされる", () => {
  const _ = setup();
  const { onClick } = mountApp();

  const button = document.querySelector("#btn") as HTMLButtonElement;
  button?.click();

  assertSpyCalls(onClick, 1);
});
