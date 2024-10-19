import { toHandlerKey } from "../shared/general.ts";
import { unreachable } from "../shared/unreachable.ts";
import {
  type AttributeNode,
  type DirectiveNode,
  type ElementNode,
  type InterpolationNode,
  NodeTypes,
  type TemplateChildNode,
  type TextNode,
} from "./ast.ts";
import type { CompilerOptions } from "./mod.ts";

export function generate({ children }: {
  children: TemplateChildNode[];
}, option: Required<CompilerOptions>): string {
  return `
${option.isBrowser ? "return" : ""}function render(_ctx) {
  ${option.isBrowser ? "with (_ctx) {" : ""}
    const { h } = ChibiVue;
    return ${genNode(children[0], option)};
  ${option.isBrowser ? "}" : ""}
};`;
}

function genNode(
  node: TemplateChildNode,
  option: Required<CompilerOptions>,
): string {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node, option);
    case NodeTypes.TEXT:
      return genText(node);
    case NodeTypes.INTERPOLATION:
      return getInterpolation(node, option);
    default:
      return "";
  }
}

function genElement(
  element: ElementNode,
  option: Required<CompilerOptions>,
): string {
  return `h("${element.tag}", {${
    element.props
      .map((it) => genProp(it, option))
      .join(",")
  }}, [${element.children.map((it) => genNode(it, option)).join(",")}])`;
}

function genProp(
  prop: AttributeNode | DirectiveNode,
  option: Required<CompilerOptions>,
): string {
  switch (prop.type) {
    case NodeTypes.ATTRIBUTE:
      return `${prop.name}: "${prop.value?.content}"`;
    case NodeTypes.DIRECTIVE:
      switch (prop.name) {
        case "on":
          return `${toHandlerKey(prop.arg)}: ${
            option.isBrowser ? "" : "_ctx."
          }${prop.exp}`;
        default:
          throw new Error(`Unimplemented directive name: ${prop.name}`);
      }
    default:
      unreachable(prop);
  }
}

function genText(text: TextNode): string {
  return `\`${text.content}\``;
}

function getInterpolation(
  node: InterpolationNode,
  option: Required<CompilerOptions>,
): string {
  return `${option.isBrowser ? "" : "_ctx."}${node.content}`;
}
