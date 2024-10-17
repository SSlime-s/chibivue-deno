export type ComponentOptions = {
  props?: Record<string, unknown>;
  // deno-lint-ignore ban-types
  render?: Function;
  setup?: (props: Record<string, unknown>, ctx: {
    emit: (event: string, ...args: unknown[]) => void;
    // deno-lint-ignore ban-types
  }) => Function | Record<string, unknown> | void;
  template?: string;
};
