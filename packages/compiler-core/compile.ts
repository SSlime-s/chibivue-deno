import { generate } from "./codegen.ts";
import { baseParse } from "./parse.ts";

export function baseCompile(template: string) {
  const parseResult = baseParse(template.trim());
  const code = generate(parseResult);
  return code;
}
