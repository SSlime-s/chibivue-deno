export type ComponentOptions = {
  props?: Record<string, unknown>;
  // deno-lint-ignore ban-types
  render?: Function;
  // deno-lint-ignore ban-types
  setup?: (props: Record<string, unknown>) => Function;
};
