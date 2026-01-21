import type {IEventBus} from "../Interface/IEventBus.ts";
import type {EventHandler} from "../Type/EventHandler.ts";
import {defaultEventBusOptions, type EventBusOptions} from "../Type/EventBusOptions.ts";
import type {ISubscription} from "../Interface/ISubscription.ts";
import {Subscription} from "./Subscription.ts";

export class EventBus<T> implements IEventBus<T>
{
    private readonly handlers: Map<string, EventHandler<T>> = new Map();
    private options: EventBusOptions = defaultEventBusOptions;

    constructror(options: EventBusOptions = defaultEventBusOptions)
    {
        this.options = options;
    }

    publish(event: T, payload?: any): void
    {
        this.handlers.forEach((handler) =>{
            handler(event, payload);
        })
    }

    subscribe(handler: EventHandler<T>): ISubscription
    {
        let uuid: string = crypto.randomUUID();

        if (this.options.processCurrentEventOnSubscribe)
            this.handlers.set(uuid, handler);
        else
            setTimeout(() => this.handlers.set(uuid, handler));

        return new Subscription<T>(uuid, this);
    }

    unsubscribe(key: string): void
    {
        this.handlers.delete(key);
    }
}