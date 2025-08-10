import { IRepository } from './IRepository.ts';
import { HTTPResponse } from '../HTTPResponse/HTTPResponse.ts';

export abstract class Repository<T> implements IRepository<T>
{
    protected abstract endpoint: string;

    public async create(dto: T): Promise<T>
    {
        const response = await fetch(`/api/${this.endpoint}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dto)
        });

        if (!response.ok)
            throw new HTTPResponse(response.status, response.statusText);

        return await response.json();
    }

    public async update(uuid: string, dto: T): Promise<T>
    {
        const response = await fetch(`api/${this.endpoint}:/${uuid}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dto)
        })

        if (!response.ok)
            throw new Error(`Failed to update: ${response.status}`);

        return await response.json();
    }

    public async delete(uuid: string, dto: T): Promise<T>
    {
        const response = await fetch(`/api/${this.endpoint}:/${uuid}`,{
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dto)
        })

        if (!response.ok)
            throw new Error(`Failed to delete: ${response.status}`);

        return await response.json();
    }

    public async get(uuid: string): Promise<T>
    {
        const response = await fetch(`/api/${this.endpoint}:/${uuid}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (response.ok)
            throw new Error(`Failed to get: ${response.status}`);

        return await response.json();
    }
}