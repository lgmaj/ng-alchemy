interface TemplateTranspilerHost {
    has(name: string): boolean;
    hasMethod(name: string): boolean;
    hasProperty(name: string): boolean;
}
