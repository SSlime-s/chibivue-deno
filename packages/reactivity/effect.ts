import { Dep, createDep } from "./dep.ts";

type KeyToDepMap = Map<unknown, Dep>;
const targetMap = new WeakMap<WeakKey, KeyToDepMap>();

export let activeEffect: ReactiveEffect | undefined;

export class ReactiveEffect<T = unknown> {
  constructor(public fn: () => T) {}

  run() {
    const before: ReactiveEffect | undefined = activeEffect;
    activeEffect = this;
    const res = this.fn();
    activeEffect = before;
    return res;
  }
}

export function track(target: object, key: unknown) {
  let depsMap = targetMap.get(target);
  if (depsMap === undefined) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (dep === undefined) {
    depsMap.set(key, (dep = createDep()));
  }

  if (activeEffect !== undefined) {
    dep.add(activeEffect);
  }
}

export function trigger(target: object, key?: unknown) {
  const depsMap = targetMap.get(target);
  if (depsMap === undefined) {
    return;
  }

  const dep = depsMap.get(key);
  if (dep !== undefined) {
    dep.forEach((effect) => {
      effect.run();
    });
  }
}
