import { definePlugin } from "@expressive-code/core";

/**
 * Expressive Code plugin that marks code block `<figure>` elements with `data-pagefind-ignore`.
 * This prevents Pagefind from indexing raw code blocks and polluting site search results.
 */
const addPagefindIgnore = () =>
  definePlugin({
    name: "Add Pagefind Ignore",
    hooks: {
      postprocessRenderedBlock: ({ renderData }) => {
        if (renderData.blockAst.tagName === "figure") {
          renderData.blockAst.properties = {
            ...renderData.blockAst.properties,
            "data-pagefind-ignore": true,
          };
        }
      },
    },
  });

export default addPagefindIgnore;
