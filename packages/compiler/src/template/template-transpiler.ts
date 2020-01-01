export class TemplateTranspiler {
    transpile(template: string): string {
        return TRANSFORMERS.reduce((acc, transformer) => transformer.transform(acc), template);
    }
}

interface ITemplateTransformer {
    transform(value: string): string;
}

class AttributeTransformer implements ITemplateTransformer {
    transform(value: string): string {
        return value.replace(/(\[[a-zA-Z0-9_]*]=\"[a-zA-Z0-9._]*\")/gm, this.replaceAttribute.bind(this));
    }

    private replaceAttribute(attribute: string): string {
        return attribute.replace(/(\[[a-zA-Z0-9_]*])/gm, this.replaceAttributeName.bind(this))
    }

    private replaceAttributeName(name: string): string {
        return camelToKebab(this.removeAndReplaceStartOfAttribute(name))
    }

    private removeAndReplaceStartOfAttribute(value: string): string {
        return value.split('[').join('').split(']').join('');
    }
}

class NgForTransformer implements ITemplateTransformer {
    transform(value: string): string {
        // /(\*ngFor)="let\s*([a-zA-Z0-1]*)\s*of\s*([a-zA-Z0-1]*)"/
        return value.replace(/\*ngFor/gm, 'ng-repeat');
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

interface GenericTransformerItem {
    searchValue: any;
    replaceValue: string;
}

const TRANSFORMERS: Array<ITemplateTransformer> = [
    new AttributeTransformer(),
    new NgForTransformer(),
    new GenericTransformer()
        .add(/\*ngIf/gm, 'ng-if')
        .add(/\(click\)/gm, 'ng-click')
];

function camelToKebab(value: string): string {
    return value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}