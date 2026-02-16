export interface CreateAccountStyleConfig
{
    initialVisibility: string;
    initialOpacity: string;
    transition: string;
    visibleOpacity: string;
}

export interface CreateAccountBehaviorConfig
{
    debounceDelay: number;
    warningDuration: number;
}

export interface ICreateAccountConfig
{
    style: CreateAccountStyleConfig;
    behavior: CreateAccountBehaviorConfig;
}