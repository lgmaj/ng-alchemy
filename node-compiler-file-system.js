"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
var NodeCompilerFileSystem = /** @class */ (function () {
    function NodeCompilerFileSystem() {
    }
    NodeCompilerFileSystem.prototype.readFile = function (filePath) {
        return fs_1.readFileSync(filePath).toString();
    };
    NodeCompilerFileSystem.prototype.resolvePath = function (catalog, file) {
        return path.resolve(catalog, file);
    };
    return NodeCompilerFileSystem;
}());
exports.NodeCompilerFileSystem = NodeCompilerFileSystem;
