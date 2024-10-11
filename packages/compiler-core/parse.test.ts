import { assertEquals } from "@std/assert/equals";
import { baseParse } from "./parse.ts";

Deno.test("パースできる", () => {
  const content = "<div id='app'>Hello, ChibiVue!</div>";
  const parsed = baseParse(content);
  assertEquals(parsed, {
    tag: "div",
    props: { id: "app" },
    textContent: "Hello, ChibiVue!",
  });
});

Deno.test("attr が空のときは空オブジェクト", () => {
  const content = "<div>Hello, ChibiVue!</div>";
  const parsed = baseParse(content);
  assertEquals(parsed, {
    tag: "div",
    props: {},
    textContent: "Hello, ChibiVue!",
  });
});

Deno.test("attr が複数あっても OK", () => {
  const content = "<div id='app' class='container'>Hello, ChibiVue!</div>";
  const parsed = baseParse(content);
  assertEquals(parsed, {
    tag: "div",
    props: { id: "app", class: "container" },
    textContent: "Hello, ChibiVue!",
  });
});

Deno.test("attr をは double quote でも single quote でも OK", () => {
  const content = "<div id='app' class=\"container\">Hello, ChibiVue!</div>";
  const parsed = baseParse(content);
  assertEquals(parsed, {
    tag: "div",
    props: { id: "app", class: "container" },
    textContent: "Hello, ChibiVue!",
  });
});

Deno.test("中身が空のときは空文字列", () => {
  const content = "<div id='app'></div>";
  const parsed = baseParse(content);
  assertEquals(parsed, {
    tag: "div",
    props: { id: "app" },
    textContent: "",
  });
});
