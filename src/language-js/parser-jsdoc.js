"use strict";

const createError = require("../common/parser-create-error");
const includeShebang = require("../common/parser-include-shebang");
const hasPragma = require("./pragma").hasPragma;
const locFns = require("./loc");
const postprocess = require("./postprocess");

("use strict");
const ts = require("typescript");

function parse(text, parsers, opts) {
  const filename = "prettier-file.js";

  const compilerHost = {
    fileExists: () => true,
    getCanonicalFileName: filename => filename,
    getCurrentDirectory: () => "",
    getDefaultLibFileName: () => "lib.d.ts",
    getNewLine: () => "\n",
    getSourceFile: filename => {
      return ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true);
    },
    readFile: () => null,
    useCaseSensitiveFileNames: () => true,
    writeFile: () => null
  };

  const program = ts.createProgram(
    [filename],
    {
      allowJs: true,
      noResolve: true,
      target: ts.ScriptTarget.Latest,
      experimentalDecorators: true,
      experimentalAsyncFunctions: true,
      // TODO: Use isProbablyJsx() to alter this value
      jsx: true
    },
    compilerHost
  );

  const ast = program.getSourceFile(filename);

  return postprocess(ast, Object.assign({}, opts, { originalText: text }));
}

const parser = Object.assign(
  { parse, astFormat: "typescript-comment", hasPragma },
  locFns
);

// Export as a plugin so we can reuse the same bundle for UMD loading
module.exports = {
  parsers: {
    jsdoc: parser
  }
};
