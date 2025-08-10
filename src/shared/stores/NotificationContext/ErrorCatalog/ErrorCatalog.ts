import {ErrorCode} from '../ErrorCode/ErrorCode.ts';

export class ErrorCatalog
{
    public static readonly BadRequest: ErrorCode = new ErrorCode(400, "Bad Request");
    public static readonly Unauthorized: ErrorCode = new ErrorCode(401, "Unauthorized");
    public static readonly Forbidden: ErrorCode = new ErrorCode(403, "Forbidden");
    public static readonly NotFound: ErrorCode = new ErrorCode(404, "Not Found");
    public static readonly InternalServerError: ErrorCode = new ErrorCode(500, "Internal Server Error");
    public static readonly InvalidURIorCallback: ErrorCode = new ErrorCode(100, "Error: uri or callback must be given");
    public static readonly UriAlreadyExists: ErrorCode = new ErrorCode(101, "Error: uri already exists");
    public static readonly InvalidFirstName: ErrorCode = new ErrorCode(102, "Error: first name must be at least 2 characters long");
    public static readonly InvalidLastName: ErrorCode = new ErrorCode(103, "Error: last name must be at least 2 characters long");
    public static readonly InvalidPassword: ErrorCode = new ErrorCode(104, "Error: password must be between 8 and 30 characters long");
    public static readonly InvalidUsername: ErrorCode = new ErrorCode(105, "Error: username must be at least 5 characters long");
    public static readonly InvalidEmail: ErrorCode = new ErrorCode(106, "Error: email must be a valid email address");
}