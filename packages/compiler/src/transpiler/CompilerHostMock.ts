import {FileSystemMock} from "./FileSystemMock";

export class CompilerHostMock {

    constructor(private fileSystem: FileSystemMock) {
    }

    getSourceFile(fileName) {
        return this.fileSystem.find(fileName);
    }

    writeFile(name, text) {
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
