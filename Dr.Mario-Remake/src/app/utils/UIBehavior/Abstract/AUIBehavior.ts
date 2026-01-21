import type { IUIBehavior } from '../Interface/IUIBehavior.ts';
import { AuthEventsEnum } from '../../../../app-deprecated/pages/Auth/@entities/AuthEventsEnum.ts';

export abstract class AUIBehavior implements IUIBehavior
{
    protected next?: IUIBehavior;
    protected shadowRoot: ShadowRoot;

    constructor(shadowRoot: ShadowRoot)
    {
        this.shadowRoot = shadowRoot;
    }

    public setNext(behavior: IUIBehavior): IUIBehavior
    {
        this.next = behavior;
        return behavior;
    }

    public handle(event: AuthEventsEnum, payload: any): void
    {
        if (this.canHandle(event))
            this.execute(payload);

        if (this.next)
            this.next.handle(event, payload);
    }

    protected abstract canHandle(event: AuthEventsEnum): boolean;
    protected abstract execute(payload: any): void;
}