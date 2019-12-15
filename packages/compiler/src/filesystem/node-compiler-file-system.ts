import {CompilerFileSystem} from "../public_api";
import * as path from "path";
import {readFileSync} from "fs";

export class NodeCompilerFileSystem implements CompilerFileSystem {
    readFile(filePath: string): string {
        return readFileSync(filePath).toString();
    }

    resolvePath(catalog: string, file: string): string {
        return path.resolve(catalog, file);
    }
}

