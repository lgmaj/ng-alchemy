import * as ts from 'typescript';

export class TSTranspiler {

    private dataBuilder: TSTranspilerDataBuilder = new TSTranspilerDataBuilder();

    transpile(input: string): TSTranspilerData {
        createProgram(input, createTranspilerOptions())
            .getSourceFiles()
            .filter(source => !source.isDeclarationFile)
            .forEach(source => ts.forEachChild(source, node => this.visitor(node, source)));

        return this.dataBuilder.withInput(input).build();
    }

    private visitor(node: ts.Node, source: ts.SourceFile): void {
        if (ts.isClassDeclaration(node)) {
            this.dataBuilder.addClass(node.name.text, node.pos, node.end);

            const ctr: ts.ConstructorDeclaration = node.members.find(ts.isConstructorDeclaration);

            if (ctr) {
                ctr.parameters.forEach(param => {
                    if (param.decorators) {
                        param.decorators.forEach(decorator => {
                            const exp: any = decorator.expression;
                            this.dataBuilder.addClassConstructorParameterDecorator(ConstructorParameterDecorator.fromTsSource(
                                decorator, exp.arguments, param, source
                            ));
                        })
                    }
                })
            }

            if (node.decorators) {
                node.decorators.forEach(decorator => {
                    const exp: any = decorator.expression;
                    this.dataBuilder.addClassDecorator(exp.expression.text);
                })
            }
        }
    }

}

function createProgram(input: string, options: ts.CompilerOptions): ts.Program {
    const inputFileName = 'module.ts';
    const fileSystem = new FileSystemMock();

    fileSystem.add(inputFileName, input, options.target);

    return ts.createProgram([inputFileName], options, new CompilerHostMock(fileSystem))
}

function createTranspilerOptions(): ts.CompilerOptions {
    return {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        isolatedModules: true,
        // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
        suppressOutputPathCheck: true,
        // Filename can be non-ts file.
        allowNonTsExtensions: true,
        // We are not returning a sourceFile for lib file when asked by the program,
        // so pass --noLib to avoid reporting a file not found error.
        noLib: true,
        // Clear out other settings that would not be used in transpiling this module
        lib: undefined,
        types: undefined,
        noEmit: undefined,
        noEmitOnError: undefined,
        paths: undefined,
        rootDirs: undefined,
        declaration: undefined,
        composite: undefined,
        declarationDir: undefined,
        out: undefined,
        outFile: undefined,
        // We are not doing a full typecheck, we are not resolving the whole context,
        // so pass --noResolve to avoid reporting missing file errors.
        noResolve: true
    };
}

function getIdentifier(node: ts.Node): string {
    return ts.isIdentifier(node) ? node.escapedText as string : null;
}

export class ConstructorParameter {
    constructor(readonly name: string,
                readonly type: string) {
    }

    static fromTsSource(param: ts.ParameterDeclaration,
                        source: ts.SourceFile) {
        return new ConstructorParameter(
            getIdentifier(param.name),
            param.type ? param.type.getText(source) : null
        );
    }
}

export class DecoratorArguments {
    constructor(readonly kind: ts.SyntaxKind,
                readonly text: string) {
    }

    static fromTsSource(arg: any, source: ts.SourceFile): DecoratorArguments {
        return new DecoratorArguments(
            arg.kind,
            arg.getText(source)
        );
    }
}

export class ConstructorParameterDecorator {
    constructor(readonly name: string,
                readonly args: Array<DecoratorArguments>,
                readonly text: string,
                readonly start: number,
                readonly end: number,
                readonly parameter: ConstructorParameter) {
    }

    static fromTsSource(decorator: ts.Decorator,
                        args: Array<any>,
                        param: ts.ParameterDeclaration,
                        source: ts.SourceFile): ConstructorParameterDecorator {
        const exp: any = decorator.expression;
        return new ConstructorParameterDecorator(
            exp.expression.text,
            args.map(arg => DecoratorArguments.fromTsSource(arg, source)),
            decorator.getText(source),
            decorator.getStart(source),
            decorator.getEnd(),
            ConstructorParameter.fromTsSource(param, source)
        );
    }
}

class TSTranspilerClassData {
    readonly decorator: Array<string> = [];
    readonly constructorParameterDecorator: Array<ConstructorParameterDecorator> = [];

    constructor(readonly name: string,
                readonly start: number,
                readonly end: number) {
    }
}

export interface TSTranspilerData {
    input: string;
    classList: Array<TSTranspilerClassData>;
}

export class TSTranspilerDataBuilder {

    private data: TSTranspilerData = {input: '', classList: []};
    private current: TSTranspilerClassData = null;

    withInput(value: string): TSTranspilerDataBuilder {
        this.data.input = value;
        return this;
    }

    addClass(name: string, start: number, end: number): TSTranspilerDataBuilder {
        this.data.classList.push(new TSTranspilerClassData(name, start, end));
        this.current = this.data.classList[this.data.classList.length - 1];
        return this;
    }

    addClassDecorator(name: string): TSTranspilerDataBuilder {
        this.current.decorator.push(name);
        return this;
    }

    addClassConstructorParameterDecorator(decorator: ConstructorParameterDecorator): TSTranspilerDataBuilder {
        this.current.constructorParameterDecorator.push(decorator);
        return this;
    }

    build(): TSTranspilerData {
        return this.data;
    }
}

class FileSystemMock {
    private files: Array<ts.SourceFile> = [];

    add(fileName: string, sourceText: string, languageVersion: ts.ScriptTarget): void {
        this.files.push(ts.createSourceFile(fileName, sourceText, languageVersion));
    }

    find(fileName: string) {
        return this.files.find(source => source.fileName === fileName);
    }
}

class CompilerHostMock {

    constructor(private fileSystem: FileSystemMock) {
    }

    getSourceFile(fileName) {
        return this.fileSystem.find(fileName);
    }

    writeFile(name, text) {
        console.log('[ng-alchemy][compilerHost][writeFile][name]', name);
        console.log('[ng-alchemy][compilerHost][writeFile][text]', text);
    }

    getDefaultLibFileName() {
        return "lib.d.ts";
    }

    useCaseSensitiveFileNames() {
        return false;
    }

    getCanonicalFileName(fileName) {
        return fileName;
    }

    getCurrentDirectory() {
        return "";
    }

    getNewLine() {
        return '\n';
    }

    fileExists(fileName) {
        console.log('[ng-alchemy][compilerHost][fileExists]', fileName);
        return !!this.getSourceFile(fileName);
    }

    readFile() {
        return "";
    }

    directoryExists() {
        return true;
    }

    getDirectories() {
        return [];
    }
}
