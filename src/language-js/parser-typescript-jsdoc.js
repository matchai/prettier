"use strict";

// TODO: Add error creation
const createError = require("../common/parser-create-error");
const includeShebang = require("../common/parser-include-shebang");
const hasPragma = require("./pragma").hasPragma;
const locFns = require("./loc");
const postprocess = require("./postprocess");

function parse(text, parsers, opts) {
  const ts = require("typescript");

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

  const filename = "pretterFile.ts";

  const program = ts.createProgram(
    [filename],
    {
      noResolve: true,
      target: ts.ScriptTarget.Latest,
      experimentalDecorators: true,
      experimentalAsyncFunctions: true,
      jsx: true
    },
    compilerHost
  );

  const sourceFile = program.getSourceFile(filename);

  includeShebang(text, sourceFile);
  postprocess(sourceFile, Object.assign({}, opts, { originalText: text }));
  return sourceFile;
}

const parser = Object.assign(
  { parse, astFormat: "typescript", hasPragma },
  locFns
);

// Export as a plugin so we can reuse the same bundle for UMD loading
module.exports = {
  parsers: {
    jsdoc: parser
  }
};
