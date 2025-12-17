export interface IComponentLoader {
    load(componentPath: string): Promise<void>;
}