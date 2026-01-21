import type {IRouter} from "./app/services/Router/IRouter.ts";
import {RouterService} from "./app/services/Router/RouterService.ts";
import {ComponentLoader} from "./app/services/ComponentLoader/ComponentLoader.ts";
import '@awesome.me/webawesome/dist/styles/webawesome.css';
import {AuthService} from "./app/services/AuthService/AuthService.ts";
import {Countries} from "./app/stores/Countries/Countries.ts";

const element: HTMLElement | null = document.getElementById('app');
const loader = new ComponentLoader(element!);
const authService = new AuthService();
const router = new RouterService(loader, authService);
const countries: Countries = Countries.getInstance();

const routes: IRouter[] = [
    { path: '/', component: '/pages/home.html', name: 'Home', guardRoute: false },
    { path: '/about', component: '/pages/about.html', name: 'About', guardRoute: false },
    { path: '/contact', component: '/pages/howtoplay.html', name: 'How to Play', guardRoute: false },
    { path: '/main-menu', component: '/pages/components/main-menu/main-menu.html', name: 'Play Now', guardRoute: false }, //TODU: should be true
    { path: '/login-signUp', component: '/pages/components/login-signUp/login-signUp.html', name: 'Login or SignUp', guardRoute: false },
    { path: '/sign-up', component: '/pages/components/login-signUp/sign-up.html', name: 'Sign-up', guardRoute: false },
    { path: '/error-404', component: '/pages/error/error404.html', name: 'Error 404', guardRoute: false },
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
customElements.whenDefined('wa-select').then(() => {
    const countrySelect = document.querySelector('wa-select[name="country"]');

    if (countrySelect)
    {
        for (const country of countriesList) {
            const option = document.createElement('wa-option');
            option.textContent = `${country.name}`;
            countrySelect.appendChild(option);
        }
    }
});

router.handleRoute(globalThis.window.location.pathname)

//TODU: when user clicks in crea