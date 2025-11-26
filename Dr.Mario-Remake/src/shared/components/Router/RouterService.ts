import type {IRouter} from "./IRouter.ts";

export class RouterService implements IRouter
{
    private static instance: RouterService;
    private routes: IRouter[] = [];
    private currentPath: string = window.location.pathname;
    private appContainer: HTMLElement | null = null;

    constructor(appContainerId: string = '#app')
    {
        this.appContainer = document.querySelector(appContainerId);
        this.InitializingRouting();
    }

    public RegisterRoutes(Routes: IRouter[]): this
    {
        this.routes = Routes;
        return this;
    }

    private InitializeRouting(): void
    {
        window.addEventListener('popstate', () => {
            this.Navigate(window.location.pathname);
        });

        this.Navigate(this.currentPath);
    }

    public Navigate(path: string): void
    {
        const route = this.FindRoute(path);
    }

    private FindRoute(route: string): IRouter | undefined
    {
        return this.routes.find(r => r.path === route);
    }
}