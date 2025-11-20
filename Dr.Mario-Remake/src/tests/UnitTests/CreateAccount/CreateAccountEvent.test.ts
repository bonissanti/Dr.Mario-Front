import { EventBus } from '../../../shared/stores/EventBus/Concrete/EventBus.ts';
import { AuthEventsEnum } from '../../../app/pages/Auth/@entities/AuthEventsEnum.ts';
import { CreateAccountExternalAPI } from '../../../app/pages/Auth/@service/CreateAccountExternalAPI.ts';
import { CreateAccountUIHandler } from '../../../app/pages/Auth/@components/@uihandler/CreateAccountUIHandler.ts';
import { CreateUserDTO } from '../../../app/pages/Auth/@entities/CreateUserDTO.ts';
import { faker } from '@faker-js/faker/locale/pt_BR';

jest.mock('../../../app/pages/Auth/@service/CreateAccountExternalAPI.ts');

describe('Create account event test', () => {
    let eventBus = new EventBus<AuthEventsEnum>();
    let createAccountServiceMock: CreateAccountExternalAPI;
    let uiHandler: CreateAccountUIHandler;
    let consoleSpy: jest.SpyInstance;
    let shadowRoot: ShadowRoot;
    let userUuid: string;

    beforeEach(() => {
        const hostElement = document.createElement('div');
        shadowRoot = hostElement.attachShadow({ mode: 'open' });
        eventBus = new EventBus<AuthEventsEnum>();

        userUuid = crypto.randomUUID();
        createAccountServiceMock = new CreateAccountExternalAPI(eventBus) as jest.Mocked<CreateAccountExternalAPI>;
        createAccountServiceMock.CreateAccount = jest.fn().mockResolvedValue({
            success: true,
            data: { userUuid: userUuid }
        });

        uiHandler = new CreateAccountUIHandler(eventBus, shadowRoot);
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    })

    afterEach(() => {
        consoleSpy.mockRestore();
        uiHandler.dispose();
        jest.clearAllMocks();
    })

    it('CreateAccountUIHandler should receive event and print "Account created successfully"', async () =>{
        await new Promise(resolve => setTimeout(resolve, 0));
        const result = await createAccountServiceMock.CreateAccount(createUserDTOMock);

        expect(uiHandler.isSubscribed()).toBe(true);
        expect(result.data.userUuid).toBe(userUuid);
    });
})

const createUserDTOMock: CreateUserDTO =
{
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    password: "12345",
    confirmPassword: "12345",
    email: faker.internet.email()
};