import type {IRouter} from "./IRouter.ts";
import type {IComponentLoader} from "../ComponentLoader/IComponentLoader.ts";
import type {IAuthService} from "../AuthService/IAuthService.ts";

export class RouterService
{
    public readonly routes: IRouter[] = [];
    private readonly componentLoader: IComponentLoader;
    private readonly authService: IAuthService;

    constructor(componentLoader: IComponentLoader, authService: IAuthService)
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
                return await this.componentLoader.load(route.component);

            else if (route?.guardRoute === true && await this.authService.checkAuthentication())
                return await this.componentLoader.load(route.component);

            return await this.componentLoader.load('/auth/login');
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