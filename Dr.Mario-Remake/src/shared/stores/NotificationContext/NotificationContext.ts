import { ErrorCatalog } from './ErrorCatalog/ErrorCatalog.ts';

export class NotificationContext
{
    constructor(public error: ErrorCatalog[])
    {
        this.error = [];
    }

    public addError(error: ErrorCatalog)
    {
        this.error.push(error);
    }

    public cleanErrors()
    {
        this.error.length = 0;
    }

    public hasErrors(): boolean
    {
        return this.error.length > 0;
    }

    public toString(): string
    {
        return this.error.map((error) => error.toString()).join('\n');
    }

    public getErrorCode(statusCode: number): void
    {
        switch (statusCode)
        {
            case 400:
                this.error.push(ErrorCatalog.BadRequest);
                break;
            case 401:
                this.error.push(ErrorCatalog.Unauthorized);
                break;
            case 403:
                this.error.push(ErrorCatalog.Forbidden);
                break;
            case 404:
                this.error.push(ErrorCatalog.NotFound);
                break;
            default:
                this.error.push(ErrorCatalog.InternalServerError);
                break;
        }
    }
}