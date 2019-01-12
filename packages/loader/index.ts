import {compile} from "../compiler/src";
import {crateCompilationUnit, crateCompilerConfig} from "../compiler/src/util";
import {Ng1StaticInjectTransformer} from "../compiler/src/transformer/Ng1StaticInjectTransformer";

export default function loader(source) {
    return compile(
        crateCompilationUnit('NgAlchemyEntry.ts', source),
        crateCompilerConfig(new Ng1StaticInjectTransformer())
    )
}