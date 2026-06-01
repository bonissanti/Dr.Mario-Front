export abstract class AComponentLoader {
    abstract load(componentPath: string): Promise<void>;
    abstract  preloadRoute(componentPath: string): Promise<void>;
}