export class ErrorCode
{
    public readonly code: number;
    public readonly message: string;

    constructor(code: number, message: string)
    {
        this.code = code;
        this.message = message;
    }

    public toString(): string
    {
        return `${this.code} | ${this.message}`;
    }
}