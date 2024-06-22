const ts = require("typescript");
const path = require("path");

const filename = "./main.tsx";
const absolute = path.join(__dirname, filename);
const program = ts.createProgram([absolute], {}); // 第二个参数是 compiler options，就是配置文件里的那些

const sourceFile = program.getSourceFile(absolute);

const typeChecker = program.getTypeChecker();

const  { transformed } = ts.transform(sourceFile, [
    function (context) {
        return function (node) { 
            return ts.visitNode(node, visit); 
            function visit(node) {
                if (ts.isTypeReferenceNode(node)) {
                    const type = typeChecker.getTypeFromTypeNode(node);

                    if (type.value){
                        ts.addSyntheticTrailingComment(node, ts.SyntaxKind.SingleLineCommentTrivia, type.value);
                    }
                }
                return ts.visitEachChild(node, visit, context)
            }
        };
    }
]);

const printer =ts.createPrinter();

const code = printer.printNode(false, transformed[0], transformed[0]);

console.log(code);