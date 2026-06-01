import axios, {type AxiosInstance} from 'axios';
import {AAuthService} from "./AAuthService.ts";

export class AuthService extends AAuthService
{
    private readonly authUrl: string = 'http://localhost:3000/api/auth/me'; //TODU: future env
    protected readonly client: AxiosInstance;
    private isAuthenticated: boolean = false;
    private cachedAuthCheck: { timestamp: number; result: boolean } | null = null;
    private readonly CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

    public constructor()
    {
        super()
        this.client = axios.create({
            baseURL: this.authUrl,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public async checkAuthentication(): Promise<boolean>
    {
        if (this.cachedAuthCheck &&
            Date.now() - this.cachedAuthCheck.timestamp < this.CACHE_DURATION)
            return this.cachedAuthCheck.result;

        try
        {
            const response = await this.client.post(this.authUrl);
            this.isAuthenticated = response.data.success;

            this.cachedAuthCheck = {
                timestamp: Date.now(),
                result: this.isAuthenticated
            };

            return this.isAuthenticated;
        }
        catch (error)
        {
            this.isAuthenticated = false;
            console.error(error);
            return false;
        }
    }
}