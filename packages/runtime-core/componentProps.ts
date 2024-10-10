import { reactive } from "../reactivity/reactive.ts";
import type { ComponentInternalInstance, Data } from "./component.ts";

export type Props = Record<string, PropOptions | null>;

export interface PropOptions<T = unknown> {
  type?: PropType<T> | true | null;
  required?: boolean;
  default?: null | undefined | object;
}

export type PropType<T> = {
  // deno-lint-ignore ban-types
  new (...args: unknown[]): T & {};
};

export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null
) {
  const props: Data = {};
  setFullProps(instance, rawProps, props);
  instance.props = reactive(props);
}

function setFullProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data
) {
  const options = instance.propsOptions;

  if (rawProps === null) {
    return;
  }

  for (const key in rawProps) {
    if (
      options === undefined ||
      !Object.prototype.hasOwnProperty.call(options, key)
    ) {
      continue;
    }
    props[key] = rawProps[key];
  }
}

export function updateProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null
) {
  Object.assign(instance.props, rawProps);
}
