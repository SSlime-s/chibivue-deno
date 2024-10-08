import { createApp } from "chibivue";

const app = createApp({
  render: () => {
    return "Hello, Chibivue!!";
  },
});

app.mount("#app");
