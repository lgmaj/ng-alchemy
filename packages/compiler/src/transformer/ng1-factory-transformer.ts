import {
    CompilerUnitTransformer,
    PropertyDecoratorData,
    SourceTransformation,
    TSTranspilerClassData
} from "../public_api";
import {TSTranspilerData} from "../transpiler/model";
import {add, remove} from "../transformation";

const FACTORY_DECORATOR: string = 'Factory';
const INJECT_PROPERTY_DECORATOR: string = 'InjectProperty';

export class Ng1FactoryTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator.filter(d => d.name === FACTORY_DECORATOR && d.args.length === 0).forEach(d => {
                    console.log('provide >>', addProvider(c));
                    result.push(addProvider(c))
                    result.push(remove(d))

                    c.propertyDecorator
                        .filter(d => d.name === INJECT_PROPERTY_DECORATOR)
                        .forEach(d => result.push(remove(d)));
                }
            )
        );
        return result;
    }
}

function addProvider(c: TSTranspilerClassData): SourceTransformation {
    const properties: Array<PropertyDecoratorData> = getInjectProperty(c);
    return add(
        createProperty(
            'static readonly',
            'ngAlchemyFactoryDef',
            'any',
            new ObjectBuilder()
                .add('provide', `'${c.name}'`)
                .add('useFactory', createFactory(c, properties))
                .add('deps', createDepList(properties))
                .build()
        ),
        c.end - 1
    );
}

function getInjectProperty(c: TSTranspilerClassData): Array<PropertyDecoratorData> {
    return c.propertyDecorator
        .filter(d => d.name === INJECT_PROPERTY_DECORATOR);
}

function createFactory(c: TSTranspilerClassData, properties: Array<PropertyDecoratorData>): string {
    return `(${createInjectDepList(properties)}): Function => (${c.constructorParameter.map(param => `${param.name}: ${param.type}`).join(', ')}): ${c.name} => { const i: ${c.name} = new ${c.name}(${c.constructorParameter.map(param => param.name).join(', ')}); ${properties.map(d => `i.${d.propert.name} = ${d.propert.name};`).join(' ')} return i; }`;
}

function createDepList(properties: Array<PropertyDecoratorData>): string {
    return `[${properties.map(d => `'${d.propert.type}'`).join(', ')}]`;
}

function createInjectDepList(properties: Array<PropertyDecoratorData>): string {
    return properties.map(d => `${d.propert.name}: ${d.propert.type}`).join(', ');
}

function createProperty(
    visibility: string,
    name: string,
    type: string,
    value: string
): string {
    return `${visibility} ${name}: ${type} = ${value};`;
}

class ObjectBuilder {
    private properties: Array<ObjectProperty> = [];

    add(name: string, value: string): ObjectBuilder {
        this.properties.push({name, value})
        return this;
    }

    build(): string {
        return `{${this.properties.map(p => `${p.name}: ${p.value}`).join(', ')}}`
    }
}

interface ObjectProperty {
    readonly name: string;
    readonly value: string;
}