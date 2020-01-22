import {TSTranspilerClassData} from "../transpiler/model";

export class CtrlTemplateTranspilerHost implements TemplateTranspilerHost {
    constructor(private clazz: TSTranspilerClassData) {
    }

    has(name: string): boolean {
        return this.hasProperty(name) || this.hasMethod(name)
    }

    hasProperty(name: string): boolean {
        return this.clazz.properties.some(property => property.name === name);
    }

    hasMethod(name: string): boolean {
        return this.clazz.methods.some(method => method.name === name);
    }
}
