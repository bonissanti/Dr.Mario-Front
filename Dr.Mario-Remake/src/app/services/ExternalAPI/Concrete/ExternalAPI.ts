import axios, {type AxiosInstance} from 'axios';
import type{ IExternalAPI } from '../Interface/IExternalAPI.ts';
import type { IRequestOptions } from '../Interface/IRequestOptions.ts';
import { EventBus } from '../../../utils/EventBus/Concrete/EventBus.ts';
import { APIResponse } from '../../../utils/APIResponse/APIResponse.ts';

export abstract class ExternalAPI<TEventEnum> implements IExternalAPI
{
    protected readonly client: AxiosInstance;
    protected readonly eventHandler: EventBus<TEventEnum>;

    constructor(baseUrl: string, eventBus: EventBus<TEventEnum>)
    {
        this.client = axios.create({
            baseURL: baseUrl,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.eventHandler = eventBus;
    }

    public async post<T>(url: string, data?: T, options?: IRequestOptions): Promise<APIResponse | undefined>
    {
        try
        {
            const response = await this.client.post(`${url}`, data, options);
            return this.handleResult(response);
        }
        catch (error)
        {
            this.onException(error);
            this.handleResult(error);
        }
    }

    public async put<T>(url: string, data?: T, options?: IRequestOptions): Promise<APIResponse>
    {
        try
        {
            const response = await this.client.put(`${url}`, data, options);
            return this.handleResult(response);
        }
        catch (error)
        {
            this.onException(error);
            throw error;
        }
    }

    public async patch<T>(url: string, data?: T, options?: IRequestOptions): Promise<APIResponse>
    {
        try
        {
            const response = await this.client.patch(`${url}`, data, options);
            return this.handleResult(response);
        }
        catch (error)
        {
            this.onException(error);
            throw error;
        }
    }

    public async get(url: string, options?: IRequestOptions): Promise<APIResponse>
    {
        try
        {
            const response = await this.client.get(`${url}`, options);
            return this.handleResult(response);
        }
        catch (error)
        {
            this.onException(error);
            throw error;
        }
    }

    public async delete(url: string, options? : IRequestOptions): Promise<APIResponse>
    {
        try
        {
            const response = await this.client.delete(`${url}`, options);
            return this.handleResult(response);
        }
        catch (error)
        {
            this.onException(error);
            throw error;
        }
    }

    private isSuccess(response: any)
    {
        return response.data.status !== 200 && response.data.success === false;
    }

    private handleResult(response: any)
    {
        if (this.isSuccess(response))
        {
            this.onSuccess(response.data);
            return response.data;
        }

        this.onError(response.data);
        return response.data;
    }

    protected abstract onError(data: any): void;
    protected abstract onSuccess(data: any): void;
    protected abstract onException(data: any): void;
}