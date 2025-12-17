import type {IRouter} from "./IRouter.ts";
import type {IComponentLoader} from "../ComponentLoader/IComponentLoader.ts";

export class RouterService
{
    public readonly routes: IRouter[] = [];
    private static readonly instance: RouterService;
    private readonly componentLoader: IComponentLoader;

    constructor(componentLoader: IComponentLoader)
    {
        this.componentLoader = componentLoader;
        globalThis.addEventListener('popstate', () => this.handleRoute(globalThis.location.pathname));
    }

    // public static getInstance(componentLoader: IComponentLoader): RouterService
    // {
    //     if (!RouterService.instance)
    //         RouterService.instance = new RouterService(componentLoader);
    //     return RouterService.instance;
    // }

    public addRoutes(newRoute: IRouter): void
    {
        this.routes.push(newRoute);
    }

    public async handleRoute(path: string): Promise<void>
    {
        const route: IRouter | undefined = this.routes.find(route => route.path === path);

        if (!route)
        {
            await this.componentLoader.load('/error-404');
            return;
        }
        await this.componentLoader.load(route.component);
    }

    public async navigate(path: string): Promise<void>
    {
        globalThis.history.pushState({}, '', path);
        await this.handleRoute(path);
    }
}