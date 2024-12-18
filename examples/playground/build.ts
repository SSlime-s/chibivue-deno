// @deno-types="https://deno.land/x/esbuild@v0.19.11/wasm.d.ts"
import * as esbuild from "https://deno.land/x/esbuild@v0.19.11/wasm.js";

import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11.0";
import { posix } from "https://deno.land/std@0.156.0/path/mod.ts";
import chibivuePlugin from "@my/chibivue/esbuild-plugin-chibivue";

const result = await esbuild.build({
  plugins: [
    chibivuePlugin(),
    ...denoPlugins({
      configPath: Deno.realPathSync("deno.json"),
    }),
  ],
  // 対象ファイル名
  entryPoints: [new URL("src/main.ts", import.meta.url).pathname],
  outfile: new URL("dist/main.js", import.meta.url).pathname,
  bundle: true,
  format: "esm",
});

if (result.outputFiles) {
  for (const { path, contents } of result.outputFiles) {
    await Deno.mkdir(posix.dirname(path), { recursive: true });
    await Deno.writeFile(path, contents, {
      create: true,
    });
  }
}

esbuild.stop();
