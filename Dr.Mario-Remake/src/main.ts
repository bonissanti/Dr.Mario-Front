import type {IRouter} from "./shared/services/Router/IRouter.ts";
import {RouterService} from "./shared/services/Router/RouterService.ts";
import {ComponentLoader} from "./shared/services/ComponentLoader/ComponentLoader.ts";
import '@awesome.me/webawesome/dist/styles/webawesome.css';

const element: HTMLElement | null = document.getElementById('app');
const loader = new ComponentLoader(element!);
const router = new RouterService(loader);

const routes: IRouter[] = [
    { path: '/', component: '/pages/home.html', name: 'Home' },
    { path: '/about', component: '/pages/about.html', name: 'About' },
    { path: '/contact', component: '/pages/howtoplay.html', name: 'How to Play' },
    { path: '/main-menu', component: '/pages/components/main-menu/main-menu.html', name: 'Play Now' },
    { path: '/error-404', component: '/pages/error/error404.html', name: 'Error 404' },
]

globalThis.addEventListener('load', () => {
    router.preloadRoutes(['/', '/about', '/contact', '/main-menu']);
});

routes.forEach(route => router.addRoutes(route));

(globalThis.window as any).appRouter = router;

document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[data-link]');

    if (link)
    {
        const href = link.getAttribute('href');
        if (href)
            router.preloadRoute(href);
    }
})

document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[data-link]');

    if (link)
    {
        event.preventDefault();
        const href = link.getAttribute('href');

        if (href)
            router.navigate(href);
    }
})

router.handleRoute(globalThis.window.location.pathname)