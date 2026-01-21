import { AuthEventsEnum } from '../../../../app-deprecated/pages/Auth/@entities/AuthEventsEnum.ts';

export interface IUIBehavior
{
    handle(event: AuthEventsEnum, payload: any): void
}