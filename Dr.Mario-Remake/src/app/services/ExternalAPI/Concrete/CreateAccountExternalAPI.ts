import { EventBus } from '../../../utils/EventBus/Concrete/EventBus.ts';
import { AuthEventsEnum } from '../../../domain/enum/AuthEventsEnum.ts';
import { ExternalAPI } from './ExternalAPI.ts';
import { APIResponse } from '../../../utils/APIResponse/APIResponse.ts';
import type {CreateUserDTO} from "../../../domain/CreateUserDTO.ts";

export class CreateAccountExternalAPI extends ExternalAPI<AuthEventsEnum>
{
    constructor ( authEventBus: EventBus<AuthEventsEnum>)
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
            timestamp: String(new Date())
        });
    }

    protected onError(data: any)
    {
        this.eventHandler.publish(AuthEventsEnum.ACCOUNT_FAILED, {
            error: data.error,
            success: false,
            timestamp: String(new Date())
        });
    }

    protected onException(data: any)
    {
        this.eventHandler.publish(AuthEventsEnum.ACCOUNT_FAILED, {
            error: data.error,
            code: data.code,
            success: false,
            stackTrace: data.stack,
            timestamp: String(new Date())
        });
    }
}