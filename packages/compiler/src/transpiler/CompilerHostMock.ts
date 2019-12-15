import {FileSystemMock} from "./FileSystemMock";

export class CompilerHostMock {

    constructor(private fileSystem: FileSystemMock) {
    }

    getSourceFile(fileName: string) {
        return this.fileSystem.find(fileName);
    }

    writeFile(name: string, text: string): void {
    }

    getDefaultLibFileName() {
        return "lib.d.ts";
    }

    useCaseSensitiveFileNames(): boolean {
        return false;
    }

    getCanonicalFileName(fileName: string): string {
        return fileName;
    }

    getCurrentDirectory() {
        return "";
    }

    getNewLine() {
        return '\n';
    }

    fileExists(fileName: string): boolean {
        return !!this.getSourceFile(fileName);
    }

    readFile(): string {
        return "";
    }

    directoryExists(): boolean {
        return true;
    }

    getDirectories(): Array<any> {
        return [];
    }
}
