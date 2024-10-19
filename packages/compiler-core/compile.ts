import { generate } from "./codegen.ts";
import type { CompilerOptions } from "./mod.ts";
import { baseParse } from "./parse.ts";

export function baseCompile(template: string, option: Required<CompilerOptions>) {
  const parseResult = baseParse(template.trim());
  const code = generate(parseResult, option);
  return code;
}
