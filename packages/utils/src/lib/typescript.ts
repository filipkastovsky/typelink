import ts from 'typescript';
import fs from 'node:fs/promises';

export const createPrinter = () => {
  return ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
};

export const createSourceFile = (filename: string) => {
  return ts.createSourceFile(filename, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
};

export function generateTypeNode(identifier: string, moduleName: string, routes: string[]) {
  const importStatement = ts.factory.createImportDeclaration(
    undefined,
    undefined,
    ts.factory.createStringLiteral('@typelink/core')
  );

  const typeId = ts.factory.createIdentifier(identifier);

  const properties = routes.map((route) =>
    ts.factory.createPropertySignature(
      [ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
      ts.factory.createIdentifier(`"${route}"`),
      undefined,
      ts.factory.createTypeLiteralNode(undefined)
    )
  );

  const typeAlias = ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    typeId,
    undefined,
    undefined,
    properties
  );

  const moduleIdentifier = ts.factory.createIdentifier(`"${moduleName}"`);

  const moduleBody = ts.factory.createModuleBlock([importStatement, typeAlias]);

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
    await fs.writeFile(`${out}/routes.d.ts`, printed);
  };
