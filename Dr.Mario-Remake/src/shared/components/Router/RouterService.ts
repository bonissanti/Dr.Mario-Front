import type {IRouter} from "./IRouter.ts";

export class RouterService
{
    public readonly routes: IRouter[] = [];
    private static instance: RouterService;
    private readonly componentElement: HTMLElement;

    constructor(componentId: string)
    {
        this.componentElement = document.getElementById(componentId) as HTMLElement;
        globalThis.addEventListener('popstate', () => this.handleRoute());
    }

    public static getInstance(componentId: string): RouterService
    {
        if (!RouterService.instance)
            RouterService.instance = new RouterService(componentId);
        return RouterService.instance;
    }

    public addRoutes(newRoute: IRouter): void
    {
        this.routes.push(newRoute);
    }

    public async handleRoute(): Promise<void>
    {
        const path: string = globalThis.window.location.pathname;
        const route: IRouter | undefined = this.routes.find(route => route.path === path);

        if (!route)
        {
            await this.handleError('Error 404');
            return;
        }
        const response = await fetch(route.component);

        if (!response.ok)
        {
            console.error('Failed to load page: ' + response.statusText);
            return;
        }
        this.componentElement.innerHTML = await response.text();
    }

    public async handleError(errorPage: string): Promise<void>
    {
        const route: IRouter | undefined = this.routes.find(route => route.path === errorPage);

        if (!route)
            return;
        const response = await fetch(route.component);
        if (!response.ok)
        {
            console.error('Failed to load error page: ' + response.statusText);
            return;
        }
        this.componentElement.innerHTML = await response.text();
    }

    public async navigate(path: string): Promise<void>
    {
        globalThis.history.pushState({}, '', path);
        await this.handleRoute();
    }


}