// @deno-types="https://deno.land/x/esbuild@v0.19.11/wasm.d.ts"
import { type Plugin } from "https://deno.land/x/esbuild@v0.19.11/wasm.js";
import { parse } from "../../compiler-sfc/mod.ts";
import { basename } from "node:path";
import { compile } from "../../compiler-dom/mod.ts";
import { rewriteDefault } from "../../compiler-sfc/rewriteDefault.ts";

const VIRTUAL_CSS_NAMESPACE = "chibiVueSFCCss";

export default function esbuildPluginChibivue(): Plugin {
  return {
    name: "esbuild:chibivue",
    setup(build) {
      build.onResolve({ filter: /\.vue\.css$/ }, (args) => {
        return {
          path: args.path,
          namespace: VIRTUAL_CSS_NAMESPACE,
        };
      });
      build.onLoad(
        { filter: /\.vue\.css$/, namespace: VIRTUAL_CSS_NAMESPACE },
        async (args) => {
          console.log(args.path);
          const vueFileName = args.path.replace(/\.css$/, "");
          const contents = await Deno.readTextFile(vueFileName);

          const { descriptor } = parse(contents, {
            filename: basename(vueFileName),
          });

          const styles = descriptor.styles.map((style) => style.content).join(
            "\n",
          );

          return {
            contents: styles,
            loader: "css",
          };
        },
      );
      build.onLoad({ filter: /\.vue$/ }, async (args) => {
        const contents = await Deno.readTextFile(args.path);

        const outputs: string[] = [];
        outputs.push("import * as ChibiVue from 'chibivue'\n");
        outputs.push(`import "${args.path}.css"\n`);

        const { descriptor } = parse(contents, {
          filename: basename(args.path),
        });

        const SFC_MAIN = "_sfc_main";
        const scriptCode = rewriteDefault(
          descriptor.script?.content ?? "",
          SFC_MAIN,
        );
        outputs.push(scriptCode);

        const templateCode = compile(descriptor.template?.content ?? "", {
          isBrowser: false,
        });
        outputs.push(templateCode);

        outputs.push("\n");
        outputs.push(`export default { ...${SFC_MAIN}, render }`);

        return {
          contents: outputs.join(""),
          loader: "ts",
        };
      });
    },
  };
}
