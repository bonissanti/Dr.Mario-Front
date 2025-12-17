import { ISubscription } from '../../../../../shared/components/EventBus/Interface/ISubscription.ts';
import { EventBus } from '../../../../../shared/components/EventBus/Concrete/EventBus.ts';
import { AuthEventsEnum } from '../../@entities/AuthEventsEnum.ts';
import { IUIBehavior } from '../../../../../shared/components/UIBehavior/Interface/IUIBehavior.ts';
import { AccountCreatedBehavior } from '../@behaviors/AccountCreatedBehavior.ts';
import { AccountFailedBehavior } from '../@behaviors/AccountFailedBehavior.ts';

export class CreateAccountUIHandler
{
    private subscription!: ISubscription;
    private behaviorChain!: IUIBehavior;

    constructor(eventBus: EventBus<AuthEventsEnum>, shadowRoot: ShadowRoot| null)
    {
        if (!shadowRoot)
            return;

        this.behaviorChain = this.buildBehaviorChain(shadowRoot);

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

    private buildBehaviorChain(shadowRoot: ShadowRoot): IUIBehavior
    {
        const accountCreatedBehavior = new AccountCreatedBehavior(shadowRoot);
        const accountFailedBehavior = new AccountFailedBehavior(shadowRoot);

        return accountCreatedBehavior.setNext(accountFailedBehavior);
    }
}