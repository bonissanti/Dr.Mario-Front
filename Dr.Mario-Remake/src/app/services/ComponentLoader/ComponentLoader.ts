import {AComponentLoader} from "./AComponentLoader.ts";

export class ComponentLoader extends AComponentLoader
{
    private readonly hostElement: HTMLElement;
    public loadedComponent: string | null = null;
    private readonly cachedComponents: Map<string, { html: string, cachedAt: number }> = new Map();
    private readonly cacheDuration: number = 1000 * 60 * 5; // 5 minutes

    constructor() {
        super();
        this.hostElement = document.getElementById('app')!;
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

        const html: string = await response.text();
        this.loadedComponent = componentPath;
        this.setNewComponent(componentPath, html);
        this.hostElement.style.opacity = '0';
        this.hostElement.style.transition = 'opacity 0.3s ease-in-out';
        this.hostElement.innerHTML = html;

        requestAnimationFrame(() => this.hostElement.style.opacity = '1');
    }

    public async preloadRoute(componentPath: string): Promise<void>
    {
        if (this.checkIfComponentIsCached(componentPath))
            return;

        const response: Response = await fetch(componentPath);
        const html: string = await response.text();
        this.setNewComponent(componentPath, html);
    }

    private checkIfIsValidReusableComponent(componentPath: string): boolean
    {
        const component = this.cachedComponents.get(componentPath);

        if (!component)
            return false;

        const isExpired = Date.now() - component.cachedAt > this.cacheDuration;

        if (isExpired)
        {
            this.cachedComponents.delete(componentPath);
            return false;
        }
        this.loadedComponent = componentPath;
        this.hostElement.innerHTML = component.html;
        return true;
    }

    private checkIfComponentIsCached(componentPath: string): boolean
    {
        return this.cachedComponents.has(componentPath);
    }

    private setNewComponent(componentPath: string, response: string): void
    {
        if (this.cachedComponents.size === 10)
        {
            const oldest = this.cachedComponents.keys().next().value;
            if (oldest !== undefined)
                this.cachedComponents.delete(oldest);
        }

        this.cachedComponents.set(componentPath, { html: response, cachedAt: Date.now() });
    }
}