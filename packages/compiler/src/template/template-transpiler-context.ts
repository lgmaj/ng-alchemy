import {TSTranspilerClassData, TSTranspilerData, TSTranspilerDataConfig} from "../transpiler/model";

export class TemplateTranspilerContext {
    constructor(readonly clazz: TSTranspilerClassData,
                readonly path: string,
                readonly config: TSTranspilerDataConfig) {
    }

    static create(clazz: TSTranspilerClassData, data: TSTranspilerData): TemplateTranspilerContext {
        return new TemplateTranspilerContext(clazz, data.path, data.config);
    }
}
