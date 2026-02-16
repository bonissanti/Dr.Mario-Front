import type {ISubscription} from '../../../../../app/utils/EventBus/Interface/ISubscription.ts';
import { EventBus } from '../../../../../app/utils/EventBus/Concrete/EventBus.ts';
import { AuthEventsEnum } from '../../@entities/AuthEventsEnum.ts';
import type { IUIBehavior } from '../../../../../app/utils/UIBehavior/Interface/IUIBehavior.ts';
import { AccountCreatedBehavior } from '../@behaviors/AccountCreatedBehavior.ts';
import { AccountFailedBehavior } from '../@behaviors/AccountFailedBehavior.ts';

export class CreateAccountUIHandler
{
    private subscription!: ISubscription;
    private behaviorChain!: IUIBehavior;

    constructor(eventBus: EventBus<AuthEventsEnum>)
    {
        this.behaviorChain = this.buildBehaviorChain();

        this.subscription = eventBus.subscribe((event: AuthEventsEnum, payload: any) => {
            this.behaviorChain.handle(event, payload);
        })
    }

    public isSubscribed(): boolean
    {
        return this.subscription !== null && this.subscription !== undefined;
    }

    public dispose(): void
    {
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    private buildBehaviorChain(): IUIBehavior
    {
        const accountCreatedBehavior = new AccountCreatedBehavior();
        const accountFailedBehavior = new AccountFailedBehavior();

        return accountCreatedBehavior.setNext(accountFailedBehavior);
    }
}