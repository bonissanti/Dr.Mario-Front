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

        const html: string = await response.text();
        this.loadedComponent = componentPath;
        this.setNewComponent(componentPath, html);
        this.hostElement.innerHTML = html;
    }

    public async preloadRoute(componentPath: string): Promise<void>
    {
        if (this.checkIfComponentIsCached(componentPath))
        {
            await this.defineShoelaceComponents();
            return;
        }

        const response: Response = await fetch(componentPath);
        const html: string = await response.text();
        this.setNewComponent(componentPath, html);
        await this.defineShoelaceComponents();
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

    private async defineShoelaceComponents(): Promise<void>
    {
        // Get all Shoelace elements that might not be defined yet
        const shoelaceElements = this.hostElement.querySelectorAll(':not(:defined)');

        if (shoelaceElements.length === 0) return;

        // Wait for all custom elements to be defined
        const promises = Array.from(shoelaceElements).map(el => {
            return customElements.whenDefined(el.tagName.toLowerCase());
        });

        await Promise.allSettled(promises);
    }
}