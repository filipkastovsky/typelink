import ts from 'typescript';
import fs from 'node:fs/promises';

const OUT_FILE = 'routes.d.ts';
const OUT_TYPE = 'FSHref';

export const createPrinter = () => {
  return ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
};

export const createSourceFile = (filename: string) => {
  return ts.createSourceFile(filename, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
};

export function generateTypeNode(identifier: string, moduleName: string, routes: string[]) {
  const importClause = ts.factory.createImportClause(
    true,
    undefined,
    ts.factory.createNamedImports([
      ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('FromUnion')),
    ])
  );

  const importStatement = ts.factory.createImportDeclaration(
    undefined,
    importClause,
    ts.factory.createStringLiteral('@typelink/core')
  );

  const typeId = ts.factory.createIdentifier(identifier);

  const unionId = ts.factory.createIdentifier(OUT_TYPE);
  const unionTypeNode = ts.factory.createTypeReferenceNode(unionId, undefined);

  const union = ts.factory.createUnionTypeNode(
    routes.map((route) => ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(route)))
  );

  const unionType = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    unionId,
    undefined,
    union
  );

  const fromUnionExpression = ts.factory.createExpressionWithTypeArguments(ts.factory.createIdentifier('FromUnion'), [
    unionTypeNode,
  ]);

  const typeAlias = ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    typeId,
    undefined,
    [ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [fromUnionExpression])],
    []
  );

  const moduleIdentifier = ts.factory.createIdentifier(`"${moduleName}"`);

  const moduleBody = ts.factory.createModuleBlock([importStatement, unionType, typeAlias]);

  const tsModule = ts.factory.createModuleDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
    moduleIdentifier,
    moduleBody
  );

  return tsModule;
}

export const printTypeNode =
  (
    identifier: string,
    printer: ts.Printer,
    moduleName: string,
    out: string,
    sourceFile: ts.SourceFile,
    routes: Set<string>
  ) =>
  async (routeEvents: [path: string, event: 'ADD' | 'REMOVE'][]) => {
    for (const [path, event] of routeEvents) {
      if (event === 'ADD') {
        routes.add(path);
      } else {
        routes.delete(path);
      }
    }

    const typeAlias = generateTypeNode(identifier, moduleName, [...routes]);
    const printed = printer.printNode(ts.EmitHint.Unspecified, typeAlias, sourceFile);

    await fs.mkdir(out, { recursive: true });
    await fs.writeFile(`${out}/${OUT_FILE}`, printed);
  };
