const ts = require("typescript");
const fs = require("fs");
const path = require("path");


class OptimizeEnumPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "OptimizeEnumPlugin",
      (compilation, callback) => {
        console.log('这是一个示例插件！');
        console.log(compilation.assets)
        // 文件真实路径
        const relativePath = compilation.compiler.outputPath
        for (const fileName in compilation.assets) {
          if (fileName.endsWith(".js")) {
            const file = path.resolve(relativePath, fileName)
            const source = fs.readFileSync(file).toString();
            
              // Parse TypeScript AST
            const program = ts.createProgram({
              rootNames: [file],
              options: {}
            });
  
            // https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
            const checker = program.getTypeChecker();
  
            const ast = ts.createSourceFile(file, source, ts.ScriptTarget.ES2015);
            console.log(ast, "ast")
          }
        }
        callback()
      }
    );
  }
}

module.exports = OptimizeEnumPlugin;