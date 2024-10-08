import { track, trigger } from "./effect.ts";
import { reactive } from "./reactive.ts";

export const mutableHandlers: ProxyHandler<object> = {
  get(target, key, receiver) {
    track(target, key);

    const res = Reflect.get(target, key, receiver);
    if (typeof res === "object" && res !== null) {
      return reactive(res);
    }

    return res;
  },

  set(target, key, value, receiver) {
    // deno-lint-ignore no-explicit-any
    const oldValue = (target as any)[key];
    Reflect.set(target, key, value, receiver);

    if (hasChanged(value, oldValue)) {
      trigger(target, key);
    }

    return true;
  },
};

function hasChanged(value: unknown, oldValue: unknown): boolean {
  return !Object.is(value, oldValue);
}
