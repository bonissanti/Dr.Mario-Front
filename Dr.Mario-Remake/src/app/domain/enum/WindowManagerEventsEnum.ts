export const WindowManagerEventsEnum =
{
    WindowLimitReached: 'window:limit-reached',
    Warn: 'window:warn'
} as const;

export type WindowManagerEventsEnum = typeof WindowManagerEventsEnum[keyof typeof WindowManagerEventsEnum];
