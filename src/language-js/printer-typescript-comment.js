"use strict";

const { concat, hardline, indent, join } = require("../doc").builders;
const preprocess = require("./preprocess");

function genericPrint(path, options, printPath) {
  // Because we are getting the node in isolation
  const node = path.getValue().endOfFileToken.jsDoc[0];
  // debugger;

  if (node.comment) {
    return concat(["/**", hardline, " * " + node.comment, hardline, " */"]);
  }
}

function clean() {}

module.exports = {
  preprocess,
  print: genericPrint,
  massageAstNode: clean
};
