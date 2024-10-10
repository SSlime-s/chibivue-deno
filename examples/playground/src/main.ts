import { createApp, h, reactive } from "chibivue";

const Counter = {
  setup() {
    const state = reactive({ count: 0 });
    const increment = () => {
      state.count++;
    };

    return () =>
      h("div", {}, [
        h("p", {}, [`count: ${state.count}`]),
        h("button", { onClick: increment }, ["+1"]),
      ]);
  },
};

const app = createApp({
  setup: () => {
    return () =>
      h("div", {}, [
        h(Counter, {}, []),
        h(Counter, {}, []),
        h(Counter, {}, []),
      ]);
  },
});

app.mount("#app");
