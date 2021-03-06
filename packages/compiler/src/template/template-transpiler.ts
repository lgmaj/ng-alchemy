import {TemplateExpressionResolver} from "./template-expression-resolver";

export class TemplateTranspiler {
    transpile(template: string, resolver: TemplateExpressionResolver): string {
        return TRANSFORMERS.reduce((acc, transformer) => transformer.transform(acc, resolver), template);
    }
}

interface ITemplateTransformer {
    transform(value: string, resolver: TemplateExpressionResolver): string;
}

class AttributeTransformer implements ITemplateTransformer {
    transform(value: string, resolver: TemplateExpressionResolver): string {
        return value.replace(/\[([a-zA-Z0-9_]*)]="(.*?)"/gm, (substring, name, value) =>
            `${camelToKebab(name)}="${resolver.resolve(value)}"`
        );
    }
}

class NgEventTransformer implements ITemplateTransformer {
    transform(value: string, resolver: TemplateExpressionResolver): string {
        return value.replace(/\(([a-zA-Z0-9_]*)\)="(.*?)"/gm, (substring, event, handler) =>
            `${toNgEventName(event)}="${resolver.resolve(handler)}"`
        );
    }
}

function toNgEventName(event: string): string {
    return isNgEvent(event) ? `ng-${event}` : camelToKebab(event)
}

function isNgEvent(event: string): boolean {
    return ['change', 'click', 'submit'].indexOf(event) > -1
}

class NgForTransformer implements ITemplateTransformer {
    transform(value: string, resolver: TemplateExpressionResolver): string {
        return value.replace(
            /\*ngFor="\s*let\s*(.*?)\s*of\s*(.*?)\s*"/gm,
            (substring, itr, collection) => `ng-repeat="${itr} in ${resolver.resolve(collection)}"`
        );
    }
}

class NgIfTransformer implements ITemplateTransformer {
    transform(value: string, resolver: TemplateExpressionResolver): string {
        return value.replace(
            /\*ngIf="(.*?)"/gm,
            (substring, condition) => `ng-if="${resolver.resolve(condition)}"`
        );
    }
}

class NgModelTransformer implements ITemplateTransformer {
    transform(value: string, resolver: TemplateExpressionResolver): string {
        return value.replace(
            /\[\(ngModel\)]="(.*?)"/gm,
            (substring, expression) => `ng-model="${resolver.resolve(expression)}"`
        );
    }
}

class GenericTransformer implements ITemplateTransformer {
    constructor(private matcher: Array<GenericTransformerItem> = []) {
    }

    add(searchValue: any, replaceValue: string): GenericTransformer {
        this.matcher.push({searchValue, replaceValue});
        return this;
    }

    transform(value: string): string {
        return this.matcher.reduce((str, m) => str.replace(m.searchValue, m.replaceValue), value);
    }
}

class ExpressionTransformer implements ITemplateTransformer {
    transform(value: string, resolver: TemplateExpressionResolver): string {
        const interpolationsRegExp: RegExp = /{{(.*?)}}/gm;
        return value.replace(interpolationsRegExp, (interpolation, content) => {
            return `{{${resolver.resolve(content)}}}`;
        });
    }
}

interface GenericTransformerItem {
    searchValue: any;
    replaceValue: string;
}

const TRANSFORMERS: Array<ITemplateTransformer> = [
    new AttributeTransformer(),
    new NgForTransformer(),
    new ExpressionTransformer(),
    new NgIfTransformer(),
    new NgEventTransformer(),
    new NgModelTransformer()
];

function camelToKebab(value: string): string {
    return value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
