import type {ISubscription} from "../../utils/EventBus/Interface/ISubscription.ts";
import type {IUIBehavior} from "../../utils/UIBehavior/Interface/IUIBehavior.ts";
import type {EventBus} from "../../utils/EventBus/Concrete/EventBus.ts";
import {
    AccountCreatedBehavior
} from "../../../app-deprecated/pages/Auth/@components/@behaviors/AccountCreatedBehavior.ts";
import {
    AccountFailedBehavior
} from "../../../app-deprecated/pages/Auth/@components/@behaviors/AccountFailedBehavior.ts";

export class SignUpIUBehaviorHandler
{
    private readonly subscription: ISubscription;
    private readonly behaviorChain: IUIBehavior;

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

    //TODU: separate this into a dependency injection container
    private buildBehaviorChain(): IUIBehavior
    {
        const accountCreatedBehavior = new AccountCreatedBehavior();
        const accountFailedBehavior = new AccountFailedBehavior();

        return accountCreatedBehavior.setNext(accountFailedBehavior);
    }
}
