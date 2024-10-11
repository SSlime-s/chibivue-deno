import { assertSnapshot } from "@std/testing/snapshot";
import { generate } from "./codegen.ts";

Deno.test("generate できる", async (t) => {
  const parsed = {
    tag: "div",
    props: { id: "app" },
    textContent: "Hello, ChibiVue!",
  };
  await assertSnapshot(t, generate(parsed));
});
