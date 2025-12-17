import type {IComponentLoader} from "../services/ComponentLoader/IComponentLoader.ts";

export class MockComponentLoader implements IComponentLoader
{
    public loadedComponent: string | null = null;

    public async load(componentPath: string): Promise<void>
    {
        this.loadedComponent = componentPath;
    }
}