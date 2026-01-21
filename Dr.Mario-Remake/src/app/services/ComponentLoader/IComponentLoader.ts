export interface IComponentLoader {
    load(componentPath: string): Promise<void>;
    preloadRoute(componentPath: string): Promise<void>;
}