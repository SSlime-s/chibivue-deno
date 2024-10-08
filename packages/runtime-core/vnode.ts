export interface VNode {
  type: string;
  props: VNodeProps;
  children: (VNode | string)[];
}

export interface VNodeProps {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}
