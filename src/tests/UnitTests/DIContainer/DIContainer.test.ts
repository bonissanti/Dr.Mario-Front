import {describe, beforeEach, expect, it} from 'vitest';
import {DIContainer} from "../../../app/stores/DependencyInjection/Container/DIContainer.ts";
import {AuthService} from "../../../app/services/AuthService/AuthService.ts";
import {RouterService} from "../../../app/services/Router/RouterService.ts";
import {ComponentLoader} from "../../../app/services/ComponentLoader/ComponentLoader.ts";
import {AAuthService} from "../../../app/services/AuthService/AAuthService.ts";
import {AComponentLoader} from "../../../app/services/ComponentLoader/AComponentLoader.ts";
import type {IRouter} from "../../../app/services/Router/IRouter.ts";

describe('DIContainer test', () => {
    let container: DIContainer;

    beforeEach(() => {
        container = new DIContainer();

        container.addSingleton(AAuthService, AuthService);
        container.addScoped(AComponentLoader, ComponentLoader)
        container.addTransient(RouterService)
    })

    it('should resolve AuthService as singleton', () => {
        const a = container.resolve(AAuthService);
        const b = container.resolve(AAuthService);
        expect(a).toBe(b);
    })

    it('should resolve RouterService as transient', () => {
        const a = container.resolve(RouterService);

        const routes: IRouter[] = [
            { path: '/', component: '/pages/home.html', controller: undefined, guardRoute: false },
        ];

        routes.forEach(r => a.addRoutes(r));
        const b = container.resolve(RouterService);
        expect(a).not.toBe(b);
    });

    it('should resolve ComponentLoader as scoped', () => {
        const a = container.resolve(AComponentLoader);
        const b = container.resolve(AComponentLoader);
        expect(a).toBe(b);
        container.clear();
        const c = container.resolve(AComponentLoader);
        expect(a).not.toBe(c);
    });
})