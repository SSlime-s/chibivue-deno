import {
  baseCompile,
  baseParse,
  type CompilerOptions,
} from "../compiler-core/mod.ts";

export function compile(template: string, option?: CompilerOptions) {
  const defaultOption: Required<CompilerOptions> = {
    isBrowser: true,
  };
  if (option !== undefined) {
    Object.assign(defaultOption, option);
  }
  return baseCompile(template, defaultOption);
}

export function parse(template: string) {
  return baseParse(template);
}
