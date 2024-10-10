import { createApp, h, reactive } from "chibivue";
import { assertSnapshot } from "@std/testing/snapshot";
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

function mountApp2() {
  const MyComponent = {
    props: {
      count: {
        type: Number,
      },
    },
    setup(props: { count: number }) {
      return () => h("p", {}, [`count: ${props.count}`]);
    },
  };

  const app = createApp({
    setup: () => {
      const state = reactive({ count: 0 });
      const increment = () => {
        state.count++;
      };

      return () =>
        h("div", { id: "my-app" }, [
          h(MyComponent, { count: state.count }, []),
          h("button", { class: "btn", onClick: increment }, ["+1"]),
        ]);
    },
  });

  app.mount(`#${HOST_ID}`);
}

Deno.test("10_minimum_example/050_component_system2", async (t) => {
  using resource = setup();
  const { host } = resource;

  mountApp2();

  await t.step("最初", async () => {
    await assertSnapshot(t, host.innerHTML);
  });

  await t.step(
    "state を変えたときに props が変わって再描画される",
    async () => {
      const button = document.querySelector<HTMLButtonElement>(".btn");
      button?.click();

      await assertSnapshot(t, host.innerHTML);
    },
  );
});

function mountApp3() {
  const MyComponent = {
    props: {
      myCount: {
        type: Number,
      },
    },
    setup(props: { myCount: number }) {
      return () => h("p", {}, [`count: ${props.myCount}`]);
    },
  };

  const app = createApp({
    setup: () => {
      const state = reactive({ count: 0 });
      const increment = () => {
        state.count++;
      };

      return () =>
        h("div", { id: "my-app" }, [
          h(MyComponent, { "my-count": state.count }, []),
          h("button", { class: "btn", onClick: increment }, ["+1"]),
        ]);
    },
  });

  app.mount(`#${HOST_ID}`);
}

Deno.test("10_minimum_example/050_component_system2/ケバブケースはコンポーネント渡されるときにキャメルケースになる", async (t) => {
  using resource = setup();
  const { host } = resource;

  mountApp2();

  await t.step("最初", async () => {
    await assertSnapshot(t, host.innerHTML);
  });

  await t.step(
    "state を変えたときに props が変わって再描画される",
    async () => {
      const button = document.querySelector<HTMLButtonElement>(".btn");
      button?.click();

      await assertSnapshot(t, host.innerHTML);
    },
  );
});
