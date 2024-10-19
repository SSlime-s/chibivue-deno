import { TemplateChildNode } from "../compiler-core/mod.ts";

export interface TemplateCompiler {
  compile(template: string): string;
  parse(template: string): {
    children: TemplateChildNode[];
  };
}
