export class APIResponse
{
    public readonly statusCode: number;
    public readonly success: boolean;
    public readonly uuid: any;
    public readonly data: any;

    constructor(statusCode: number, success: boolean, uuid: any, data: any)
    {
        this.statusCode = statusCode;
        this.success = success;
        this.data = data;
        this.uuid = uuid;
    }
}