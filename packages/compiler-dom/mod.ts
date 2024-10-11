import { baseCompile } from "../compiler-core/mod.ts";

export function compile(template: string) {
  return baseCompile(template);
}
