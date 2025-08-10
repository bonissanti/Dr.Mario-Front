import {ISubscription} from "./ISubscription.ts";
import {EventHandler} from "../Type/EventHandler.ts";

export interface IEventBus<T>
{
    publish(event: T, payload?: any): void;
    subscribe(handler: EventHandler<T>): ISubscription;
    unsubscribe(key: string): void;
}