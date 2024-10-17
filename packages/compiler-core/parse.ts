import type { DirectiveNode, InterpolationNode, Position } from "./ast.ts";
import type { AttributeNode } from "./ast.ts";
import type { SourceLocation } from "./ast.ts";
import type { ElementNode, TemplateChildNode, TextNode } from "./ast.ts";
import { NodeTypes } from "./ast.ts";

export interface ParserContext {
  readonly originalSource: string;

  source: string;

  offset: number;
  line: number;
  column: number;
}

function createParserContext(content: string): ParserContext {
  return {
    originalSource: content,
    source: content,

    offset: 0,
    line: 1,
    column: 1,
  };
}

export function baseParse(content: string): { children: TemplateChildNode[] } {
  const context = createParserContext(content);
  const children = parseChildren(context, []);

  return {
    children,
  };
}

function parseChildren(
  context: ParserContext,
  ancestors: ElementNode[],
): TemplateChildNode[] {
  const nodes: TemplateChildNode[] = [];

  while (!isEnd(context, ancestors)) {
    const { source } = context;
    let node: TemplateChildNode | undefined = undefined;

    if (startsWith(source, "{{")) {
      node = parseInterpolation(context);
    } else if (startsWith(source, "<")) {
      if (/[a-z]/i.test(source[1])) {
        node = parseElement(context, ancestors);
      }
    }

    if (node === undefined) {
      node = parseText(context);
    }

    pushNode(nodes, node);
  }

  return nodes;
}

function isEnd(
  context: ParserContext,
  ancestors: readonly ElementNode[],
): boolean {
  const { source } = context;

  if (startsWith(source, "</")) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      if (startsWithEndTagOpen(source, ancestors[i].tag)) {
        return true;
      }
    }
  }

  return source.length === 0;
}

function startsWith<Q extends string>(
  source: string,
  query: Q,
): source is `${Q}${string}` {
  return source.startsWith(query);
}

function pushNode(nodes: TemplateChildNode[], node: TemplateChildNode) {
  // NOTE: 連続するテキストノードはマージする
  if (node.type === NodeTypes.TEXT) {
    const prev = last(nodes);
    if (prev !== undefined && prev.type === NodeTypes.TEXT) {
      prev.content += node.content;
      return;
    }
  }

  nodes.push(node);
}

type LastOfArray<T extends unknown[]> = T extends [...infer _, infer Last]
  ? Last
  : T[number] | undefined;

function last<const T extends unknown[]>(
  array: T,
): LastOfArray<T> {
  return array[array.length - 1] as LastOfArray<T>;
}

function startsWithEndTagOpen(source: string, tag: string): boolean {
  return (
    startsWith(source, "</") &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
    /[\t\r\n\f />]/.test(source[2 + tag.length] ?? ">")
  );
}

function parseText(context: ParserContext): TextNode {
  // NOTE: 他のタグが開始するか、終了タグが現れるか、値の挿入が始まるまでテキストノードとして扱う
  const endTokens = ["{{", "<"];

  let endIndex = context.source.length;

  for (const endToken of endTokens) {
    const index = context.source.indexOf(endToken, 1);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }

  const start = getCursor(context);
  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
    loc: getSelection(context, start),
  };
}

function parseInterpolation(
  context: ParserContext,
): InterpolationNode | undefined {
  const [open, close] = ["{{", "}}"] as const;
  const closeIndex = context.source.indexOf(close, open.length);
  if (closeIndex === -1) {
    return undefined;
  }

  const start = getCursor(context);
  advanceBy(context, open.length);

  const innerStart = getCursor(context);
  const innerEnd = getCursor(context);
  const rawContentLength = closeIndex - open.length;
  const rawContent = context.source.slice(0, rawContentLength);
  const preTrimContent = parseTextData(context, rawContentLength);

  const content = preTrimContent.trim();

  const startOffset = preTrimContent.indexOf(content);

  if (startOffset > 0) {
    advancePositionWithMutation(innerStart, rawContent, startOffset);
  }
  const endOffset = rawContentLength -
    (preTrimContent.length - content.length - startOffset);
  advancePositionWithMutation(innerEnd, rawContent, endOffset);
  advanceBy(context, close.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content,
    loc: getSelection(context, start),
  };
}

function parseTextData(context: ParserContext, length: number): string {
  const rawText = context.source.slice(0, length);
  advanceBy(context, length);
  return rawText;
}

const TagType = {
  Start: "start",
  End: "end",
} as const;
type TagType = typeof TagType[keyof typeof TagType];

function parseElement(
  context: ParserContext,
  ancestors: ElementNode[],
): ElementNode | undefined {
  const element = parseTag(context, TagType.Start);

  if (element.isSelfClosing) {
    return element;
  }

  ancestors.push(element);
  const children = parseChildren(context, ancestors);
  ancestors.pop();

  element.children = children;

  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  }

  return element;
}

function parseTag(context: ParserContext, type: TagType): ElementNode {
  const start = getCursor(context);
  const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)!;
  const tag = match[1];

  advanceBy(context, match[0].length);
  advanceSpaces(context);

  const props = parseAttributes(context, type);

  const isSelfClosing = startsWith(context.source, "/>");
  advanceBy(context, isSelfClosing ? 2 : 1);

  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children: [],
    isSelfClosing,
    loc: getSelection(context, start),
  };
}

function parseAttributes(
  context: ParserContext,
  type: TagType,
): (AttributeNode | DirectiveNode)[] {
  const props = [];
  const attributeNames = new Set<string>();

  while (
    context.source.length > 0 &&
    !startsWith(context.source, ">") &&
    !startsWith(context.source, "/>")
  ) {
    const attr = parseAttribute(context, attributeNames);

    if (type === TagType.Start) {
      props.push(attr);
    }

    advanceSpaces(context);
  }

  return props;
}

type AttributeValue =
  | {
    content: string;
    loc: SourceLocation;
  }
  | undefined;

function parseAttribute(
  context: ParserContext,
  nameSet: Set<string>,
): AttributeNode | DirectiveNode {
  const start = getCursor(context);
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)!;
  const name = match[0];

  nameSet.add(name);

  advanceBy(context, name.length);

  let value: AttributeValue = undefined;

  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    advanceSpaces(context);
    advanceBy(context, 1);

    advanceSpaces(context);

    value = parseAttributeValue(context);
  }

  const loc = getSelection(context, start);
  if (/^(v-[A-Za-z0-9-]|@)/.test(name)) {
    const match =
      /(?:^v-(?<name>[a-z0-9-]+))?(?:(?::|^\.|^@|^#)(?<arg>\[[^\]]+\]|[^\.]+))?(.+)?$/
        .exec(name)!;

    const dirName = match.groups?.name ?? (startsWith(name, "@") ? "on" : "");

    const arg = match.groups?.arg ?? "";

    return {
      type: NodeTypes.DIRECTIVE,
      name: dirName,
      arg,
      exp: value?.content ?? "",
      loc,
    };
  }

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: value === undefined ? undefined : {
      type: NodeTypes.TEXT,
      content: value.content,
      loc: value.loc,
    },
    loc,
  };
}

function parseAttributeValue(context: ParserContext): AttributeValue {
  const start = getCursor(context);
  const quote = context.source[0];
  const isQuoted = quote === `"` || quote === `'`;

  let content: string;

  if (isQuoted) {
    advanceBy(context, 1);

    const endIndex = context.source.indexOf(quote);
    if (endIndex === -1) {
      content = parseTextData(context, context.source.length);
    } else {
      content = parseTextData(context, endIndex);
      advanceBy(context, 1);
    }
  } else {
    const match = /^[^\t\r\n\f >]+/.exec(context.source);
    if (match === null) {
      return undefined;
    }

    content = parseTextData(context, match[0].length);
  }

  return {
    content,
    loc: getSelection(context, start),
  };
}

function advanceBy(context: ParserContext, numberOfCharacters: number): void {
  const { source } = context;
  advancePositionWithMutation(context, source, numberOfCharacters);
  context.source = source.slice(numberOfCharacters);
}

function advanceSpaces(context: ParserContext): void {
  const match = /^[\t\r\n\f ]+/.exec(context.source);
  if (match !== null) {
    advanceBy(context, match[0].length);
  }
}

function advancePositionWithMutation(
  /** 破壊的に書き込まれる */
  pos: Position,
  source: string,
  numberOfCharacters: number = source.length,
) {
  let linesCount = 0;
  let lastNewLinePos = -1;

  for (let i = 0; i < numberOfCharacters; i++) {
    if (source[i] === "\n") {
      linesCount++;
      lastNewLinePos = i;
    }
  }

  pos.offset += numberOfCharacters;
  pos.line += linesCount;
  pos.column = lastNewLinePos === -1
    ? pos.column + numberOfCharacters
    : numberOfCharacters - lastNewLinePos;

  return pos;
}

function getCursor(context: Readonly<ParserContext>): Position {
  const { offset, line, column } = context;
  return { offset, line, column };
}

function getSelection(
  context: Readonly<ParserContext>,
  start: Position,
  end?: Position,
): SourceLocation {
  if (end === undefined) {
    end = getCursor(context);
  }

  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset),
  };
}
