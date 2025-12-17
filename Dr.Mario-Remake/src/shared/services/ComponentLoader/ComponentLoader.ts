import type {IComponentLoader} from "./IComponentLoader.ts";

export class ComponentLoader implements IComponentLoader
{
    private readonly hostElement: HTMLElement;
    public loadedComponent: string | null = null;

    constructor(htmlElement: HTMLElement) {
        this.hostElement = htmlElement;
    }

    public async load(componentPath: string): Promise<void>
    {
        const response = await fetch(componentPath);

        if (!response.ok)
        {
            await this.load('/error-500');
            return;
        }

        this.loadedComponent = componentPath;
        this.hostElement.innerHTML = await response.text();
    }
}