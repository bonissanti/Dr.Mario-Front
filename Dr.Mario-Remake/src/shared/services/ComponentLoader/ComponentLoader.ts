import type {IComponentLoader} from "./IComponentLoader.ts";

export class ComponentLoader implements IComponentLoader
{
    private readonly hostElement: HTMLElement;
    public loadedComponent: string | null = null;
    private readonly cachedComponents: Map<string, { html: string, cachedAt: number }> = new Map();
    private readonly cacheDuration: number = 1000 * 60 * 5; // 5 minutes

    constructor(htmlElement: HTMLElement) {
        this.hostElement = htmlElement;
    }

    public async load(componentPath: string): Promise<void>
    {
        if (this.checkIfIsValidReusableComponent(componentPath))
            return;

        const response = await fetch(componentPath);

        if (!response.ok)
        {
            await this.load('/error-500');
            return;
        }

        this.loadedComponent = componentPath;
        await this.setNewComponent(componentPath, response);
        this.hostElement.innerHTML = await response.text();
    }

    public async preload(componentPath: string): Promise<void>
    {
        if (this.checkIfIsValidReusableComponent(componentPath))
            return;

        const response = await fetch(componentPath);
        await this.setNewComponent(componentPath, response);
    }

    private checkIfIsValidReusableComponent(componentPath: string): boolean
    {
        const component = this.cachedComponents.get(componentPath);

        if (component)
        {
            const isExpired = Date.now() - component.cachedAt > this.cacheDuration;

            if (isExpired)
            {
                this.cachedComponents.delete(componentPath);
                return false;
            }
            this.loadedComponent = componentPath;
            this.hostElement.innerHTML = component.html;
        }
        return true;
    }

    private async setNewComponent(componentPath: string, response: Response): Promise<void>
    {
        if (this.cachedComponents.size === 10)
        {
            const oldest = this.cachedComponents.keys().next().value;
            if (oldest !== undefined)
                this.cachedComponents.delete(oldest);
        }

        this.cachedComponents.set(componentPath, { html: await response.text(), cachedAt: Date.now() });
    }
}