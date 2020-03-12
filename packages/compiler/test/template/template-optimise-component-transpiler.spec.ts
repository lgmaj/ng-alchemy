import {removeHtmlWhitespaces} from "../../src/template/template-optimise-component-transpiler";

describe('template-optimise-component-transpiler', () => {
    it('should remove unnecessary white spaces', () => {
        const input: string = `
<example-foo-component [bindingFoo]="foo"
                       [bindigBar]="bar"
                       example-directive-foo
                       [exampleDirectiveBar]
                       [(ngModel)]="model">
    <component-a *ngIf="a"></component-a>                       
    <component-b *ngIf="b"></component-b>                       
</example-foo-component>
        `;

        const output : string = `<example-foo-component [bindingFoo]="foo" [bindigBar]="bar" example-directive-foo [exampleDirectiveBar] [(ngModel)]="model"><component-a *ngIf="a"></component-a><component-b *ngIf="b"></component-b></example-foo-component>`;

        expect(removeHtmlWhitespaces(input)).toEqual(output);
    })
});
