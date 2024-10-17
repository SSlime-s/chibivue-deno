import { createApp } from "chibivue";
import { HOST_ID, setup } from "./setup.ts";
import { assertSnapshot } from "@std/testing/snapshot";
import { reactive } from "../packages/reactivity/reactive.ts";

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

Deno.test("変数を挿入できる", async (t) => {
  const resource = setup();
  const { host } = resource;

  const app = createApp({
    setup() {
      const state = reactive({ message: "Hello, ChibiVue!" });
      return { state };
    },
    template: '<p class="hello">{{ state.message }}</p>',
  });

  app.mount(`#${HOST_ID}`);

  await assertSnapshot(t, host.innerHTML);
});

Deno.test("イベントリスナを設定できる", async (t) => {
  const resource = setup();
  const { host } = resource;

  const app = createApp({
    setup() {
      const state = reactive({ count: 0 });
      const increment = () => {
        state.count++;
      };
      return { state, increment };
    },
    template: '<button @click="increment">{{ state.count }}</button>',
  });

  app.mount(`#${HOST_ID}`);

  await t.step("最初の画面", async () => {
    await assertSnapshot(t, host.innerHTML);
  });
  await t.step("ボタンをクリックしたらイベントが発火する", async () => {
    const button = host.querySelector("button")!;
    button.dispatchEvent(new MouseEvent("click"));
    await assertSnapshot(t, host.innerHTML);
  });
});

Deno.test("イベントリスナの登録は v-on でもできる", async (t) => {
  const resource = setup();
  const { host } = resource;

  const app = createApp({
    setup() {
      const state = reactive({ count: 0 });
      const increment = () => {
        state.count++;
      };
      return { state, increment };
    },
    template: '<button v-on:click="increment">{{ state.count }}</button>',
  });

  app.mount(`#${HOST_ID}`);

  await t.step("最初の画面", async () => {
    await assertSnapshot(t, host.innerHTML);
  });
  await t.step("ボタンをクリックしたらイベントが発火する", async () => {
    const button = host.querySelector("button")!;
    button.dispatchEvent(new MouseEvent("click"));
    await assertSnapshot(t, host.innerHTML);
  });
});
