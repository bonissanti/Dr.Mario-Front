import type {IRouter} from "./shared/services/Router/IRouter.ts";
import {RouterService} from "./shared/services/Router/RouterService.ts";

const routes: IRouter[] = [
    { path: '/', component: '/pages/home.html', name: 'Home' },
    { path: '/about', component: '/pages/about.html', name: 'About' },
    { path: '/contact', component: '/pages/howtoplay.html', name: 'How to Play' },
    { path: '/error-404', component: '/pages/error/error404.html', name: 'Error 404' },
]

const router = RouterService.getInstance('app');
routes.forEach(route => router.addRoutes(route));

await router.handleRoute();
(globalThis as any).router = router;