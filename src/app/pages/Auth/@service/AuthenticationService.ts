import { Repository } from '../../../../shared/stores/Repository/Repository.ts';
import { CreateUserDTO } from '../@components/@dto/Authentication/CreateUserDTO.ts';

export class AuthenticationService extends Repository<CreateUserDTO>
{
    override readonly endpoint: string = '/auth/';

    constructor()
    {
        super();
    }

    public async createUser(createUserDTO: CreateUserDTO): Promise<CreateUserDTO>
    {
        return this.create(createUserDTO);
    }
}