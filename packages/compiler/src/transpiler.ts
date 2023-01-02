import * as ts from 'typescript';
import {CompilerUnit, ConstructorParameter, TranspilerApi} from "./public_api";
import {createProgram, getDecorators} from "./transpiler/util";
import {createTranspilerOptions} from "./transpiler/options";
import {
    ClassMethodData,
    ClassPropertyData,
    ConstructorParameterDecorator,
    DecoratorData,
    PropertyDecoratorData,
    TSTranspilerClassData,
    TSTranspilerData,
    TSTranspilerDataBuilder,
    TSTranspilerDataConfig
} from "./transpiler/model";

export class TSTranspiler {

    private dataBuilder: TSTranspilerDataBuilder = new TSTranspilerDataBuilder();

    transpile(compilerUnit: CompilerUnit, api: TranspilerApi, config ?: TSTranspilerDataConfig): TSTranspilerData {
        createProgram(compilerUnit, createTranspilerOptions())
            .getSourceFiles()
            .filter(source => !source.isDeclarationFile)
            .forEach(source => ts.forEachChild(source, node => this.visitor(node, source)));

        return this.dataBuilder
            .withPath(compilerUnit.path)
            .withInput(compilerUnit.content)
            .withConfig(config || new TSTranspilerDataConfig())
            .withApi(api)
            .build();
    }

    private visitor(node: ts.Node, source: ts.SourceFile): void {
        if (ts.isClassDeclaration(node)) {
            this.dataBuilder.addClass(TSTranspilerClassData.fromTsSource(node));

            node.members.filter(ts.isPropertyDeclaration).forEach(property => {
                this.dataBuilder.addClassProperty(ClassPropertyData.fromTsSource(property, source));

                getDecorators(property).forEach(decorator => {
                    const exp: any = decorator.expression;
                    this.dataBuilder.addPropertyDecoratorData(PropertyDecoratorData.fromTsSource(
                        decorator, exp.arguments, property, source
                    ));
                });
            });

            node.members.filter(ts.isMethodDeclaration).forEach(method => {
                this.dataBuilder.addClassMethod(ClassMethodData.fromTsSource(method, source));
            });

            const ctr: ts.ConstructorDeclaration = node.members.find(ts.isConstructorDeclaration);

            if (ctr) {
                ctr.parameters.forEach(param => {
                    this.dataBuilder.addClassConstructorParameter(ConstructorParameter.fromTsSource(param, source));
                    getDecorators(param).forEach(decorator => {
                        const exp: any = decorator.expression;
                        this.dataBuilder.addClassConstructorParameterDecorator(ConstructorParameterDecorator.fromTsSource(
                            decorator, exp.arguments, param, source
                        ));
                    })
                })
            }

            getDecorators(node).forEach(decorator => {
                this.dataBuilder.addClassDecorator(DecoratorData.fromTsSource(
                    decorator, source
                ));
            })
        }
    }
}
