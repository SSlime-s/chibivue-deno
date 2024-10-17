export const NodeTypes = {
  ELEMENT: "element",
  TEXT: "text",
  INTERPOLATION: "interpolation",
  ATTRIBUTE: "attribute",
  DIRECTIVE: "directive",
} as const;
export type NodeTypes = typeof NodeTypes[keyof typeof NodeTypes];

export interface Node {
  type: NodeTypes;
  loc: SourceLocation;
}

export interface ElementNode extends Node {
  type: typeof NodeTypes.ELEMENT;
  /** @example div, a */
  tag: string;
  props: (AttributeNode | DirectiveNode)[];
  children: TemplateChildNode[];
  /** @example <img /> -> true */
  isSelfClosing: boolean;
}

export interface AttributeNode extends Node {
  type: typeof NodeTypes.ATTRIBUTE;
  name: string;
  value: TextNode | undefined;
}

/** v-name:arg="exp" として解釈する */
export interface DirectiveNode extends Node {
  type: typeof NodeTypes.DIRECTIVE;
  name: string;
  arg: string;
  exp: string;
}

export type TemplateChildNode = ElementNode | TextNode | InterpolationNode;

export interface TextNode extends Node {
  type: typeof NodeTypes.TEXT;
  content: string;
}

export interface InterpolationNode extends Node {
  type: typeof NodeTypes.INTERPOLATION;
  content: string;
}

export interface SourceLocation {
  start: Position;
  end: Position;
  source: string;
}

export interface Position {
  offset: number;
  line: number;
  column: number;
}
