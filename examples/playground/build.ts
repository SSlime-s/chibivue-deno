import * as esbuild from "https://deno.land/x/esbuild@v0.19.11/wasm.js";

import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.10.3";

import { posix } from "https://deno.land/std@0.156.0/path/mod.ts";

const result = await esbuild.build({
  plugins: [
    ...denoPlugins({
      configPath: Deno.realPathSync("deno.json"),
    }),
  ],
  // 対象ファイル名
  entryPoints: [Deno.realPathSync("main.ts")],
  outfile: Deno.realPathSync("dist/main.js"),
  bundle: true,
  format: "esm",
});

if (result.outputFiles) {
  for (const { path, contents, text } of result.outputFiles) {
    await Deno.mkdir(posix.dirname(path), { recursive: true });
    await Deno.writeFile(path, contents, {
      create: true,
    });
  }
}

esbuild.stop();
