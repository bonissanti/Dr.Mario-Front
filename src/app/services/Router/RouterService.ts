import type {IRouter} from "./IRouter.ts";
import {AComponentLoader} from "../ComponentLoader/AComponentLoader.ts";
import {AAuthService} from "../AuthService/AAuthService.ts";

export class RouterService
{
    public readonly routes: IRouter[] = [];
    private readonly componentLoader: AComponentLoader;
    private readonly authService: AAuthService;
    static dependencies = [AComponentLoader, AAuthService];

    constructor(componentLoader: AComponentLoader, authService: AAuthService)
    {
        this.componentLoader = componentLoader;
        this.authService = authService;
        globalThis.addEventListener('popstate', () => this.handleRoute(globalThis.location.pathname));
    }

    public addRoutes(newRoute: IRouter): void
    {
        this.routes.push(newRoute);
    }

    public async handleRoute(path: string): Promise<void>
    {
        try
        {
            const route: IRouter | undefined = this.routes.find(route => route.path === path);

            if (!route)
               return await this.componentLoader.load('/error-404');

            else if (route?.guardRoute === false)
                await this.componentLoader.load(route.component);

            else if (route?.guardRoute === true && await this.authService.checkAuthentication())
                await this.componentLoader.load(route.component);

            else
                await this.componentLoader.load('/auth/login');

            if (route.controller)
            {
                const ControllerClass = await route.controller();
                const controller = new ControllerClass.default();
                controller.init();
            }
        }
        catch (error)
        {
            console.error(error);
            await this.componentLoader.load('/error-500');
        }
    }

    public async preloadRoute(path: string): Promise<void>
    {
        const route: IRouter | undefined = this.routes.find(route => route.path === path);

        if (route)
            await this.componentLoader.preloadRoute(route.component);
    }

    public async preloadRoutes(paths: string[]): Promise<void>
    {
        await Promise.all(paths.map(path => this.preloadRoute(path)));
    }

    public async navigate(path: string): Promise<void>
    {
        globalThis.history.pushState({}, '', path);
        await this.handleRoute(path);
    }
}