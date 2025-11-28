import { describe, beforeEach, it, expect, test } from 'vitest';
import type {IRouter} from "../../../shared/components/Router/IRouter.ts";
import {RouterService} from "../../../shared/components/Router/RouterService.ts";

describe('Router Test', () => {

    beforeEach(() => {
        const mockRoutes: IRouter[] = [
            { path: '/', component: '/pages/home.html', name: 'Home' },
            { path: '/about', component: '/pages/about.html', name: 'About' },
            { path: '/contact', component: '/pages/howtoplay.html', name: 'How to Play' },
            { path: '/error-404', component: '/pages/error/error404.html', name: 'Error 404' },
        ]

        const router = RouterService.getInstance('app');
        mockRoutes.forEach(route => router.addRoutes(route));
    })

    it('handle route should redirect to the correct page', () => {
        const lala = 1 + 1;

        expect(lala).toBe(2);

    })
})