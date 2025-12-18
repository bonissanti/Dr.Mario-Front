// import { faker } from '@faker-js/faker/locale/pt_BR';
// import { UserDTO } from "../../Modules/Auth/Domain/DTO/UserDTO.ts";
//
// describe('UserDTO default creation test', () => {
//     let user: UserDTO;
//
//     beforeEach(() => {
//         user = new UserDTO(faker.person.firstName(),
//             faker.person.lastName(),
//             faker.internet.username(),
//             faker.internet.email(),
//             faker.internet.password(),
//             faker.lorem.word() + ".png");
//     });
//
//     it('should validate user successfully', () => {
//         userCommandHandler.validateUser(user);
//
//     })
// })
import { NotificationContext } from '../../../shared/stores/NotificationContext/NotificationContext.ts';
import type { CreateUserDTO } from '../../../app/pages/Auth/@entities/CreateUserDTO.ts';
import { ProxyData } from '../../../shared/components/ProxyData/ProxyData.ts';
import { ErrorCatalog } from '../../../shared/stores/NotificationContext/ErrorCatalog/ErrorCatalog.ts';
import {describe, beforeEach, it, expect} from 'vitest';

describe('Create User Authentication Form Test', () =>{
    let proxyData: ProxyData;
    let notificationContext: NotificationContext;
    let createUserDTO: CreateUserDTO;

    beforeEach(() =>
    {
        proxyData = new ProxyData();
        notificationContext = new NotificationContext([]);

        createUserDTO = proxyData.createProxy({} as CreateUserDTO, (property, value) => {
            validateInputs(property, value);
        });
    });

    it('Should validate email Sucessfully', () =>
    {
        createUserDTO.email = "invalid-email";

        expect(notificationContext.hasErrors()).toBe(true);
        expect(notificationContext.error[0]).toBe(ErrorCatalog.InvalidEmail);

        notificationContext.cleanErrors();

        createUserDTO.email = "valid@gmail.com";

        expect(notificationContext.hasErrors()).toBe(false);
    })

    it('Should validate a new user successfully', () =>
    {
        //invalid user
        createUserDTO.firstName = "A";
        createUserDTO.lastName = "B";
        createUserDTO.password = "ABC";
        createUserDTO.username = "ABC";
        createUserDTO.email = "invalid-email";

        expect(notificationContext.hasErrors()).toBe(true);
        expect(notificationContext.error[0]).toBe(ErrorCatalog.InvalidFirstName);
        expect(notificationContext.error[1]).toBe(ErrorCatalog.InvalidLastName);
        expect(notificationContext.error[2]).toBe(ErrorCatalog.InvalidPassword);
        expect(notificationContext.error[3]).toBe(ErrorCatalog.InvalidUsername);
        expect(notificationContext.error[4]).toBe(ErrorCatalog.InvalidEmail);

        notificationContext.cleanErrors();

        //Should pass
        createUserDTO.firstName = "Bruno";
        createUserDTO.lastName = "Rodrigues";
        createUserDTO.password = "0123456789";
        createUserDTO.username = "bruno";
        createUserDTO.email = "valid@email.com";

        expect(notificationContext.hasErrors()).toBe(false);
    })

    function validateInputs(property: string, value: any): void
    {
        if (property === 'firstName' && value.length < 2)
            notificationContext.addError(ErrorCatalog.InvalidFirstName);

        if (property === 'lastName' && value.length < 2)
            notificationContext.addError(ErrorCatalog.InvalidLastName);

        if (property === 'password' && (value.length < 8 || value.length > 30))
            notificationContext.addError(ErrorCatalog.InvalidPassword);

        if (property === 'username' && value.length < 5)
            notificationContext.addError(ErrorCatalog.InvalidUsername);

        if (property === 'email' && !value.includes('@'))
            notificationContext.addError(ErrorCatalog.InvalidEmail);
    }
});

