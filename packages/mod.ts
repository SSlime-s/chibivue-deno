import { compile } from "./compiler-dom/mod.ts";
import {
  type InternalRenderFunction,
  registerRuntimeCompiler,
} from "./runtime-core/component.ts";
import * as runtimeDom from "./runtime-dom/mod.ts";

function compileToFunction(template: string): InternalRenderFunction {
  const code = compile(template);
  return new Function("ChibiVue", code)(runtimeDom);
}

registerRuntimeCompiler(compileToFunction);

export * from "./runtime-dom/mod.ts";
export * from "./runtime-core/mod.ts";
export * from "./reactivity/mod.ts";
