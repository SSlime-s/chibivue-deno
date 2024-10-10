import { createApp, h, reactive } from "chibivue";

const MyComponent = {
  props: {
    message: {
      type: String,
    },
  },
  setup(props: { message: string }) {
    console.log(props);
    return () => h("div", {}, [`Message: ${props.message}`]);
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
        h(MyComponent, { message: state.message }, []),
        h("button", { onClick: changeMessage }, ["Change message"]),
      ]);
  },
});

app.mount("#app");
