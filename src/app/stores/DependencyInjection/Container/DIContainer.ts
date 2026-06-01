type Scope = 'singleton' | 'scoped' | 'transient';
type AbstractClass<T> = abstract new (...args: any[]) => T;
type Class<T> = new (...args: any[]) => T;
type Token<T> = Class<T> | AbstractClass<T>;

export interface Instance
{
    factory: () => any
    scope: Scope
    instance?: any
}

export interface ContainerDict
{
    [key: string]: Instance
}

export class DIContainer
{
    public containerDict: ContainerDict = {};
    private readonly scopedInstances: Map<string, any> = new Map();

    public convertToString<T>(target: Token<T>)
    {
        return target.name;
    }

    public register<T>(target: Token<T>, instance: Instance)
    {
        const key = this.convertToString(target);

        if (this.containerDict[key])
            throw new Error(`A registration for ${key} already exists`);

        this.containerDict[key] = instance;
    }

    public addSingleton<T>(target: Token<T>, implementation?: Class<T>)
    {
        const impl = implementation ?? target as Class<T>;
        const dependencies = (impl as any).dependencies ?? [];

        this.register(target, {
            factory: () => {
                const resolvedDeps = dependencies.map((dep: Token<any>) => this.resolve(dep));
                return new impl(...resolvedDeps)
            },
            scope: 'singleton',
        })
    }

    public addScoped<T>(target: Token<T>, implementation?: Class<T>)
    {
        const impl = implementation ?? target as Class<T>;
        const dependencies = (impl as any).dependencies ?? [];

        this.register(target, {
            factory: () => {
                const resolvedDeps = dependencies.map((dep: Token<any>) => this.resolve(dep));
                return new impl(...resolvedDeps)
            },
            scope: 'scoped',
        })
    }

    public addTransient<T>(target: Token<T>, implementation?: Class<T>)
    {
        const impl = implementation ?? target as Class<T>;
        const dependencies = (impl as any).dependencies ?? [];

        this.register(target, {
            factory: () => {
                const resolvedDeps = dependencies.map((dep: Token<any>) => this.resolve(dep));
                return new impl(...resolvedDeps)
            },
            scope: 'transient',
        })
    }

    public resolve<T>(target: Token<T>): T
    {
        const key = this.convertToString(target);
        const registration = this.containerDict[key];

        if (!registration) {
            throw new Error(`No registration found for token ${key}`);
        }

        switch (registration.scope)
        {
            case 'singleton':
                if (!registration.instance) {
                    registration.instance = registration.factory();
                }
                return registration.instance as T;

            case 'scoped':
                if (!this.scopedInstances.has(key)) {
                    this.scopedInstances.set(key, registration.factory());
                }
                return this.scopedInstances.get(key) as T;

            case 'transient':
                return registration.factory();

            default:
                throw new Error(`Unknown scope ${registration.scope}`);
        }
    }

    public clear()
    {
        this.scopedInstances.clear();
    }
}