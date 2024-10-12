import {
  type ElementNode,
  NodeTypes,
  type TemplateChildNode,
  type TextNode,
} from "./ast.ts";

export function generate({ children }: {
  children: TemplateChildNode[];
}): string {
  return `
return () => {
  const { h } = ChibiVue;
  return ${genNode(children[0])};
};`;
}

function genNode(node: TemplateChildNode): string {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node);
    case NodeTypes.TEXT:
      return genText(node);
    default:
      return "";
  }
}

function genElement(element: ElementNode): string {
  return `h("${element.tag}", {${
    element.props
      .map(({ name, value }) => `"${name}": "${value?.content}"`)
      .join(",")
  }}, [${element.children.map(genNode).join(",")}])`;
}

function genText(text: TextNode): string {
  return `\`${text.content}\``;
}
