import {TranspilerApi, TSTranspilerClassData, TSTranspilerData, TSTranspilerDataConfig} from "..";

export class TemplateTranspilerContext {
    constructor(readonly clazz: TSTranspilerClassData,
                readonly path: string,
                readonly api: TranspilerApi,
                readonly config: TSTranspilerDataConfig) {
    }

    static create(clazz: TSTranspilerClassData, data: TSTranspilerData): TemplateTranspilerContext {
        return new TemplateTranspilerContext(clazz, data.path, data.api, data.config);
    }
}
