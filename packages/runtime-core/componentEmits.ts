import { camelize, toHandlerKey } from "../shared/general.ts";
import type { ComponentInternalInstance } from "./component.ts";

export function emit(
  instance: ComponentInternalInstance,
  event: string,
  ...rawArgs: unknown[]
) {
  const props = instance.vnode.props ?? {};
  const handler = props[toHandlerKey(event)] ??
    props[toHandlerKey(camelize(event))];

  if (handler === undefined) {
    return;
  }
  handler(...rawArgs);
}
