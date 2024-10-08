import { createApp, h, reactive } from "chibivue";

const app = createApp({
  setup: () => {
    const state = reactive({ count: 0 });
    const increment = () => {
      state.count++;
    };

    return () =>
      h("div", { id: "my-app" }, [
        h("p", {}, [`count: ${state.count}`]),
        h(
          "button",
          {
            onClick: increment,
          },
          ["+1"]
        ),
      ]);
  },
});

app.mount("#app");
