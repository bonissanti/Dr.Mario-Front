export interface IAuthService
{
    checkAuthentication(): Promise<boolean>;
}