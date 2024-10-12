import { assertEquals } from "@std/assert/equals";
import { baseParse } from "./parse.ts";
import { NodeTypes } from "./ast.ts";

Deno.test("パースできる", () => {
  const content = "<div id='app'>Hello, ChibiVue!</div>";
  const parsed = baseParse(content);
  assertEquals(parsed, {
    children: [{
      type: NodeTypes.ELEMENT,
      tag: "div",
      props: [{
        type: NodeTypes.ATTRIBUTE,
        name: "id",
        value: {
          type: NodeTypes.TEXT,
          content: "app",
          loc: {
            start: { offset: 8, line: 1, column: 9 },
            end: { offset: 13, line: 1, column: 14 },
            source: "'app'",
          },
        },
        loc: {
          start: { offset: 5, line: 1, column: 6 },
          end: { offset: 13, line: 1, column: 14 },
          source: "id='app'",
        },
      }],
      children: [{
        type: NodeTypes.TEXT,
        content: "Hello, ChibiVue!",
        loc: {
          start: { offset: 14, line: 1, column: 15 },
          end: { offset: 30, line: 1, column: 31 },
          source: "Hello, ChibiVue!",
        },
      }],
      loc: {
        start: { offset: 0, line: 1, column: 1 },
        end: { offset: 14, line: 1, column: 15 },
        source: "<div id='app'>",
      },
      isSelfClosing: false,
    }],
  });
});

Deno.test("attr をは double quote でも single quote でも OK", () => {
  const content = '<div id="app">Hello, ChibiVue!</div>';
  const parsed = baseParse(content);
  assertEquals(parsed, {
    children: [{
      type: NodeTypes.ELEMENT,
      tag: "div",
      props: [{
        type: NodeTypes.ATTRIBUTE,
        name: "id",
        value: {
          type: NodeTypes.TEXT,
          content: "app",
          loc: {
            start: { offset: 8, line: 1, column: 9 },
            end: { offset: 13, line: 1, column: 14 },
            source: '"app"',
          },
        },
        loc: {
          start: { offset: 5, line: 1, column: 6 },
          end: { offset: 13, line: 1, column: 14 },
          source: 'id="app"',
        },
      }],
      children: [{
        type: NodeTypes.TEXT,
        content: "Hello, ChibiVue!",
        loc: {
          start: { offset: 14, line: 1, column: 15 },
          end: { offset: 30, line: 1, column: 31 },
          source: "Hello, ChibiVue!",
        },
      }],
      loc: {
        start: { offset: 0, line: 1, column: 1 },
        end: { offset: 14, line: 1, column: 15 },
        source: '<div id="app">',
      },
      isSelfClosing: false,
    }],
  });
});

Deno.test("セルフクロージングタグのときは isSelfClosing が true になる", () => {
  const content = '<div id="app" />';
  const parsed = baseParse(content);

  assertEquals(parsed, {
    children: [{
      type: NodeTypes.ELEMENT,
      tag: "div",
      props: [{
        type: NodeTypes.ATTRIBUTE,
        name: "id",
        value: {
          type: NodeTypes.TEXT,
          content: "app",
          loc: {
            start: { offset: 8, line: 1, column: 9 },
            end: { offset: 13, line: 1, column: 14 },
            source: '"app"',
          },
        },
        loc: {
          start: { offset: 5, line: 1, column: 6 },
          end: { offset: 13, line: 1, column: 14 },
          source: 'id="app"',
        },
      }],
      children: [],
      loc: {
        start: { offset: 0, line: 1, column: 1 },
        end: { offset: 16, line: 1, column: 17 },
        source: '<div id="app" />',
      },
      isSelfClosing: true,
    }],
  });
});
