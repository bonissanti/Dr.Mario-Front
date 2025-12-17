import {describe, beforeEach, it, expect, afterEach} from 'vitest';
import type {IRouter} from "../../../shared/services/Router/IRouter.ts";
import {RouterService} from "../../../shared/services/Router/RouterService.ts";
import {MockComponentLoader} from "../../../shared/fixtures/MockComponentLoader.ts";

describe('Router Test', () => {
    let mockRoutes: IRouter[] = []
    let router: RouterService;
    let loader: MockComponentLoader

    beforeEach(() => {
        mockRoutes = [
            { path: '/', component: '/index.html', name: 'Home' },
            { path: '/about', component: '/pages/about.html', name: 'About' },
            { path: '/contact', component: '/pages/howtoplay.html', name: 'How to Play' },
            { path: '/error-404', component: '/pages/error/error404.html', name: 'Error 404' },
        ]

        loader = new MockComponentLoader();
        router = new RouterService(loader);
        mockRoutes.forEach(route => router.addRoutes(route));
    })

    afterEach(() => {
        loader.loadedComponent = null
    })

    it('handle route should redirect to the correct page', async () => {
        await router.navigate('/')

        expect(loader.loadedComponent).toBe('/index.html')
    })

    it('handle route should redirect to 404 page if route is not found', async () => {
        await router.navigate('/not-found')

        expect(loader.loadedComponent).toBe('/error-404')
    })
})