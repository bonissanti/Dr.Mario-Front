import {ISubscription} from "../Interface/ISubscription.ts";
import {IEventBus} from "../Interface/IEventBus.ts";

export class Subscription<T> implements  ISubscription
{
    private uuid: string;
    private eventBus: IEventBus<T>;

    constructor(uuid: string, eventBus: IEventBus<T>)
    {
        this.uuid = uuid;
        this.eventBus = eventBus;
    }

    unsubscribe(): void
    {
        this.eventBus.unsubscribe(this.uuid);
    }
}