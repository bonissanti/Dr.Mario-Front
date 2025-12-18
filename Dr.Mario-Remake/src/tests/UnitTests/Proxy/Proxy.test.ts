import { ProxyData } from '../../../shared/components/ProxyData/ProxyData.ts';
import {describe, beforeEach, it, expect} from 'vitest';

describe('Proxy unit tests', () => {
    let proxyData: ProxyData;

    beforeEach(() => {
        proxyData = new ProxyData();
    });

    it('should create a proxy that tracks property changes', () =>
    {
        //Arrange
        const user = {
            firstName: 'Bruno',
            lastName: 'Rodrigues',
            username: 'bbro',
            password: 'password',
            email: 'email@gmail.com'
        }
        const changes: Array<{property: string, value: any}> = [];

        //Act
        const proxy = proxyData.createProxy(user, (property, value) => {
            changes.push({ property, value });
        });

        proxy.firstName = 'John';
        proxy.lastName = 'Doe';
        proxy.username = 'johndoe';
        proxy.password = 'senha';
        proxy.email = 'lalala@gmail.com';

        //Assert
        expect(changes.length).toBe(5);
        validateProperties('firstName', 'John', changes);
        validateProperties('lastName', 'Doe', changes);
        validateProperties('username', 'johndoe', changes);
        validateProperties('password', 'senha', changes);
        validateProperties('email', 'lalala@gmail.com', changes);
    })

    it('should not call onChanges when callback is not provided', () =>
    {
        //Arrange
        const user = {
            firstName: 'Bruno',
            lastName: 'Rodrigues',
            username: 'bbro',
            password: 'password',
            email: 'email@gmail.com'
        }

        //Act
        const proxy = proxyData.createProxy(user);

        proxy.firstName = 'John';
        proxy.lastName = 'Doe';
        proxy.username = 'johndoe';
        proxy.password = 'senha';
        proxy.email = 'lalala@gmail.com';

        expect(proxy.firstName).toBe('John');
        expect(proxy.lastName).toBe('Doe');
        expect(proxy.username).toBe('johndoe');
        expect(proxy.password).toBe('senha');
        expect(proxy.email).toBe('lalala@gmail.com');
    })
})

function validateProperties(property: string, value: any, changes: Array<{property: string, value: any}>)
{
    changes.forEach((change) => {
        if (change.property === property)
            expect(change.value).toBe(value);
    })
}