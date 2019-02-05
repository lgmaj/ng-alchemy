import * as ts from 'typescript';
import {CompilerUnit} from "./public_api";
import {createProgram, createTranspilerOptions} from "./transpiler/util";
import {
    ConstructorParameterDecorator,
    DecoratorData, PropertyDecoratorData,
    TSTranspilerData,
    TSTranspilerDataBuilder
} from "./transpiler/model";

export class TSTranspiler {

    private dataBuilder: TSTranspilerDataBuilder = new TSTranspilerDataBuilder();

    transpile(compilerUnit: CompilerUnit): TSTranspilerData {
        createProgram(compilerUnit, createTranspilerOptions())
            .getSourceFiles()
            .filter(source => !source.isDeclarationFile)
            .forEach(source => ts.forEachChild(source, node => this.visitor(node, source)));

        return this.dataBuilder.withInput(compilerUnit.content).build();
    }

    private visitor(node: ts.Node, source: ts.SourceFile): void {
        if (ts.isClassDeclaration(node)) {
            this.dataBuilder.addClass(node.name.text, node.pos, node.end);

            node.members.filter(ts.isPropertyDeclaration).filter(n => !!n.decorators).forEach(property => {
                property.decorators.forEach(decorator => {
                    const exp: any = decorator.expression;
                    this.dataBuilder.addPropertyDecoratorData(PropertyDecoratorData.fromTsSource(
                        decorator, exp.arguments, property, source
                    ));
                })
            });

            const ctr: ts.ConstructorDeclaration = node.members.find(ts.isConstructorDeclaration);

            if (ctr) {
                ctr.parameters.filter(p => !!p.decorators).forEach(param => {
                    param.decorators.forEach(decorator => {
                        const exp: any = decorator.expression;
                        this.dataBuilder.addClassConstructorParameterDecorator(ConstructorParameterDecorator.fromTsSource(
                            decorator, exp.arguments, param, source
                        ));
                    })
                })
            }

            if (node.decorators) {
                node.decorators.forEach(decorator => {
                    const exp: any = decorator.expression;
                    this.dataBuilder.addClassDecorator(DecoratorData.fromTsSource(
                        decorator, exp.arguments, source
                    ));
                })
            }
        }
    }
}