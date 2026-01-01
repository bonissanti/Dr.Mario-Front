import {describe, beforeEach, it, expect, afterEach, vi} from 'vitest';
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
            { path: '/contact', component: '/pages/contact.html', name: 'Contact' },
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

    it('handle route should use cached component if route is already loaded', async () => {
        const loadSpy = vi.spyOn(loader, 'load')

        await router.navigate('/')
        await router.navigate('/')

        expect(loadSpy).toHaveBeenCalledTimes(2)
        expect(loader.loadedComponent).toBe('/index.html')
    })

    it('handle route should delete oldest component to add new one', async () => {
        const loadSpy = vi.spyOn(loader, 'load')

        await router.navigate('/')
        await router.navigate('/contact')
        await router.navigate('/about')

        expect(loadSpy).toHaveBeenCalledTimes(3)
        expect(loader.loadedComponent).toBe('/index.html')
    })
})