const { Project, SyntaxKind } = require("ts-morph");
const fs = require("fs");

const project = new Project({
  tsConfigFilePath: "d:/Alparai/tsconfig.json",
});

const sourceFiles = project.getSourceFiles("src/**/*.tsx");

const results = [];

const skipWords = ["alpar", "ai", "alpar ai", "&nbsp;", "&middot;", "v1", "svg", "path"];

sourceFiles.forEach(sourceFile => {
  const filePath = sourceFile.getFilePath();
  if (filePath.includes("/icons/") || filePath.includes("/ui/")) return;

  sourceFile.forEachDescendant(node => {
    if (node.getKind() === SyntaxKind.JsxText) {
      let text = node.getText().trim();
      text = text.replace(/&nbsp;/g, "").replace(/&middot;/g, "").trim();
      if (text.length > 1 && /[a-zA-Z]/.test(text)) {
        if (!skipWords.some(w => text.toLowerCase() === w)) {
          results.push({
            file: filePath.replace("d:/Alparai/src/", ""),
            line: node.getStartLineNumber(),
            type: "JsxText",
            text: text,
          });
        }
      }
    }

    if (node.getKind() === SyntaxKind.JsxAttribute) {
      const name = node.getNameNode().getText();
      if (["placeholder", "title", "alt", "label", "description", "aria-label"].includes(name)) {
        const initializer = node.getInitializer();
        if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
          const text = initializer.getLiteralText();
          if (text.length > 1 && /[a-zA-Z]/.test(text)) {
             results.push({
                file: filePath.replace("d:/Alparai/src/", ""),
                line: node.getStartLineNumber(),
                type: `JsxAttribute (${name})`,
                text: text,
             });
          }
        }
      }
    }
  });
});

console.log(JSON.stringify(results, null, 2));
