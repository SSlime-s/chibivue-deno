import { type ReactiveEffect } from "./effect.ts";

export type Dep = Set<ReactiveEffect>;

export function createDep(effects?: ReactiveEffect[]): Dep {
  const dep: Dep = new Set<ReactiveEffect>(effects);
  return dep;
}
