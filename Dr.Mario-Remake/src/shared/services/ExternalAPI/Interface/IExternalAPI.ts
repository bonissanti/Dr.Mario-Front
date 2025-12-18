import { APIResponse } from '../../../components/APIResponse/APIResponse.ts';
import type { IRequestOptions } from './IRequestOptions.ts';

export interface IExternalAPI
{
    post<T = any>(url: string, data?: T, options?: IRequestOptions): Promise<APIResponse | undefined>
    put<T = any>(url: string, data?: T, options?: IRequestOptions): Promise<APIResponse>
    patch<T = any>(url: string, data?: T, options?: IRequestOptions): Promise<APIResponse>
    get(url: string, options?: IRequestOptions): Promise<APIResponse>
    delete(url: string, options?: IRequestOptions): Promise<APIResponse>
}