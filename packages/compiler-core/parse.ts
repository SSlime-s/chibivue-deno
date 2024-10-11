export interface ParsedContent {
  tag: string;
  props: Record<string, string>;
  textContent: string;
}

const tagRE = /<(?<tag>\w+)(?<attrs>\s+[^>]+)?>(?<textContent>[^<]*)<\/\1>/;
const propRE = /(?<key>\w+)=["'](?<value>[^"']*)["']/g;
export function baseParse(
  content: string,
): ParsedContent {
  const matched = content.match(tagRE);
  if (matched === null) {
    return {
      tag: "",
      props: {},
      textContent: content,
    };
  }

  const { tag, attrs, textContent } = matched.groups as {
    tag: string;
    attrs: string | undefined;
    textContent: string;
  };

  const props: Record<string, string> = {};
  if (attrs !== undefined) {
    attrs.replace(propRE, (...args) => {
      const { key, value } = args[args.length - 1];
      props[key] = value;
      return "";
    });
  }

  return {
    tag,
    props,
    textContent,
  };
}
