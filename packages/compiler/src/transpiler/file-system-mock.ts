import * as ts from "typescript";

export class FileSystemMock {
    private files: Array<ts.SourceFile> = [];

    add(fileName: string, sourceText: string, languageVersion: ts.ScriptTarget): void {
        this.files.push(ts.createSourceFile(fileName, sourceText, languageVersion));
    }

    find(fileName: string) {
        return this.files.find(source => source.fileName === fileName);
    }
}