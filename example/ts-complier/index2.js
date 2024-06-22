const ts = require("typescript");
const path = require("path");

const filename = "./main.tsx";
const absolute = path.join(__dirname, filename);
const program = ts.createProgram([absolute], {}); // 第二个参数是 compiler options，就是配置文件里的那些

const ast = program.getSourceFile(absolute);

const checker = program.getTypeChecker();

console.log(ast)

const  { transformed } = ts.transform(ast, [
  function (context) {
      return function (node) { 
          
          const replaceEnum = (node) => {
            if (ts.isEnumDeclaration(node)) {
              return optimizeEnumDeclaration(node, checker);
            } else {
              return ts.visitEachChild(node, replaceEnum, context);
            }
          };
          return ts.visitNode(node, replaceEnum); 
      };
  }
]);

const printer = ts.createPrinter();

const code = printer.printNode(false, transformed[0], transformed[0]);
console.log(code)


function optimizeEnumDeclaration(node, checker) {
  // Get enum symbol and type
  const enumSymbol = checker.getSymbolAtLocation(node.name);
  const enumType = checker.getTypeOfSymbolAtLocation(enumSymbol, node.name);
  // Check if enum is a const enum
  if ((enumSymbol.getFlags() !== ts.SymbolFlags.RegularEnum)) {
    return node;
  }

  // Create object with enum constants
  const constObj = {};
  for (const member of enumType.symbol.valueDeclaration.members.values()) {
    constObj[member.name.escapedText] = checker.getConstantValue(member);
  }
  return constObj
  // // Replace enum references with constant object
  // const replaceEnum = (node) => {
  //   console.log(node.parent.name)
  //   if (ts.isIdentifier(node) && node.getText() === node.parent.name.getText()) {
  //     return ts.createObjectLiteral(Object.keys(constObj).map(name => {
  //       return ts.createPropertyAssignment(name, ts.createLiteral(constObj[name]));
  //     }));
  //   } else {
  //     return ts.visitEachChild(node, replaceEnum, null);
  //   }
  // };

  // return ts.visitNode(node, replaceEnum);
}