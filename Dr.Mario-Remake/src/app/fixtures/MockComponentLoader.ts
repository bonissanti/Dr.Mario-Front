import type {AComponentLoader} from "../services/ComponentLoader/AComponentLoader.ts";

export class MockComponentLoader implements AComponentLoader
{
    public loadedComponent: string | null = null;
    private readonly cachedComponents: Map<string, { html: string, cachedAt: number }> = new Map();
    private readonly cacheDuration: number = 1000 * 60 * 5; // 5 minutes

    public async load(componentPath: string): Promise<void>
    {
        if (this.checkIfIsValidComponent(componentPath))
            return

        this.loadedComponent = componentPath;
        this.setNewComponent(componentPath, "Some text");
    }

    private checkIfIsValidComponent(componentPath: string): boolean
    {
        const component = this.cachedComponents.get(componentPath);

        if (component)
        {
            const isExpired = Date.now() - component.cachedAt > this.cacheDuration;

            if (!isExpired)
            {
                this.loadedComponent = componentPath;
                return true;
            }
            this.cachedComponents.delete(componentPath);
        }
        return false;
    }

    private setNewComponent(componentPath: string, response: string): void
    {
        if (this.cachedComponents.size === 2)
        {
            const oldest = this.cachedComponents.keys().next().value;
            if (oldest !== undefined)
                this.cachedComponents.delete(oldest);
        }

        this.cachedComponents.set(componentPath, { html: response, cachedAt: Date.now() });
    }

    public clearComponent(componentPath: string): void
    {
        this.cachedComponents.delete(componentPath);
    }

    public clearAllComponents(): void
    {
        this.cachedComponents.clear();
    }

    public preloadRoute(componentPath: string): Promise<void> {
        console.log(componentPath);
        throw new Error("Method not implemented.");
    }

    public preloadRoutes(componentPath: string[]): Promise<void> {
        console.log(componentPath);
        throw new Error("Method not implemented.");
    }
}