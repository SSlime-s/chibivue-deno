import { createApp, h, reactive } from "chibivue";

const MyComponent = {
  props: {
    someMessage: {
      type: String,
    },
  },
  setup(props: { someMessage: string }) {
    console.log(props);
    return () => h("div", {}, [`Message: ${props.someMessage}`]);
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
        h(MyComponent, { "some-message": state.message }, []),
        h("button", { onClick: changeMessage }, ["Change message"]),
      ]);
  },
});

app.mount("#app");
