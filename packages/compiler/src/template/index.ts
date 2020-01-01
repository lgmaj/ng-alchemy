import {ValueObject} from "../transpiler/model";
import {TemplateTranspilerContext} from "./template-transpiler-context";
import {ComponentTranspiler} from "./component-transpiler";
import {TemplateLoaderComponentTranspiler} from "./template-loader-component-transpiler";
import {TemplateTranspilerComponentTranspiler} from "./template-transpiler-component-transpiler";
import {TemplateOptimiseComponentTranspiler} from "./template-optimise-component-transpiler";

const TRANSLATION_UNIT: Array<ComponentTranspiler> = [
    new TemplateLoaderComponentTranspiler(),
    new TemplateTranspilerComponentTranspiler(),
    new TemplateOptimiseComponentTranspiler()
];

export function compileTemplate(vo: ValueObject, context: TemplateTranspilerContext): ValueObject {
    return TRANSLATION_UNIT
        .reduce((object: ValueObject, transpiler: ComponentTranspiler) => transpiler.transpile(object, context), vo);
}