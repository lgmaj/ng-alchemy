import {TemplateTranspiler} from "../../src/template/template-transpiler";
import {TemplateExpressionResolver} from "../../src/template/template-expression-resolver";

describe('template-transpiler', () => {
    it('should return the same if not transpile needed', () => {
        expect(transpile('<div></div>')).toEqual('<div></div>');
    });
    it('should transpile *ngIf', () => {
        expect(transpile('<div *ngIf="true"></div>')).toEqual('<div ng-if="true"></div>');
    });

    it('should transpile (click)', () => {
        expect(transpile('<div (click)="onClick()"></div>')).toEqual('<div ng-click="onClick()"></div>');
    });

    it('should transpile [(ngModel)]', () => {
        expect(transpile('<input [(ngModel)]="onClick()">')).toEqual('<input ng-model="onClick()">');
    });

    it('should transpile *ngFor', () => {
        expect(transpile('<div *ngFor="let item of items"></div>')).toEqual('<div ng-repeat="item in items"></div>');
    });

    it('should add $ctrl in interpolation if needed', () => {
        expect(transpile('{{1 + 2 + 3}}')).toEqual('{{1 + 2 + 3}}');
        expect(transpile('{{test}}')).toEqual('{{test}}');
        expect(transpile('{{test1}}{{test2}}{{test3}}')).toEqual('{{test1}}{{test2}}{{test3}}');
        expect(transpile('<div>{{test1}}<div>{{test2}}</div>{{test3}}</div>')).toEqual('<div>{{test1}}<div>{{test2}}</div>{{test3}}</div>');
    });
});


function transpile(template: string): string {
    return new TemplateTranspiler().transpile(template, new MockTemplateExpressionResolver());
}

class MockTemplateExpressionResolver implements TemplateExpressionResolver {
    resolve(expression: string): string {
        return expression;
    }
}
