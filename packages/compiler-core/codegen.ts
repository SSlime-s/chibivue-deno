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

export function generate({ children }: {
  children: TemplateChildNode[];
}): string {
  return `
return (_ctx) => {
  with (_ctx) {
    const { h } = ChibiVue;
    return ${genNode(children[0])};
  }
};`;
}

function genNode(node: TemplateChildNode): string {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node);
    case NodeTypes.TEXT:
      return genText(node);
    case NodeTypes.INTERPOLATION:
      return getInterpolation(node);
    default:
      return "";
  }
}

function genElement(element: ElementNode): string {
  return `h("${element.tag}", {${
    element.props
      .map(genProp)
      .join(",")
  }}, [${element.children.map(genNode).join(",")}])`;
}

function genProp(prop: AttributeNode | DirectiveNode): string {
  switch (prop.type) {
    case NodeTypes.ATTRIBUTE:
      return `${prop.name}: "${prop.value?.content}"`;
    case NodeTypes.DIRECTIVE:
      switch (prop.name) {
        case "on":
          return `${toHandlerKey(prop.arg)}: ${prop.exp}`;
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

function getInterpolation(node: InterpolationNode): string {
  return `${node.content}`;
}
