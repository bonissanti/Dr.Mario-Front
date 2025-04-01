class LoginCredentials {
}

class User {
}

export interface IAuthenticationService {
    login(credentials: LoginCredentials): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): User | null;
}