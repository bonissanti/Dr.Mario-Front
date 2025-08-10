// import { ErrorCatalog } from '../NotificationContext/ErrorCatalog/ErrorCatalog.ts';
// import { NotificationContext } from '../NotificationContext/NotificationContext.ts';

export class HTTPResponse extends Error {
    public readonly status: number;
    public readonly message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }


}