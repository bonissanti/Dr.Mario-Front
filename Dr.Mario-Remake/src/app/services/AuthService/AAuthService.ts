export abstract class AAuthService
{
    abstract checkAuthentication(): Promise<boolean>;
}