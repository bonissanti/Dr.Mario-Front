export class APIResponse

{
    public readonly statusCode: number;
    public readonly data: any;
    public readonly success: boolean;

    constructor(statusCode: number, data: any, success: boolean)
    {
        this.statusCode = statusCode;
        this.data = data;
        this.success = success;
    }
}