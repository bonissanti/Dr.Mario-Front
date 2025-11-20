import { EventBus } from '../../../../shared/stores/EventBus/Concrete/EventBus.ts';
import { AuthEventsEnum } from '../@entities/AuthEventsEnum.ts';
import { ExternalAPI } from '../../../../shared/services/Concrete/ExternalAPI.ts';
import { CreateUserDTO } from '../@entities/CreateUserDTO.ts';
import { APIResponse } from '../../../../shared/stores/APIResponse/APIResponse.ts';

export class CreateAccountExternalAPI extends ExternalAPI<AuthEventsEnum>
{
    constructor (public authEventBus: EventBus<AuthEventsEnum>)
    {
        super('http:localhost:3002', authEventBus);
    }

    public async CreateAccount(userDTO: CreateUserDTO): Promise<APIResponse | undefined>
    {
        return this.post('/createAccount', userDTO);
    }

    protected onSuccess(data: any)
    {
        this.eventHandler.publish(AuthEventsEnum.ACCOUNT_CREATED, {
            user: data.userUuid,
            success: true,
            timestamp: Date() // ou date.now()
        });
    }

    protected onError(data: any)
    {
        this.eventHandler.publish(AuthEventsEnum.ACCOUNT_FAILED, {
            error: data.error,
            success: false,
            timestamp: Date()
        });
    }

    protected onException(data: any)
    {
        this.eventHandler.publish(AuthEventsEnum.ACCOUNT_FAILED, {
            error: data.error,
            code: data.code,
            success: false,
            stackTrace: data.stack,
            timestamp: Date()
        });
    }
}