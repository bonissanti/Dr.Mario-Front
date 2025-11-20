export interface CreateUserDTO
{
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    countryWithEmoji?: string;
    birthDate?: Date;
}