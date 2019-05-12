import {IModule, module} from 'angular';

export function platformBrowserDynamic(): PlatformRef {
    return new PlatformRef();
}

export class PlatformRef {
    bootstrapModule(moduleType: any): void {
        moduleType.ngModuleDef && installModule(moduleType.ngModuleDef);
    }
}

function installModule(ngModuleDef: any): void {
    installDeclarations(
        installProviders(
            module(ngModuleDef.id, importModules(ngModuleDef.imports || [])), ngModuleDef.providers || []
        ), ngModuleDef.declarations || []
    );
}

function importModules(imports: Array<any>) : Array<string> {
    return imports.map(i => {
        if(i.ngModuleDef) {
            installModule(i.ngModuleDef);
            return i.ngModuleDef.id;
        }
        return i;
    })
}

function installProviders(moduleRef: IModule, providers: Array<any>): IModule {
    providers.filter(p => p.ngInjectableDef).forEach(p => moduleRef.service(p.ngInjectableDef.name, p));
    return moduleRef;
}

function installDeclarations(moduleRef: IModule, providers: Array<any>): IModule {
    providers.filter(d => d.ngComponentDef).forEach(d => moduleRef.component(d.ngComponentDef.selector, d.ngComponentDef));
    return moduleRef;
}