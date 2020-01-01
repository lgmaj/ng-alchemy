import {ComponentTranspiler} from "./component-transpiler";
import {ValueObject} from "../transpiler/model";
import {TemplateTranspilerContext} from "./template-transpiler-context";
import {addOrUpdateObjectProperty, objectGetPropertyText, objectHasProperty} from "../object";
import {TemplateTranspiler} from "./template-transpiler";
import {ComponentProperties} from "./component-properties";

export class TemplateTranspilerComponentTranspiler implements ComponentTranspiler {
    transpile(config: ValueObject, context: TemplateTranspilerContext): ValueObject {
        if (context.config.template.transpile && objectHasProperty(config, ComponentProperties.TEMPLATE)) {
            return addOrUpdateObjectProperty(
                config,
                ComponentProperties.TEMPLATE,
                new TemplateTranspiler().transpile(objectGetPropertyText(config, ComponentProperties.TEMPLATE))
            )
        }
        return config;
    }
}