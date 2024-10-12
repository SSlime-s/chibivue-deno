import { assertSnapshot } from "@std/testing/snapshot";
import { generate } from "./codegen.ts";
import { type ElementNode, NodeTypes } from "./ast.ts";

Deno.test("generate できる", async (t) => {
  const dummyLoc = {
    start: { offset: 0, line: 0, column: 0 },
    end: { offset: 0, line: 0, column: 0 },
    source: "",
  };
  const parsed: ElementNode = {
    type: NodeTypes.ELEMENT,
    tag: "div",
    props: [{
      type: NodeTypes.ATTRIBUTE,
      name: "id",
      value: {
        type: NodeTypes.TEXT,
        content: "app",
        loc: dummyLoc,
      },
      loc: dummyLoc,
    }],
    children: [{
      type: NodeTypes.TEXT,
      content: "Hello, ChibiVue!",
      loc: dummyLoc,
    }],
    loc: dummyLoc,
    isSelfClosing: false,
  };
  await assertSnapshot(t, generate({ children: [parsed] }));
});
