const ts = require('typescript');

class OptimizeEnumPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('OptimizeEnumPlugin', (compilation, callback) => {
      for (const filename in compilation.assets) {
        if (filename.endsWith('.js')) {
          let source = compilation.assets[filename].source();

          const program = ts.createProgram({
            rootNames: [filename],
            options: {}
          });

          const checker = program.getTypeChecker();

          const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.ES2015);

          const replaceEnum = (node) => {
            if (ts.isEnumDeclaration(node)) {
              return this.optimizeEnumDeclaration(node, checker);
            } else {
              return ts.visitEachChild(node, replaceEnum, null);
            }
          };

          const optimizedAst = ts.visitNode(ast, replaceEnum);

          source = ts.createPrinter().printFile(optimizedAst);

          compilation.assets[filename] = {
            source: () => source,
            size: () => source.length
          };
        }
      }

      callback();
    });
  }

  optimizeEnumDeclaration(node, checker) {
    // Get enum symbol and type
    const enumSymbol = checker.getSymbolAtLocation(node.name);
    const enumType = checker.getTypeOfSymbolAtLocation(enumSymbol, node.name);

    // Check if enum is a const enum
    if (!(enumSymbol.getFlags() & ts.SymbolFlags.ConstEnum)) {
      return node;
    }

    // Create object with enum constants
    const constObj = {};
    const enumValues = checker.getEnumMemberValues(enumSymbol);
    for (const name in enumValues) {
      constObj[name] = enumValues[name];
    }

    // Replace enum references with constant object
    const replaceEnum = (node) => {
      if (ts.isIdentifier(node) && node.getText() === node.parent.name.getText()) {
        return ts.createObjectLiteral(Object.keys(constObj).map(name => {
          return ts.createPropertyAssignment(name, ts.createLiteral(constObj[name]));
        }));
      } else {
        return ts.visitEachChild(node, replaceEnum, null);
      }
    };

    return ts.visitNode(node, replaceEnum);
  }
}

module.exports = OptimizeEnumPlugin;