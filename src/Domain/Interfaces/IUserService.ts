import { AuthResponseDTO } from "../DTO/AuthResponseDTO";
import { OAuthProvider } from "../Enums/OAuthProvider";

export interface IUserService{
    login(email: string, password: string): Promise<AuthResponseDTO>;
    register(email: string, password: string): Promise<AuthResponseDTO>;
    loginOauth2(provider: OAuthProvider): Promise<AuthResponseDTO>;
}