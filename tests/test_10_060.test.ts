import { createApp } from "chibivue";
import { HOST_ID, setup } from "./setup.ts";
import { assertSnapshot } from "@std/testing/snapshot";

Deno.test("template もコンパイルできる", async (t) => {
  {
    const resource = setup();
    const { host } = resource;

    const app = createApp({
      template: '<b class="hello" style="color: red;">Hello World!!</b>',
    });

    app.mount(`#${HOST_ID}`);

    await assertSnapshot(t, host.innerHTML);
  }

  {
    const resource = setup();
    const { host } = resource;

    const app = createApp({
      template:
        '<p class="hello" label="Hello, ChibiVue!">Hello, ChibiVue!</p>',
    });

    app.mount(`#${HOST_ID}`);

    await assertSnapshot(t, host.innerHTML);
  }
});
