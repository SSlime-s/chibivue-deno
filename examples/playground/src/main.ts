import { createApp } from "chibivue";

const app = createApp({
  setup() {
    queueMicrotask(() => {
      const button = document.getElementById("btn");
      if (button === null) {
        return;
      }

      button.addEventListener("click", () => {
        const h2 = document.getElementById("title");
        if (h2 === null) {
          return;
        }

        h2.textContent += "!";
      });
    });
  },
  template: `
    <div class="container" style="text-align: center">
      <h2 id="title">Hello, chibivue!</h2>
      <img
        width="150px"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
        alt="Vue.js Logo"
      />
      <p><b>chibivue</b> is the minimal Vue.js</p>

      <button id="btn"> click me! </button>

      <style>
        .container {
          height: 100vh;
          padding: 16px;
          background-color: #becdbe;
          color: #2c3e50;
        }
      </style>
    </div>
  `,
});
app.mount("#app");
