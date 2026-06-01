import { AuthEventsEnum } from '../../../domain/enum/AuthEventsEnum.ts';

export interface IUIBehavior
{
    handle(event: AuthEventsEnum, payload: any): void
}