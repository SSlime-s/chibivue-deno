import { createApp, h, reactive } from "chibivue";

const MyComponent = {
  props: {
    someMessage: {
      type: String,
    },
  },
  setup(
    props: { someMessage: string },
    { emit }: { emit: (message: string, ...args: unknown[]) => void },
  ) {
    return () =>
      h("div", {}, [
        h("p", {}, [props.someMessage]),
        h("button", {
          class: "btn",
          onClick: () => emit("click:change-message"),
        }, [
          "change message",
        ]),
      ]);
  },
};

const app = createApp({
  setup: () => {
    const state = reactive({ message: "hello" });
    const changeMessage = () => {
      state.message += "!";
    };

    return () =>
      h("div", { id: "my-app" }, [
        h(MyComponent, {
          "some-message": state.message,
          "onClick:change-message": changeMessage,
        }, []),
      ]);
  },
});

app.mount("#app");
