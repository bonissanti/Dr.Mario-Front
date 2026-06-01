import {CreateAccountExternalAPI} from "../../services/ExternalAPI/Concrete/CreateAccountExternalAPI.ts";
import type {CreateUserDTO} from "../../domain/CreateUserDTO.ts";
import type {APIResponse} from "../APIResponse/APIResponse.ts";

export class MockCreateAccountExternalAPI extends CreateAccountExternalAPI
{
    public async CreateAccount(_userDTO: CreateUserDTO): Promise<APIResponse | undefined>
    {
        const mockResponse = {
            data: {
                statusCode: 200,
                success: true,
                uuid: 'b39cf1f2-1b6c-4676-8823-12c0c65c955c',
                data: 'Account created successfully'
            }
        };

        this.onSuccess(mockResponse.data);
        return mockResponse.data;
    }
}