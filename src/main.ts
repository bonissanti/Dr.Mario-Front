import type {IRouter} from "./app/services/Router/IRouter.ts";
import {RouterService} from "./app/services/Router/RouterService.ts";
import {ComponentLoader} from "./app/services/ComponentLoader/ComponentLoader.ts";
import '@awesome.me/webawesome/dist/styles/webawesome.css';
import {AuthService} from "./app/services/AuthService/AuthService.ts";
import {Countries} from "./app/stores/Countries/Countries.ts";
import {DIContainer} from "./app/stores/DependencyInjection/Container/DIContainer.ts";
import {AComponentLoader} from "./app/services/ComponentLoader/AComponentLoader.ts";
import {AAuthService} from "./app/services/AuthService/AAuthService.ts";
import {ProxyData} from "./app/utils/ProxyData/ProxyData.ts";

export const container = new DIContainer();

container.addScoped(AComponentLoader, ComponentLoader)
container.addScoped(AAuthService, AuthService)
container.addScoped(RouterService)
container.addScoped(ProxyData)

const router = container.resolve(RouterService);
const countries: Countries = Countries.getInstance();

const routes: IRouter[] = [
    { path: '/', component: '/pages/home.html', controller: undefined, guardRoute: false },
    { path: '/about', component: '/pages/about.html', controller: undefined, guardRoute: false },
    { path: '/contact', component: '/pages/howtoplay.html', controller: undefined, guardRoute: false },
    { path: '/main-menu', component: '/pages/components/main-menu/main-menu.html', controller: undefined, guardRoute: false }, //TODU: should be true
    { path: '/login-signUp', component: '/pages/components/login-signUp/login-signUp.html', controller: undefined, guardRoute: false },
    { path: '/sign-up', component: '/pages/components/login-signUp/sign-up.html', controller: () => import('./app/components/Sign-Up/SignUp.component.ts'), guardRoute: false },
    { path: '/error-404', component: '/pages/error/error404.html', controller: undefined, guardRoute: false },
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

const countriesList = countries.CountryNames;
Promise.all([
    customElements.whenDefined('wa-input'),
    customElements.whenDefined('wa-button'),
    customElements.whenDefined('wa-checkbox'),
    customElements.whenDefined('wa-select'),
    customElements.whenDefined('wa-option')
]).then(() => {
    const countrySelect = document.querySelector('wa-select[name="country"]');

    if (countrySelect)
    {
        for (const country of countriesList) {
            const option = document.createElement('wa-option');
            option.setAttribute('value', country.code);
            option.innerHTML = `${country.name}`;
            countrySelect.appendChild(option);
        }
    }
});

router.handleRoute(globalThis.window.location.pathname);
