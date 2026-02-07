export class DIContainer
{
    public services: Map<any, any> = new Map();
    public scopedServices: Map<any, any> = new Map();

    public register(serviceName: string, serviceDefinition: any, scope: string, dependencies: any[] = [])
    {
        this.services.set(serviceName, {
            serviceDefinition,
            scope,
            dependencies,
            instance: null
        });
    }

    public resolve(serviceName: any, context?: any)
    {
        const service = this.services.get(serviceName);

        if (service.scope === 'scoped')
        {
            if (!this.scopedServices.has(context))
                this.scopedServices.set(context, new Map());

            const contextServices = this.scopedServices.get(context);

            if (!contextServices.has(serviceName))
            {
                const resolvedDependencies = service.dependencies.map((dependency: any) => this.resolve(dependency, context));
                contextServices.set(serviceName, new service.serviceDefinition(...resolvedDependencies));
            }
            return contextServices.get(serviceName);
        }

        if (service.scope === 'transient')
        {
            const resolvedDependencies = service.dependencies.map((dependency: any) => this.resolve(dependency, context));
            return new service.serviceDefinition(...resolvedDependencies);
        }

        if (service.scope === 'singleton')
        {
            if (service.instance === null)
            {
                const resolvedDependencies = service.dependencies.map((dependency: any) => this.resolve(dependency, context));
                service.instance = new service.serviceDefinition(...resolvedDependencies);
            }
            return service.instance;
        }
    }

    public clearContext(context: any)
    {
        this.scopedServices.delete(context);
    }
}