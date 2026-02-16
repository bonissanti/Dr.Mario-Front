export const AuthEventsEnum = {
    ACCOUNT_CREATED: 1,
    ACCOUNT_FAILED: 2
} as const;

export type AuthEventsEnum = typeof AuthEventsEnum[keyof typeof AuthEventsEnum];